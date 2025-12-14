# Persona System - UI Mockup & User Flow

## User Experience Flow

```
┌─────────────────────────────────────────┐
│  WHERE THE CROW LANDS                   │
│  [Navigation]                           │
└─────────────────────────────────────────┘

STEP 1: CHOOSE YOUR GUIDE
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  "Select a spiritual guide to craft your spell"              │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ [Avatar] │  │ [Avatar] │  │ [Avatar] │  │ [Avatar] │   │
│  │          │  │          │  │          │  │          │   │
│  │Ceremonial│  │  Hedge   │  │ Kitchen  │  │  Druid   │   │
│  │ Magician │  │  Witch   │  │  Witch   │  │          │   │
│  │          │  │          │  │          │  │          │   │
│  │ Golden   │  │   Folk   │  │Practical │  │  Celtic  │   │
│  │  Dawn    │  │  Magic   │  │  Magic   │  │  Nature  │   │
│  │          │  │          │  │          │  │          │   │
│  │[SELECT]  │  │[SELECT]  │  │[SELECT]  │  │[SELECT]  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  [Show 4 more guides...]                                     │
└─────────────────────────────────────────────────────────────┘

                        ↓ User selects one

STEP 2: DESCRIBE YOUR NEED
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  Guided by: The Hedge Witch                                 │
│  [Portrait] "I'll craft a practical folk remedy for you"    │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ What do you need help with?                           │  │
│  │                                                         │  │
│  │ [Large text area]                                      │  │
│  │                                                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  [CRAFT MY SPELL] button                                     │
│                                                               │
│  Examples for Hedge Witch:                                   │
│  • Home protection                                           │
│  • Herbal healing                                            │
│  • Garden blessing                                           │
└─────────────────────────────────────────────────────────────┘

                        ↓ AI generates

STEP 3: YOUR CUSTOM SPELL
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  Spell by The Hedge Witch                                   │
│  ═══════════════════════════════════════                     │
│                                                               │
│  "For your need, I recommend a traditional hedgerow         │
│  charm using rosemary and rowan berries..."                 │
│                                                               │
│  MATERIALS NEEDED:                                           │
│  • Fresh rosemary sprig                                      │
│  • Red thread or yarn                                        │
│  • Small pouch or cloth                                      │
│                                                               │
│  RITUAL STEPS:                                               │
│  1. On a waxing moon, gather your rosemary...               │
│  2. Bind the herbs with red thread while saying...          │
│                                                               │
│  HISTORICAL PRECEDENT:                                       │
│  This charm follows traditional British cunning folk        │
│  practices documented in Owen Davies' "Cunning-Folk"...     │
│                                                               │
│  [COPY SPELL] [TRY DIFFERENT GUIDE] [NEW PROBLEM]          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Persona Card Design

```
┌────────────────────────────────┐
│         [PORTRAIT]              │
│                                 │
│   The Ceremonial Magician      │
│   ─────────────────────────    │
│                                 │
│   School: Golden Dawn          │
│   Period: 1910-1945            │
│                                 │
│   Specialties:                 │
│   • Protection rituals         │
│   • Qabalistic work            │
│   • Angelic invocations        │
│                                 │
│   "I guide seekers through     │
│   the structured path of       │
│   ceremonial practice."        │
│                                 │
│   [CHOOSE THIS GUIDE]          │
│                                 │
└────────────────────────────────┘
```

## Comparison View (Advanced Feature)

Users could compare how different guides approach the same problem:

```
YOUR PROBLEM: "Need protection during difficult meeting"

┌───────────────────────────────────────────────────────────┐
│                                                            │
│  The Ceremonial Magician says:                            │
│  ────────────────────────────                             │
│  "Perform the Lesser Banishing Ritual of the Pentagram    │
│   before leaving home. Visualize a sphere of white        │
│   light..."                                               │
│                                                            │
│  The Hedge Witch says:                                    │
│  ────────────────────                                     │
│  "Tuck a sprig of rosemary in your left pocket and        │
│   carry an iron nail. These traditional charms..."        │
│                                                            │
│  The Kitchen Witch says:                                  │
│  ─────────────────────                                    │
│  "Brew protection tea before you leave. As you stir,      │
│   visualize yourself speaking with confidence..."         │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

## Implementation Details

### Persona Database Schema
```json
{
  "id": "ceremonial-magician",
  "name": "The Ceremonial Magician",
  "title": "Master of the Golden Dawn Tradition",
  "school": "Ceremonial Magic / Golden Dawn",
  "period": "1910-1945",
  "background": "Long description...",
  "approach": "Uses formal rituals...",
  "specialties": ["Protection", "Spiritual development", "Divination"],
  "materials": ["Candles", "Incense", "Ritual tools"],
  "avoids": ["Casual approach", "Unprepared work"],
  "sample_language": "Begin by performing...",
  "sources": ["The Golden Dawn (Regardie)", "Psychic Self-Defence (Fortune)"],
  "best_for": ["Protection", "Complex workings", "Spiritual growth"],
  "portrait_url": "path/to/image.jpg",
  "color_scheme": {
    "primary": "#d4af37",
    "secondary": "#2d2436"
  }
}
```

### AI Prompt Template
```javascript
const generateSpell = async (problem, persona) => {
  const prompt = `You are ${persona.name}, ${persona.background}

YOUR APPROACH: ${persona.approach}
YOUR SPECIALTIES: ${persona.specialties.join(', ')}
MATERIALS YOU PREFER: ${persona.materials.join(', ')}
WHAT YOU AVOID: ${persona.avoids.join(', ')}
YOUR SOURCES: ${persona.sources.join(', ')}

A practitioner comes to you seeking guidance:
"${problem}"

Respond AS THIS PERSONA, in their voice and style. Create a spell using YOUR specific tradition and approach.

Include:
1. Opening in your characteristic voice
2. Materials from your tradition
3. Step-by-step instructions in your style
4. Historical precedent from your sources
5. Explanation of why you chose this approach

Stay completely in character. This is how YOU would handle this need.`;

  return await aiAPI.chat(prompt);
};
```

### Page Layout Options

**Option A: Two-Step (Simpler)**
```
Page 1: /spell-request
  - Choose persona → goes to persona-specific request page

Page 2: /spell-request/:persona-id
  - Shows persona info at top
  - Request form below
  - Generate spell
```

**Option B: Single Page with Tabs (Current recommendation)**
```
/spell-request
  Tab 1: Choose Guide (persona gallery)
  Tab 2: Request Spell (appears after selection)
  Tab 3: Your Spell (appears after generation)
```

**Option C: Modal Flow (Smoothest)**
```
/spell-request (main page with explanation)
  
  Click "Request Spell" button
  ↓
  Modal 1: "Choose Your Guide" (persona cards)
  ↓
  Modal 2: "Describe Your Need" (with selected persona visible)
  ↓
  Result: Spell appears on main page
```

## Design Considerations

### Persona Card Styling
- Each persona could have their own color scheme
- Ceremonial: Gold/purple (current theme)
- Hedge Witch: Green/brown (earthy)
- Kitchen Witch: Warm oranges/yellows
- Druid: Forest greens/silver
- Thelemic: Deep purple/crimson

### Visual Hierarchy
1. Persona selection is prominent (they should feel important)
2. Selected persona remains visible during spell request
3. Generated spell clearly shows which persona created it
4. Easy to try different persona for same problem

### Mobile Considerations
- Persona cards stack vertically on mobile
- Swipe between personas (carousel)
- Collapsible persona info
- Fixed "Choose Guide" button at bottom

## Example Personas (Placeholder Until You Provide Real Ones)

I can start with these basic templates:

1. **The Ceremonial Magician** (Golden Dawn/Fortune)
2. **The Hedge Witch** (British folk magic)
3. **The Kitchen Witch** (Practical hearth magic)
4. **The Druid** (Celtic revival)
5. **The Traditional Witch** (Gardnerian Wicca)

Then you can refine/replace with your detailed descriptions.

## Next Steps

**Tell me:**

1. **How many personas** do you want to start with? (5-10 recommended)

2. **Which traditions** should they represent? 
   - Must-haves?
   - Nice-to-haves?

3. **Do you have descriptions ready** or should I help you write them?

4. **Any specific historical figures** to base them on?
   - e.g., "The Fortune Practitioner" based on Dion Fortune
   - "The Gardnerian" based on Gardner's teachings

5. **Visual assets?**
   - Do you have or can you get portrait images?
   - Or should we use symbolic imagery (pentacles, cauldrons, etc.)?

Once you give me the persona descriptions, I'll implement the full system!
