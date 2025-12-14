from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.llm.openai.image_generation import OpenAIImageGeneration
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

class ImageGenerationRequest(BaseModel):
    prompt: str

class FavoriteRequest(BaseModel):
    item_type: str
    item_id: str

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
    user = {
        'id': user_id,
        'email': user_data.email,
        'name': user_data.name,
        'password_hash': hash_password(user_data.password),
        'favorites': [],
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user)
    
    token = create_token(user_id)
    user_response = UserResponse(id=user_id, email=user_data.email, name=user_data.name)
    return AuthResponse(token=token, user=user_response)

@api_router.post('/auth/login', response_model=AuthResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({'email': credentials.email}, {'_id': 0})
    if not user or not verify_password(credentials.password, user['password_hash']):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    
    token = create_token(user['id'])
    user_response = UserResponse(id=user['id'], email=user['email'], name=user['name'])
    return AuthResponse(token=token, user=user_response)

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

# AI Chat endpoint
@api_router.post('/ai/chat')
async def chat_with_ai(message_data: ChatMessage):
    try:
        session_id = message_data.session_id or str(uuid.uuid4())
        
        system_message = """You are an expert historian specializing in the occult revival period (1910-1945), 
        traditional witchcraft, Celtic spirituality, and esoteric practices. You have deep knowledge of deities like 
        Hecate and The Morrigan, historical figures like Gerald Gardner, Dion Fortune, and Aleister Crowley, 
        and sacred sites across the UK and Europe. Provide historically accurate, well-sourced information 
        with a scholarly yet accessible tone befitting the rich Bloomsbury intellectual aesthetic."""
        
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=system_message
        ).with_model('openai', 'gpt-5.1')
        
        user_message = UserMessage(text=message_data.message)
        response = await chat.send_message(user_message)
        
        return {'response': response, 'session_id': session_id}
    except Exception as e:
        logging.error(f'AI chat error: {str(e)}')
        raise HTTPException(status_code=500, detail='Failed to process chat request')

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