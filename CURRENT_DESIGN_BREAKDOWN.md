# Current Design Breakdown - Visual Reference

## What's Currently Used

### Color Palette
```
🎨 PRIMARY COLORS:
├─ Background:    #120f14 (Deep midnight plum - almost black with purple undertone)
├─ Text:          #f3f2e9 (Warm cream/off-white)
├─ Primary Gold:  #d4af37 (Art deco gold - THE signature color)
├─ Cards:         #1c1821 (Slightly lighter than background)
└─ Borders:       #383042 (Subtle purple-grey)

🌹 ACCENT COLORS:
├─ Rose:          #c08e9b (Bloomsbury rose - used for subheadings)
├─ Green:         #6b8e4a (Artichoke green - buttons/accents)
├─ Orange:        #cc5500 (Burnt orange - highlights)
└─ Deep Purple:   #2d2436 (Secondary backgrounds)

⚠️ UTILITY COLORS:
├─ Error/Delete:  #7f1d1d (Deep red)
├─ Muted text:    #9ca3af (Grey for less important text)
└─ Input fields:  #2a2430 (Dark purple-grey)
```

### Typography Scale
```
🔤 FONTS IN USE:
├─ Headings:      Italiana (elegant, thin serif)
├─ Subheadings:   Cinzel Decorative (ornate, mystical)
└─ Body/UI:       Montserrat (clean, modern sans-serif)

📏 SIZE SCALE:
├─ Hero H1:       text-5xl md:text-7xl (48px → 72px)
├─ Page H1:       text-4xl md:text-6xl (36px → 60px)
├─ H2:            text-3xl md:text-5xl (30px → 48px)
├─ H3:            text-xl md:text-2xl  (20px → 24px)
├─ Body:          text-base md:text-lg (16px → 18px)
└─ Small/Labels:  text-sm to text-xs   (14px → 12px)
```

### Component Styles

#### Glass Cards
```
Current recipe:
- Background: bg-card/50 (semi-transparent)
- Backdrop blur: backdrop-blur-md
- Border: 1px solid rgba(212, 175, 55, 0.2) - subtle gold
- Padding: p-8 (32px)
- Border radius: rounded-sm (small, sharp corners)
- Hover: border becomes more visible (primary/30)
- Transition: smooth 500ms
```

#### Buttons
```
Primary button:
- Background: gold (#d4af37)
- Text: dark (primary-foreground)
- Border: subtle gold border
- Hover: slightly darker
- Style: uppercase, wide letter spacing
- Shadow: subtle glow effect

Secondary button:
- Background: transparent
- Border: gold outline
- Text: gold
- Hover: gold tint background
```

#### Navigation
```
Top bar style:
- Height: 80px (h-20)
- Background: semi-transparent with blur
- Sticky to top
- Gold accent for active page
- Small icon + text links
- Compact, sophisticated
```

### Layout System
```
Container: max-w-7xl (1280px max width)
Padding: px-6 md:px-12 (24px → 48px)
Spacing between sections: py-24 md:py-32
Grid: Uses CSS Grid for card layouts
- 1 column mobile
- 2-3 columns tablet
- 3-4 columns desktop
```

### Visual Effects
```
✨ WHAT CREATES THE "MYSTICAL" FEEL:

1. Backdrop blur on cards (glass-morphism)
2. Subtle noise texture on body background
3. Gold glow on hover (box-shadow)
4. Smooth fade-in animations (framer-motion)
5. Custom gold scrollbar
6. Dark color palette with warm accents
7. Generous whitespace (not cramped)
8. Thin, elegant fonts
```

## What Each Page Uses

### Home Page
- Full-height hero with background image overlay
- Large typography with gold primary heading
- Two CTA buttons (primary + secondary style)
- 4-column grid of feature cards below
- Text section with centered content

### Spell Request Page
- Two-column layout (input left, output right)
- Large textarea for user input
- Example buttons with hover states
- Output area with copy/clear buttons
- Warning/info boxes with icons

### Content Pages (Deities, Figures, Sites, Rituals)
- Page title centered at top
- 3-column grid of cards
- Cards have image at top, text below
- Click to open modal with full details
- Modal uses same glass-card style

### Timeline Page
- Single column layout
- Circular year markers (gold)
- Vertical line connecting events
- Cards offset from the line
- Category badges on each event

### Navigation
- Logo area: Moon icon + two-line text
- Center: Horizontal link list with icons
- Right: Login button or user menu
- Compact, doesn't take much vertical space

## Current Assets in Use

### Images
```
🖼️ HERO:
- Dark mystical abstract (Unsplash)
- URL: photo-1643324896137-f0928e76202a

📸 DEITIES (Stock photos - need replacing):
- Hecate: photo-1711906485337-af335d9810a4
- Morrigan: photo-1745520470002-391193461501
- Cerridwen: photo-1661619669807-784e46af8029
- Arianrhod: photo-1643324896137-f0928e76202a

👤 HISTORICAL FIGURES (Stock portraits - need replacing):
- All using generic portrait stock photos
- Need authentic historical photos

🗿 SACRED SITES (Good - actual locations):
- Stonehenge, Glastonbury, etc.
- Using real location photos

🎨 DECORATIVE:
- Art deco textures (subtle)
- Noise overlay (very subtle)
```

### Icons
```
Using Lucide React icon library:
- Moon (logo, deities)
- Sparkles (spell request)
- BookOpen, Users, MapPin, etc.
- Thin stroke width (1.5px) - elegant
```

## What Gives It The Current "Vibe"

### Why it feels "1920s Bloomsbury":
1. ✓ Art deco gold color
2. ✓ Elegant serif fonts (Italiana)
3. ✓ Ornate accent font (Cinzel Decorative)
4. ✓ Dark, moody background
5. ✓ Jewel tone accents (rose, green)
6. ✓ Sophisticated, intellectual copy
7. ✓ Literary references in text
8. ✓ Glass/blur effects (modern take on translucent)

### Why it feels "occult":
1. ✓ Dark color scheme
2. ✓ Moon and mystical icons
3. ✓ Mysterious imagery
4. ✓ Smooth, slow animations
5. ✓ Glow effects
6. ✓ Gothic-influenced typography
7. ✓ Subject matter (obviously)

### Why it feels "DIY/accessible":
1. ✓ Clear navigation
2. ✓ Readable body text
3. ✓ Practical UI (spell request form)
4. ✓ Example buttons/templates
5. ✓ Conversational copy
6. ✓ Not too formal/stuffy

## Quick Changes for Different Vibes

### Want it DARKER/MORE WITCHY?
```
- Background → #000000 (pure black)
- Primary → #8b0000 (dark red) or #5b21b6 (deep purple)
- Remove blur effects → solid cards
- Darker fonts → heavier weights
- More dramatic shadows
```

### Want it LIGHTER/MORE ACCESSIBLE?
```
- Background → #2d2d2d (dark grey) or even light backgrounds
- More contrast
- Brighter accent colors
- Larger fonts
- Less blur/effects
```

### Want it MORE EARTHY/NATURAL?
```
- Browns/greens replace purples
- Wood/stone textures
- Botanical imagery
- Warmer tones
- Natural serif fonts
```

### Want it MORE MODERN/MINIMAL?
```
- High contrast (black/white)
- One bold accent color
- Simple sans-serif everywhere
- Flat design (no blur/shadows)
- More whitespace
- Sharp, clean lines
```

## Files to Edit for Design Changes

### Colors:
1. `/app/frontend/tailwind.config.js` (main color definitions)
2. `/app/frontend/src/index.css` (CSS variables)

### Typography:
1. `/app/frontend/src/index.css` (Google Fonts import)
2. `/app/frontend/tailwind.config.js` (font family config)

### Images:
1. `/app/backend/seed_data.py` (change image URLs)
2. Re-run seed: `cd /app/backend && python seed_data.py`

### Components:
1. Individual component files in `/app/frontend/src/`
2. Shared styles in components like `GlassCard.js`

## Show Me What You Want!

To customize, just tell me:
1. **Vibe change**: "Make it more _____ and less _____"
2. **Color preferences**: Show me examples or describe
3. **Any assets**: Logo, images, fonts you want to use
4. **Specific tweaks**: "Change the gold to silver" etc.

I can make changes in 5-10 minutes once you tell me what you want!
