from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict
import uuid
import json
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.llm.openai.image_generation import OpenAIImageGeneration
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

# Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    subscription_tier: str = "free"
    subscription_status: str = "active"
    spell_generation_count: int = 0

class AuthResponse(BaseModel):
    token: str
    user: UserResponse

class Deity(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    origin: str
    description: str
    history: str
    associated_practices: List[str]
    image_url: str
    time_period: str

class HistoricalFigure(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    birth_death: str
    bio: str
    contributions: str
    associated_works: List[str]
    image_url: str

class SacredSite(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    location: str
    country: str
    coordinates: dict
    historical_significance: str
    time_period: str
    image_url: str

class Ritual(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    deity_association: Optional[str]
    time_period: str
    source: str
    category: str

class TimelineEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    year: int
    title: str
    description: str
    category: str

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None
    archetype: Optional[str] = None  # Optional archetype ID for persona-based responses

class SpellRequest(BaseModel):
    intention: str
    archetype: Optional[str] = None
    generate_image: bool = True

class ImageGenerationRequest(BaseModel):
    prompt: str

class FavoriteRequest(BaseModel):
    item_type: str
    item_id: str

class SaveSpellRequest(BaseModel):
    spell_data: dict
    archetype_id: Optional[str] = None
    archetype_name: Optional[str] = None
    archetype_title: Optional[str] = None
    image_base64: Optional[str] = None

class SavedSpellResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    spell_data: dict
    archetype_id: Optional[str] = None
    archetype_name: Optional[str] = None
    archetype_title: Optional[str] = None
    image_base64: Optional[str] = None
    created_at: str
    title: str

# Helper functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(days=30)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def check_spell_generation_limit(user: dict) -> dict:
    """Check if user can generate spell and return status"""
    subscription_tier = user.get('subscription_tier', 'free')
    
    if subscription_tier == 'paid':
        return {'can_generate': True, 'remaining': -1, 'limit': -1}
    
    # Free tier - limit to 3 spells
    count = user.get('spell_generation_count', 0)
    limit = 3
    
    return {
        'can_generate': count < limit,
        'remaining': max(0, limit - count),
        'limit': limit,
        'current_count': count
    }

async def increment_spell_count(user_id: str):
    """Increment user's spell generation count"""
    await db.users.update_one(
        {'id': user_id},
        {
            '$inc': {
                'spell_generation_count': 1,
                'total_spells_generated': 1
            }
        }
    )

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get('user_id')
        user = await db.users.find_one({'id': user_id}, {'_id': 0})
        if not user:
            raise HTTPException(status_code=401, detail='User not found')
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Token expired')
    except Exception:
        raise HTTPException(status_code=401, detail='Invalid token')

# Auth endpoints
@api_router.post('/auth/register', response_model=AuthResponse)
async def register(user_data: UserRegister):
    existing = await db.users.find_one({'email': user_data.email}, {'_id': 0})
    if existing:
        raise HTTPException(status_code=400, detail='Email already registered')
    
    user_id = str(uuid.uuid4())
    current_time = datetime.now(timezone.utc)
    user = {
        'id': user_id,
        'email': user_data.email,
        'name': user_data.name,
        'password_hash': hash_password(user_data.password),
        'favorites': [],
        'created_at': current_time.isoformat(),
        
        # Subscription fields
        'subscription_tier': 'free',
        'subscription_status': 'active',
        'subscription_start': None,
        'subscription_end': None,
        'stripe_customer_id': None,
        'stripe_subscription_id': None,
        
        # Usage tracking
        'spell_generation_count': 0,
        'spell_generation_reset': (current_time + timedelta(days=30)).isoformat(),
        'total_spells_generated': 0,
        'total_spells_saved': 0,
        
        # Analytics
        'last_login': current_time.isoformat(),
        'upgraded_at': None
    }
    await db.users.insert_one(user)
    
    token = create_token(user_id)
    user_response = UserResponse(
        id=user_id, 
        email=user_data.email, 
        name=user_data.name,
        subscription_tier='free',
        subscription_status='active',
        spell_generation_count=0
    )
    return AuthResponse(token=token, user=user_response)

@api_router.post('/auth/login', response_model=AuthResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({'email': credentials.email}, {'_id': 0})
    if not user or not verify_password(credentials.password, user['password_hash']):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    
    # Update last login
    await db.users.update_one(
        {'id': user['id']},
        {'$set': {'last_login': datetime.now(timezone.utc).isoformat()}}
    )
    
    token = create_token(user['id'])
    user_response = UserResponse(
        id=user['id'], 
        email=user['email'], 
        name=user['name'],
        subscription_tier=user.get('subscription_tier', 'free'),
        subscription_status=user.get('subscription_status', 'active'),
        spell_generation_count=user.get('spell_generation_count', 0)
    )
    return AuthResponse(token=token, user=user_response)

# User profile update endpoints
class UpdateEmailRequest(BaseModel):
    new_email: EmailStr
    password: str  # Require password for security

@api_router.post('/auth/update-email', response_model=UserResponse)
async def update_email(request: UpdateEmailRequest, user = Depends(get_current_user)):
    """Update user's email address"""
    
    # Verify password
    if not verify_password(request.password, user['password_hash']):
        raise HTTPException(status_code=401, detail='Incorrect password')
    
    # Check if new email is already taken
    existing = await db.users.find_one({'email': request.new_email}, {'_id': 0})
    if existing and existing['id'] != user['id']:
        raise HTTPException(status_code=400, detail='Email already in use')
    
    # Update email
    await db.users.update_one(
        {'id': user['id']},
        {'$set': {'email': request.new_email}}
    )
    
    return UserResponse(
        id=user['id'],
        email=request.new_email,
        name=user['name'],
        subscription_tier=user.get('subscription_tier', 'free'),
        subscription_status=user.get('subscription_status', 'active'),
        spell_generation_count=user.get('spell_generation_count', 0)
    )

# Deities endpoints
@api_router.get('/deities', response_model=List[Deity])
async def get_deities():
    deities = await db.deities.find({}, {'_id': 0}).to_list(100)
    return deities

@api_router.get('/deities/{deity_id}', response_model=Deity)
async def get_deity(deity_id: str):
    deity = await db.deities.find_one({'id': deity_id}, {'_id': 0})
    if not deity:
        raise HTTPException(status_code=404, detail='Deity not found')
    return deity

# Historical Figures endpoints
@api_router.get('/historical-figures', response_model=List[HistoricalFigure])
async def get_figures():
    figures = await db.historical_figures.find({}, {'_id': 0}).to_list(100)
    return figures

@api_router.get('/historical-figures/{figure_id}', response_model=HistoricalFigure)
async def get_figure(figure_id: str):
    figure = await db.historical_figures.find_one({'id': figure_id}, {'_id': 0})
    if not figure:
        raise HTTPException(status_code=404, detail='Figure not found')
    return figure

# Sacred Sites endpoints
@api_router.get('/sacred-sites', response_model=List[SacredSite])
async def get_sites():
    sites = await db.sacred_sites.find({}, {'_id': 0}).to_list(100)
    return sites

@api_router.get('/sacred-sites/{site_id}', response_model=SacredSite)
async def get_site(site_id: str):
    site = await db.sacred_sites.find_one({'id': site_id}, {'_id': 0})
    if not site:
        raise HTTPException(status_code=404, detail='Site not found')
    return site

# Rituals endpoints
@api_router.get('/rituals', response_model=List[Ritual])
async def get_rituals(category: Optional[str] = None):
    query = {'category': category} if category else {}
    rituals = await db.rituals.find(query, {'_id': 0}).to_list(100)
    return rituals

@api_router.get('/rituals/{ritual_id}', response_model=Ritual)
async def get_ritual(ritual_id: str):
    ritual = await db.rituals.find_one({'id': ritual_id}, {'_id': 0})
    if not ritual:
        raise HTTPException(status_code=404, detail='Ritual not found')
    return ritual

# Timeline endpoints
@api_router.get('/timeline', response_model=List[TimelineEvent])
async def get_timeline():
    events = await db.timeline_events.find({}, {'_id': 0}).sort('year', 1).to_list(100)
    return events

# Archetype personas for AI spell generation
ARCHETYPE_PERSONAS = {
    'shiggy': {
        'name': 'Sheila "Shiggy" Tayler',
        'title': 'The Psychic Matriarch',
        'system_prompt': """You ARE Sheila "Shiggy" Tayler, the psychic matriarch of post-war London. You blend poetry, psychic intuition, and practical courage. Your voice is warm, witty, empathetic, and grounded in lived experience.

YOUR BACKGROUND: You survived WWII London—bombings, rationing, loss. You found solace in birdsong and the Rubáiyát of Omar Khayyam. You guard family secrets with the "veil spell" and believe deeply in the magic of ordinary moments.

YOUR APPROACH TO MAGIC:
- Use poetry and spoken affirmations (especially Rubáiyát-inspired)
- Include practical courage rituals from Churchill's Home Guard
- Invoke ancestors and the unseen world
- Interpret bird omens (especially crows and zebra finches)
- Blend spiritualism with household charms
- Emphasize: "Courage is a daily practice, not an innate trait"

YOUR TENETS:
- Life is fleeting; cherish the present moment
- Question dogma and inherited beliefs
- Seek beauty and meaning in the ordinary
- Use poetry and metaphor to access deeper truths
- Small acts of bravery accumulate into real change

SPEAK AS SHIGGY—candid, witty, practical, and mystical. Every ritual you create is tailored and personal. Draw from the Rubáiyát, Home Guard courage, and wartime spiritualism."""
    },
    'kathleen': {
        'name': 'Kathleen Winifred Malzard',
        'title': 'The Keeper of Secrets',
        'system_prompt': """You ARE Kathleen Winifred Malzard, the quiet keeper of secrets and lore. You bridge Irish Catholic and Huguenot traditions. Your voice is gentle, protective, mysterious, and wise.

YOUR BACKGROUND: You survived family reinvention, hidden adoptions, and two world wars. You served in the Women's Voluntary Service. You guard photos, documents, and the "veil spell" that protects truth and reputation.

YOUR APPROACH TO MAGIC:
- Use family documents and photographs as ritual objects
- Create protective charms for home and family
- Practice table-tapping and fortune-telling
- Navigate secrecy—knowing when to reveal and when to guard
- Blend Irish Catholic and Huguenot traditions
- Specialize in breaking generational curses

YOUR TENETS:
- Some truths protect; some truths destroy
- Adaptation is its own form of magic
- Documents and photos hold ancestral power
- The veil between worlds is thin for those who listen
- Every transition is a ritual waiting to be performed

SPEAK AS KATHLEEN—layered, protective, mysterious. Your magic always considers the cost and power of secrets. Guide users through protection, resilience, and navigating family complexity."""
    },
    'catherine': {
        'name': 'Catherine Cosgrove (née Foy)',
        'title': 'The Bird-Witch',
        'system_prompt': """You ARE Catherine Cosgrove, the "bird-witch" of Victorian Spitalfields. You embody creative fusion of Huguenot and Irish traditions. Your voice is imaginative, folkloric, nurturing, and joyful.

YOUR BACKGROUND: A Spitalfields artisan, musician, and mother. You blended music, folklore, and protective magic. Your heart belongs to the making of things: songs, spells, and stories that weave family together.

YOUR APPROACH TO MAGIC:
- Use music and song as spells
- Incorporate craft and artisan practices
- Practice bird magic—feathers, songs, nature motifs
- Blend Huguenot and Irish folk traditions
- Honor working-class and artisan roots
- Create with joy as the highest form of magic

YOUR TENETS:
- Creation is its own form of prayer
- The hands know magic the mind forgets
- Birds carry messages between worlds
- Every song is a spell waiting to be sung
- Blend what works; discard what doesn't
- Joy is the highest form of magic

SPEAK AS CATHERINE—creative, folkloric, nurturing. Celebrate the user's creativity. Offer musical rituals, craft-based spells, and cross-cultural wisdom. Always encourage creative expression."""
    },
    'theresa': {
        'name': 'Theresa Tayler',
        'title': 'The Seer & Storyteller',
        'system_prompt': """You ARE Theresa Tayler, the convergence point—journalist, historian, seer, storyteller. You uncovered hidden paternity, mapped generational trauma, and broke the "veil spell." Your voice is direct, candid, emotionally honest, analytical, and mystical.

YOUR BACKGROUND: You blended research with intuition, using birds as spiritual messengers and stories as spells for healing. You experience regular bird encounters as spiritual continuity.

YOUR APPROACH TO MAGIC:
- Use storytelling and journaling as ritual
- Combine research with intuition
- Practice psychological ritual for healing
- Interpret bird signs and omens
- Break generational patterns through naming them
- Integrate past and present through narrative

YOUR TENETS:
- Truth is the foundation of all real magic
- Every family has hidden stories waiting to be told
- Research and intuition work together
- Breaking patterns requires naming them first
- Your story is a spell you cast on the future
- Birds appear when the ancestors are speaking

SPEAK AS THERESA—direct, honest, research-driven, mystical. Honor the user's search for truth. Offer rituals that combine research, storytelling, and healing. Encourage them to write their own legend."""
    }
}

DEFAULT_SYSTEM_MESSAGE = """You are a wise guide in the tradition of Where the Crowlands—a place where ancestral wisdom meets practical magic. You help seekers craft rituals and spells based on tested patterns from the occult revival period (1910-1945), blending historical accuracy with personal empowerment.

Your tone is supportive, honest, and grounded. Magic is not mysterious—it's a science of intention, repetition, and symbolic frameworks. You don't gatekeep; you empower.

When creating spells or rituals:
1. Provide a practical formula
2. List required materials (historically attested where possible)
3. Give clear ritual steps
4. Cite historical precedent from figures like Gardner, Fortune, Crowley, or traditional folk magic
5. Be clear about what is documented historical practice vs. modern adaptation

Remember: Every spell is a formula others have used. Users can adapt, break, and build their own. No intermediaries necessary."""

# AI Chat endpoint
@api_router.post('/ai/chat')
async def chat_with_ai(message_data: ChatMessage):
    try:
        session_id = message_data.session_id or str(uuid.uuid4())
        
        # Determine system message based on archetype
        if message_data.archetype and message_data.archetype in ARCHETYPE_PERSONAS:
            persona = ARCHETYPE_PERSONAS[message_data.archetype]
            system_message = persona['system_prompt']
        else:
            system_message = DEFAULT_SYSTEM_MESSAGE
        
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=system_message
        ).with_model('openai', 'gpt-5.1')
        
        user_message = UserMessage(text=message_data.message)
        response = await chat.send_message(user_message)
        
        return {'response': response, 'session_id': session_id, 'archetype': message_data.archetype}
    except Exception as e:
        logging.error(f'AI chat error: {str(e)}')
        raise HTTPException(status_code=500, detail='Failed to process chat request')

# Archetypes endpoint - returns all archetypes data
@api_router.get('/archetypes')
async def get_archetypes():
    """Return all available archetypes for the frontend"""
    archetypes = []
    for archetype_id, persona in ARCHETYPE_PERSONAS.items():
        archetypes.append({
            'id': archetype_id,
            'name': persona['name'],
            'title': persona['title']
        })
    return archetypes

# Historical sources database for citations
HISTORICAL_SOURCES = {
    'protection': [
        {'author': 'Dion Fortune', 'work': 'Psychic Self-Defence', 'year': 1930, 'quote': 'The best defence is a strong aura'},
        {'author': 'Israel Regardie', 'work': 'The Golden Dawn', 'year': 1937, 'quote': 'The Lesser Banishing Ritual of the Pentagram'},
        {'author': 'Doreen Valiente', 'work': 'Witchcraft for Tomorrow', 'year': 1978, 'quote': 'Traditional British cunning craft'},
    ],
    'courage': [
        {'author': 'Aleister Crowley', 'work': 'Magick in Theory and Practice', 'year': 1929, 'quote': 'Do what thou wilt shall be the whole of the Law'},
        {'author': 'Dion Fortune', 'work': 'The Mystical Qabalah', 'year': 1935, 'quote': 'Geburah, the sphere of Mars and courage'},
    ],
    'love': [
        {'author': 'Gerald Gardner', 'work': 'Witchcraft Today', 'year': 1954, 'quote': 'The Great Rite and sacred union'},
        {'author': 'Doreen Valiente', 'work': 'An ABC of Witchcraft', 'year': 1973, 'quote': 'Love magic in the old tradition'},
    ],
    'healing': [
        {'author': 'Dion Fortune', 'work': 'Sane Occultism', 'year': 1929, 'quote': 'The healing power of the mind'},
        {'author': 'Israel Regardie', 'work': 'The Middle Pillar', 'year': 1938, 'quote': 'Energy work for healing'},
    ],
    'divination': [
        {'author': 'A.E. Waite', 'work': 'The Pictorial Key to the Tarot', 'year': 1911, 'quote': 'The wisdom of the cards'},
        {'author': 'Aleister Crowley', 'work': 'The Book of Thoth', 'year': 1944, 'quote': 'Tarot as a map of consciousness'},
    ],
    'ancestors': [
        {'author': 'Gerald Gardner', 'work': 'The Meaning of Witchcraft', 'year': 1959, 'quote': 'The Old Religion and ancestor veneration'},
        {'author': 'Margaret Murray', 'work': 'The Witch-Cult in Western Europe', 'year': 1921, 'quote': 'Historical practices of communion with the dead'},
    ],
    'general': [
        {'author': 'Dion Fortune', 'work': 'Applied Magic', 'year': 1962, 'quote': 'Practical techniques for the modern practitioner'},
        {'author': 'W.E. Butler', 'work': 'The Magician: His Training and Work', 'year': 1959, 'quote': 'Foundational magical practice'},
    ]
}

# Archetype-specific image style prompts
ARCHETYPE_IMAGE_STYLES = {
    'shiggy': 'vintage WWII era wartime poster style, Rubáiyát of Omar Khayyám illustration, Edmund Dulac aesthetic, muted earth tones with gold accents, birds and poetry motifs, 1940s British home front imagery',
    'kathleen': 'Edwardian spiritualist séance aesthetic, West End London 1920s, coded wartime symbolism, Victorian mourning jewelry motifs, sepia tones, protective talismans, mysterious veiled imagery',
    'catherine': 'Art Nouveau and Art Deco fusion, Spitalfields artisan craft, folk spiritualist imagery, bird illustrations, musical instruments, Huguenot and Irish folk art blend, warm earthy colors with gold leaf',
    'theresa': 'modern collage aesthetic with vintage elements, birds in flight, family photographs and artifacts, investigative journalism style, truth-seeking imagery, contemporary with ancestral echoes',
    'neutral': 'vintage occult grimoire illustration, woodcut engraving style, parchment texture, mystical symbols, 1920s-1940s esoteric art'
}

# Enhanced spell generation endpoint with structured output
@api_router.post('/ai/generate-spell')
async def generate_spell(
    request: SpellRequest,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
):
    """Generate a structured spell with historical context and optional imagery"""
    try:
        # Check if user is authenticated
        user = None
        if credentials:
            try:
                token = credentials.credentials
                payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
                user_id = payload.get('user_id')
                user = await db.users.find_one({'id': user_id}, {'_id': 0})
            except:
                pass  # Anonymous user
        
        # Check generation limits for authenticated users
        if user:
            limit_check = await check_spell_generation_limit(user)
            if not limit_check['can_generate']:
                raise HTTPException(
                    status_code=403, 
                    detail={
                        'error': 'spell_limit_reached',
                        'message': f"You've reached your limit of {limit_check['limit']} free spells. Upgrade to Pro for unlimited spell generation!",
                        'limit': limit_check['limit'],
                        'current_count': limit_check['current_count']
                    }
                )
        
        session_id = str(uuid.uuid4())
        archetype_id = request.archetype
        
        # Get archetype info
        if archetype_id and archetype_id in ARCHETYPE_PERSONAS:
            persona = ARCHETYPE_PERSONAS[archetype_id]
            archetype_name = persona['name']
            archetype_title = persona['title']
        else:
            archetype_id = None
            archetype_name = 'The Crowlands Guide'
            archetype_title = 'Keeper of Ancestral Wisdom'
        
        # Fetch related content from database for context
        deities = await db.deities.find({}, {'_id': 0, 'name': 1, 'description': 1}).to_list(10)
        rituals = await db.rituals.find({}, {'_id': 0, 'name': 1, 'description': 1}).to_list(10)
        figures = await db.historical_figures.find({}, {'_id': 0, 'name': 1, 'bio': 1}).to_list(10)
        
        # Build context from database
        db_context = ""
        if deities:
            db_context += f"\\nRELEVANT DEITIES FROM OUR ARCHIVE: {', '.join([d['name'] for d in deities])}"
        if rituals:
            db_context += f"\\nRELEVANT RITUALS FROM OUR ARCHIVE: {', '.join([r['name'] for r in rituals])}"
        if figures:
            db_context += f"\\nHISTORICAL FIGURES TO REFERENCE: {', '.join([f['name'] for f in figures])}"
        
        # Build the structured prompt
        structured_prompt = f"""Create a spell/ritual for this intention: "{request.intention}"

You MUST respond with a JSON object in this EXACT format (no markdown, just pure JSON):
{{
    "title": "A poetic, evocative title for this spell",
    "subtitle": "A brief tagline or description (10 words max)",
    "introduction": "A 2-3 sentence personal introduction in your voice, speaking directly to the seeker",
    "materials": [
        {{"name": "Material name", "icon": "candle|herb|crystal|feather|water|fire|moon|sun|book|pen|mirror|salt|oil|incense|bell|cord|photo|bowl", "note": "Brief note on why/how to use"}},
    ],
    "timing": {{
        "moon_phase": "New Moon|Waxing|Full Moon|Waning|Any",
        "time_of_day": "Dawn|Morning|Noon|Dusk|Night|Midnight|Any",
        "day": "Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Any",
        "note": "Brief explanation of timing significance"
    }},
    "steps": [
        {{"number": 1, "title": "Step title", "instruction": "Detailed instruction", "duration": "5 minutes", "note": "Optional tip or variation"}}
    ],
    "spoken_words": {{
        "invocation": "Words to speak at the beginning (can be poetry, affirmation, or prayer)",
        "main_incantation": "The central words of power for this spell",
        "closing": "Words to seal and close the ritual"
    }},
    "historical_context": {{
        "tradition": "Name the magical tradition this draws from",
        "time_period": "1910-1945 or relevant era",
        "practitioners": ["Historical figures who used similar practices"],
        "sources": [
            {{"author": "Author name", "work": "Book/work title", "year": 1930, "relevance": "How this source relates to the spell"}}
        ],
        "cultural_notes": "Any important cultural or historical context"
    }},
    "variations": [
        {{"name": "Variation name", "description": "How to adapt for different needs"}}
    ],
    "warnings": ["Any cautions or ethical considerations"],
    "closing_message": "A personal message of encouragement in your voice",
    "image_prompt": "A detailed prompt to generate a header image for this spell (describe visual elements, mood, symbols)"
}}

IMPORTANT GUIDELINES:
- Include 4-8 materials with appropriate icons
- Include 5-8 detailed steps
- Cite at least 2-3 historical sources with real books/authors from the 1910-1945 period
- The spoken_words should feel authentic to your tradition
- Make the historical_context genuinely educational
{db_context}

Respond ONLY with the JSON object, no other text."""

        # Get system message based on archetype
        if archetype_id and archetype_id in ARCHETYPE_PERSONAS:
            system_message = ARCHETYPE_PERSONAS[archetype_id]['system_prompt'] + "\\n\\nYou must respond with structured JSON as specified."
        else:
            system_message = DEFAULT_SYSTEM_MESSAGE + "\\n\\nYou must respond with structured JSON as specified."
        
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=system_message
        ).with_model('openai', 'gpt-5.1')
        
        user_message = UserMessage(text=structured_prompt)
        response = await chat.send_message(user_message)
        
        # Parse the JSON response
        import json
        try:
            # Clean up response if needed (remove markdown code blocks)
            clean_response = response.strip()
            if clean_response.startswith('```'):
                clean_response = clean_response.split('```')[1]
                if clean_response.startswith('json'):
                    clean_response = clean_response[4:]
            clean_response = clean_response.strip()
            
            spell_data = json.loads(clean_response)
        except json.JSONDecodeError:
            # If JSON parsing fails, return the raw response
            spell_data = {
                'title': 'Your Custom Spell',
                'raw_response': response,
                'parse_error': True
            }
        
        # Generate image if requested
        image_base64 = None
        if request.generate_image and 'image_prompt' in spell_data:
            try:
                style = ARCHETYPE_IMAGE_STYLES.get(archetype_id or 'neutral', ARCHETYPE_IMAGE_STYLES['neutral'])
                image_prompt = f"{style}, {spell_data['image_prompt']}, mystical ritual scene, no text"
                
                image_gen = OpenAIImageGeneration(api_key=EMERGENT_LLM_KEY)
                images = await image_gen.generate_images(
                    prompt=image_prompt,
                    model='gpt-image-1',
                    number_of_images=1
                )
                
                if images and len(images) > 0:
                    image_base64 = base64.b64encode(images[0]).decode('utf-8')
            except Exception as img_error:
                logging.error(f'Spell image generation error: {str(img_error)}')
        
        # Increment spell count for authenticated free users
        if user and user.get('subscription_tier') == 'free':
            await increment_spell_count(user['id'])
        
        # Get updated limit info for response
        limit_info = None
        if user:
            updated_user = await db.users.find_one({'id': user['id']}, {'_id': 0})
            limit_check = await check_spell_generation_limit(updated_user)
            limit_info = {
                'remaining': limit_check['remaining'],
                'limit': limit_check['limit'],
                'subscription_tier': user.get('subscription_tier', 'free')
            }
        
        return {
            'spell': spell_data,
            'image_base64': image_base64,
            'archetype': {
                'id': archetype_id,
                'name': archetype_name,
                'title': archetype_title
            },
            'session_id': session_id,
            'limit_info': limit_info
        }
        
    except Exception as e:
        logging.error(f'Spell generation error: {str(e)}')
        raise HTTPException(status_code=500, detail=f'Failed to generate spell: {str(e)}')

# AI Image Generation endpoint
@api_router.post('/ai/generate-image')
async def generate_image(request: ImageGenerationRequest):
    try:
        image_gen = OpenAIImageGeneration(api_key=EMERGENT_LLM_KEY)
        images = await image_gen.generate_images(
            prompt=f"1920s-1940s mystical art style, {request.prompt}, art deco influences, rich jewel tones, Bloomsbury aesthetic",
            model='gpt-image-1',
            number_of_images=1
        )
        
        if images and len(images) > 0:
            image_base64 = base64.b64encode(images[0]).decode('utf-8')
            return {'image_base64': image_base64}
        else:
            raise HTTPException(status_code=500, detail='No image was generated')
    except Exception as e:
        logging.error(f'Image generation error: {str(e)}')
        raise HTTPException(status_code=500, detail='Failed to generate image')

# Favorites endpoints
@api_router.post('/favorites')
async def add_favorite(request: FavoriteRequest, user = Depends(get_current_user)):
    favorite = {'type': request.item_type, 'id': request.item_id}
    await db.users.update_one(
        {'id': user['id']},
        {'$addToSet': {'favorites': favorite}}
    )
    return {'success': True}

@api_router.get('/favorites')
async def get_favorites(user = Depends(get_current_user)):
    user_data = await db.users.find_one({'id': user['id']}, {'_id': 0})
    return user_data.get('favorites', [])

@api_router.delete('/favorites')
async def remove_favorite(request: FavoriteRequest, user = Depends(get_current_user)):
    favorite = {'type': request.item_type, 'id': request.item_id}
    await db.users.update_one(
        {'id': user['id']},
        {'$pull': {'favorites': favorite}}
    )
    return {'success': True}

# Grimoire (Saved Spells) endpoints
@api_router.post('/grimoire/save', response_model=SavedSpellResponse)
async def save_spell_to_grimoire(request: SaveSpellRequest, user = Depends(get_current_user)):
    """Save a generated spell to the user's personal grimoire"""
    
    # Check subscription - only paid users can save
    subscription_tier = user.get('subscription_tier', 'free')
    if subscription_tier == 'free':
        raise HTTPException(
            status_code=403,
            detail={
                'error': 'feature_locked',
                'message': 'Upgrade to Pro to save spells to your grimoire! Only $19/year for unlimited saves.',
                'feature': 'save_spell'
            }
        )
    
    spell_id = str(uuid.uuid4())
    
    # Extract title from spell data for easy display
    title = request.spell_data.get('title', 'Untitled Spell')
    
    saved_spell = {
        'id': spell_id,
        'user_id': user['id'],
        'spell_data': request.spell_data,
        'archetype_id': request.archetype_id,
        'archetype_name': request.archetype_name,
        'archetype_title': request.archetype_title,
        'image_base64': request.image_base64,
        'title': title,
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.user_spells.insert_one(saved_spell)
    
    # Increment saved spell counter
    await db.users.update_one(
        {'id': user['id']},
        {'$inc': {'total_spells_saved': 1}}
    )
    
    return SavedSpellResponse(**saved_spell)

@api_router.get('/grimoire/spells', response_model=List[SavedSpellResponse])
async def get_user_grimoire(user = Depends(get_current_user)):
    """Retrieve all spells saved by the current user"""
    spells = await db.user_spells.find(
        {'user_id': user['id']}, 
        {'_id': 0}
    ).sort('created_at', -1).to_list(100)
    
    return spells

@api_router.delete('/grimoire/spells/{spell_id}')
async def delete_saved_spell(spell_id: str, user = Depends(get_current_user)):
    """Delete a saved spell from the user's grimoire"""
    result = await db.user_spells.delete_one({
        'id': spell_id,
        'user_id': user['id']
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail='Spell not found or unauthorized')
    
    return {'success': True, 'message': 'Spell deleted from grimoire'}

# Subscription endpoints
@api_router.get('/subscription/status')
async def get_subscription_status(user = Depends(get_current_user)):
    """Get current user's subscription status and limits"""
    limit_check = await check_spell_generation_limit(user)
    
    return {
        'subscription_tier': user.get('subscription_tier', 'free'),
        'subscription_status': user.get('subscription_status', 'active'),
        'spell_limit': limit_check['limit'],
        'spells_remaining': limit_check['remaining'],
        'spells_used': user.get('spell_generation_count', 0),
        'total_spells_generated': user.get('total_spells_generated', 0),
        'total_spells_saved': user.get('total_spells_saved', 0),
        'can_save_spells': user.get('subscription_tier') == 'paid',
        'can_download_pdf': user.get('subscription_tier') == 'paid'
    }

@api_router.post('/subscription/upgrade-manual')
async def manual_upgrade_user(user_email: str, admin_key: str):
    """Admin endpoint to manually upgrade a user (for testing before Stripe)"""
    # Simple admin key check (change this in production!)
    if admin_key != os.environ.get('ADMIN_KEY', 'change-me-in-production'):
        raise HTTPException(status_code=403, detail='Unauthorized')
    
    user = await db.users.find_one({'email': user_email}, {'_id': 0})
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    
    current_time = datetime.now(timezone.utc)
    await db.users.update_one(
        {'email': user_email},
        {
            '$set': {
                'subscription_tier': 'paid',
                'subscription_status': 'active',
                'subscription_start': current_time.isoformat(),
                'subscription_end': (current_time + timedelta(days=365)).isoformat(),
                'upgraded_at': current_time.isoformat()
            }
        }
    )
    
    return {'success': True, 'message': f'User {user_email} upgraded to paid tier'}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=['*'],
    allow_headers=['*'],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event('shutdown')
async def shutdown_db_client():
    client.close()