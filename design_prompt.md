# 🎰 Gaple Game - Neo Classic Casino Theme Redesign

## 📌 CRITICAL INSTRUCTIONS

**THIS IS A FULL VISUAL REDESIGN - NOT A MINOR STYLING UPDATE**

### What to Change:
✅ ALL colors across entire application
✅ ALL typography (font, sizes, weights, hierarchy)
✅ ALL component styling (buttons, cards, inputs, etc)
✅ ALL spacing and layout (consistent 8px grid)
✅ ALL animations and transitions
✅ ALL page designs (home, matchmaking, lobby, game)

### What to PRESERVE:
❌ DO NOT change existing functionality
❌ DO NOT change logic or state management
❌ DO NOT change socket events or data flow
❌ DO NOT change component structure (keep same components, just restyle)
❌ DO NOT change navbar content/links (keep existing items)

---

## 🎨 THEME OVERVIEW: NEO CLASSIC CASINO

**Atmosphere:**
Premium, elegant casino experience - like playing domino at a high-end casino table

**Feel:**
- Calm, focused, and competitive
- Modern interface with traditional influence
- Professional and mature

**Avoid:**
- Playful or colorful game UI
- Overly futuristic or neon styles (no cyan/purple)
- Generic SaaS dashboard look
- Bright, cheerful colors

---

## 🎨 PART 1: COLOR SYSTEM (GLOBAL REPLACEMENT)

### Primary Color Palette

**Background Colors:**
```css
--bg-primary: #0a3d2e;        /* Deep emerald green - main background */
--bg-secondary: #072820;       /* Darker green - for depth */
--bg-surface: #0d3b2f;         /* Surface panels */
--bg-elevated: #11473a;        /* Elevated surfaces */
--bg-table: #1a5c45;           /* Casino table green (game board) */
```

**Accent Colors:**
```css
--accent-gold: #d4af37;        /* Gold - primary accent */
--accent-gold-light: #f0d58c; /* Light gold - hover states */
--accent-gold-dark: #b8941f;  /* Dark gold - active states */
--accent-brass: #c5a572;       /* Brass - secondary accent */
--accent-ivory: #f5f0e8;       /* Muted ivory - contrast */
```

**Text Colors:**
```css
--text-primary: #f5f0e8;       /* Off-white - main text */
--text-secondary: #c4b5a0;     /* Warm gray - secondary text */
--text-muted: #8a7d6f;         /* Muted warm gray - labels */
--text-gold: #d4af37;          /* Gold text for emphasis */
```

**Border & Outline:**
```css
--border-subtle: rgba(212, 175, 55, 0.15);   /* Subtle gold border */
--border-default: rgba(212, 175, 55, 0.25);  /* Default border */
--border-strong: rgba(212, 175, 55, 0.4);    /* Strong border */
```

**Shadow & Glow:**
```css
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
--glow-gold: 0 0 20px rgba(212, 175, 55, 0.3);
--glow-gold-strong: 0 0 30px rgba(212, 175, 55, 0.5);
```

**Status Colors (Subtle):**
```css
--status-success: #5a8f6a;     /* Muted green */
--status-warning: #b8941f;     /* Dark gold */
--status-error: #8b4545;       /* Muted red */
--status-info: #5a7d8f;        /* Muted blue-gray */
```

### Usage Guidelines:

- **Primary Background**: Use `--bg-primary` for main page background
- **Surface/Cards**: Use `--bg-surface` or `--bg-elevated` with subtle borders
- **Game Board**: Use `--bg-table` (casino table green) with texture
- **Gold Accent**: Use SPARINGLY for:
  - Primary buttons
  - Active/selected states
  - Important highlights
  - Call-to-action elements
- **Ivory**: Use for high contrast areas (modals, tooltips)
- **Text**: Always ensure high contrast on dark backgrounds

---

## 🎨 PART 2: TYPOGRAPHY SYSTEM

### Font Family:
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

**Alternative if Inter not available:** Use system fonts (clean, modern sans-serif)

### Font Sizes & Hierarchy:

```css
/* Display (for hero sections) */
--text-display: 56px;
--text-display-weight: 700;
--text-display-spacing: -0.02em;
--text-display-line-height: 1.1;

/* Headings */
--text-h1: 40px;
--text-h1-weight: 700;
--text-h1-spacing: -0.01em;
--text-h1-line-height: 1.2;

--text-h2: 32px;
--text-h2-weight: 600;
--text-h2-spacing: -0.01em;
--text-h2-line-height: 1.25;

--text-h3: 24px;
--text-h3-weight: 600;
--text-h3-spacing: 0;
--text-h3-line-height: 1.3;

--text-h4: 20px;
--text-h4-weight: 600;
--text-h4-spacing: 0;
--text-h4-line-height: 1.4;

/* Body */
--text-body-lg: 18px;
--text-body-lg-weight: 400;
--text-body-lg-line-height: 1.6;

--text-body: 16px;
--text-body-weight: 400;
--text-body-line-height: 1.5;

--text-body-sm: 14px;
--text-body-sm-weight: 400;
--text-body-sm-line-height: 1.5;

/* Labels & UI */
--text-label: 12px;
--text-label-weight: 500;
--text-label-spacing: 0.05em;
--text-label-line-height: 1.4;

--text-caption: 11px;
--text-caption-weight: 400;
--text-caption-line-height: 1.3;
```

### Typography Guidelines:

- **Headings**: Bold, tight spacing, clear hierarchy
- **Body Text**: Regular weight, highly readable
- **Labels**: Smaller, subtle, uppercase optional for emphasis
- **Avoid**: Decorative fonts, script fonts, overly playful typography
- **Consistency**: Use defined sizes only, no random font sizes

---

## 🎨 PART 3: SPACING SYSTEM (8px Grid)

```css
--space-1: 4px;    /* 0.5 unit */
--space-2: 8px;    /* 1 unit */
--space-3: 12px;   /* 1.5 units */
--space-4: 16px;   /* 2 units */
--space-5: 20px;   /* 2.5 units */
--space-6: 24px;   /* 3 units */
--space-8: 32px;   /* 4 units */
--space-10: 40px;  /* 5 units */
--space-12: 48px;  /* 6 units */
--space-16: 64px;  /* 8 units */
--space-20: 80px;  /* 10 units */
--space-24: 96px;  /* 12 units */
```

**Container Padding:**
- Mobile: `--space-4` or `--space-6`
- Tablet: `--space-6` or `--space-8`
- Desktop: `--space-8` or `--space-12`

**Component Spacing:**
- Between sections: `--space-16` or `--space-20`
- Between cards: `--space-6` or `--space-8`
- Inside cards: `--space-6`
- Button padding: `--space-3` to `--space-6`

---

## 🎨 PART 4: COMPONENT STYLING

### 4.1 Cards / Panels

**Default Card:**
```css
background: var(--bg-surface);
border: 1px solid var(--border-subtle);
border-radius: 12px;
padding: var(--space-6);
box-shadow: var(--shadow-sm);
```

**Elevated Card (hover state):**
```css
background: var(--bg-elevated);
border-color: var(--border-default);
box-shadow: var(--shadow-md);
transition: all 0.2s ease;
```

**Premium Card (important sections):**
```css
background: linear-gradient(135deg, var(--bg-surface), var(--bg-elevated));
border: 1px solid var(--border-strong);
border-radius: 12px;
box-shadow: var(--shadow-md), var(--glow-gold);
```

**Guidelines:**
- Soft rounded corners (8-16px, not too large)
- Subtle borders with gold tint
- Light inner shadow for depth
- Avoid flat, sharp corners

### 4.2 Buttons

**Primary Button (Gold):**
```css
background: linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dark));
color: var(--bg-primary);
border: none;
border-radius: 8px;
padding: var(--space-3) var(--space-6);
font-weight: 600;
box-shadow: var(--shadow-sm), var(--glow-gold);
transition: all 0.2s ease;
```

**Primary Hover:**
```css
background: linear-gradient(135deg, var(--accent-gold-light), var(--accent-gold));
box-shadow: var(--shadow-md), var(--glow-gold-strong);
transform: translateY(-1px);
```

**Secondary Button (Outline):**
```css
background: transparent;
color: var(--accent-gold);
border: 1px solid var(--accent-gold);
border-radius: 8px;
padding: var(--space-3) var(--space-6);
font-weight: 600;
transition: all 0.2s ease;
```

**Secondary Hover:**
```css
background: rgba(212, 175, 55, 0.1);
border-color: var(--accent-gold-light);
color: var(--accent-gold-light);
```

**Disabled State:**
```css
opacity: 0.4;
cursor: not-allowed;
box-shadow: none;
```

**Button Guidelines:**
- Use gold gradient for primary actions
- Subtle glow effect on hover
- Smooth transitions (200-300ms)
- Clear visual feedback

### 4.3 Input Fields

**Default Input:**
```css
background: rgba(0, 0, 0, 0.3);
border: 1px solid var(--border-subtle);
border-radius: 8px;
padding: var(--space-3) var(--space-4);
color: var(--text-primary);
font-size: var(--text-body);
transition: all 0.2s ease;
```

**Focus State:**
```css
border-color: var(--accent-gold);
box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
outline: none;
```

**Error State:**
```css
border-color: var(--status-error);
```

**Input Guidelines:**
- Dark, semi-transparent background
- Subtle border, gold highlight on focus
- Clear placeholder text (muted color)

### 4.4 Icons

**Icon Style:**
- Minimal, outline style (not filled)
- Consistent stroke width (1.5-2px)
- Size: 20-24px for UI icons, 16-18px for inline
- Color: `--text-secondary` default, `--accent-gold` for active

**Icon Usage:**
- Use sparingly
- Consistent set (Material Symbols or Lucide)
- Avoid decorative icons

---

## 🎨 PART 5: PAGE-SPECIFIC REDESIGN

### 5.1 LANDING PAGE (HOME)

**Overall Feel:**
- Premium casino entry experience
- Calm, sophisticated atmosphere
- Clear focus on main actions

**Hero Section:**
- **Background**: 
  - Gradient from `--bg-secondary` to `--bg-primary`
  - Subtle vignette effect (darker edges)
  - Optional: Faint texture overlay (felt/fabric)

- **Headline**:
  - Large, bold (use display size)
  - Color: `--text-primary` with subtle gold accent on keyword
  - Confident tone: "Experience Classic Domino"
  
- **Subheadline**:
  - Body-lg size
  - Color: `--text-secondary`
  - Supporting message: "Premium multiplayer experience"

- **CTA Buttons**:
  - "Create Room" (primary gold button)
  - "Join Room" (secondary outline button)
  - Spacing: `--space-4` between buttons

**Stats Section:**
- 3 stat cards in grid
- Each card: glass-like effect with subtle gold border
- Icon + Large number + Label
- Spacing: consistent `--space-8` gap

**Features Section:**
- Clean, elegant cards (2x2 grid on desktop, 1 column mobile)
- Minimal icons (outline style)
- No playful visuals
- Each card:
  - Gold icon at top
  - Title (h4)
  - Description (body)
  - Subtle border, no heavy shadows

**Overall Layout:**
- Generous spacing between sections
- Centered content, max-width constraint
- No clutter, breathing room

### 5.2 MATCHMAKING / ROOM SELECTION PAGE

**Overall Feel:**
- Casino lobby atmosphere
- Structured, organized
- Easy to navigate

**Page Layout:**
- 2-column grid (40-60 split desktop, stacked mobile)
- Background: `--bg-primary` with subtle texture

**Left Panel - Player Setup:**
- Card with `--bg-surface` background
- Title: "Join the Table" (h2, gold color)
- Player name input (styled as per input guidelines)
- Buttons:
  - "Create Room" (primary gold)
  - "Join Existing" (secondary outline)
- Spacing: `--space-6` between elements

**Right Panel - Room Browser:**
- Card with `--bg-surface` background
- Title: "Active Tables" (h2, gold color)

**Search & Filter Bar:**
- Search input: inline with filter/refresh buttons
- Icons: outline style
- Spacing: `--space-4` gap

**Room List:**
- Each room: refined card/row
- Structure:
  - Left: Icon (gamepad/table icon, gold color)
  - Center: Room name (h4) + Status badge (small pill)
  - Right: Player count + JOIN button

- Room Card Styling:
  - Background: slightly lighter than panel
  - Border: subtle gold tint
  - Hover: border brightens, subtle lift
  - Transition: 200ms

**Status Badges:**
- "Waiting": small pill, green tint
- "In Game": yellow/gold tint
- "Full": muted red tint
- Typography: label size, uppercase

**Join via Code Section:**
- Below room list or separate area
- Inline form: Room code input + Password input + JOIN button
- Simple, clean layout

**Overall:**
- Clear separation between sections
- No visual clutter
- Easy to scan room list

### 5.3 LOBBY PAGE

**Overall Feel:**
- Pre-game waiting room
- Shows player positions around virtual table
- Calm, anticipatory atmosphere

**Layout:**
- Center: Player positions (circle or 4-corner layout)
- Right sidebar: Chat + Room info

**Room Info Card:**
- Top section: Room name, code (copyable), settings
- Gold border accent
- Consistent card styling

**Player Position Cards:**
- 4 positions: North, South, East, West
- Each card:
  - Background: `--bg-surface`
  - Border: gold if occupied, subtle if empty
  - Content: Player name, ready status
  - Avatar: circle with initial or icon
  
**Ready Indicator:**
- Gold checkmark icon for ready players
- Muted icon for not ready

**Host Controls:**
- Kick button: small, secondary style (only visible to host)
- Start Game button: large, primary gold (enabled when all ready)

**Chat Box:**
- Minimal, not dominant
- Clean message list
- Input at bottom
- Subtle borders

**Overall:**
- Focus on player readiness
- Clear visual hierarchy
- Calm waiting experience

### 5.4 IN-GAME SCREEN (MOST IMPORTANT)

**THIS SHOULD FEEL LIKE SITTING AT A REAL CASINO TABLE**

**Overall Layout:**
- **Background**: `--bg-table` (casino green)
- **Texture**: Subtle felt/fabric texture overlay (opacity 0.3)
- **Vignette**: Darker edges for focus

**Game Board (Center):**
- **Table Surface**: Green felt look with texture
- **Board Area**: Centered, clear boundaries
- **Domino Tiles**:
  - Clean, high contrast (white tiles with black dots)
  - Slight shadow for depth (3D effect)
  - Rounded corners
  - Subtle border
  
**Tile Styling:**
```css
background: #ffffff;
border: 1px solid rgba(0, 0, 0, 0.1);
border-radius: 4px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
```

**Player Panels (Around Table):**
- 4 panels: Top, Bottom, Left, Right
- Each panel:
  - Player name (body size, white text)
  - Card count indicator (gold accent)
  - Position label (small, muted)
  
**Active Player Indicator:**
- Gold glow around active player panel
- Or: Gold border + subtle pulse animation
- Clear, unmistakable

**Turn Indicator (Top Center):**
```
"[Player Name]'s Turn"
```
- Large, clear text (h3 size)
- Gold color
- Possibly with icon (arrow or dot)
- Prominent, always visible

**Player Hand (Bottom):**
- Cards displayed horizontally
- Slightly larger than board tiles
- Spacing: `--space-2` or `--space-3` between cards
- **Selected Card**:
  - Lifted effect (translateY -8px)
  - Gold border highlight
  - Subtle glow
  
**Action Buttons (Bottom, near hand):**
- "Place Left" (primary gold)
- "Place Right" (primary gold)
- "Pass" (secondary outline)
- Spacing: `--space-4` between buttons
- Clear, always accessible

**Chat & Game Log (Right Sidebar):**
- Minimal width
- Collapsible (optional)
- Clean list style
- No colorful bubbles, simple text
- Subtle background

**Score Display:**
- If applicable, show at top corner
- Small, unobtrusive
- Gold text for emphasis

**Overall Game Screen:**
- Everything focused on the board
- Clear whose turn it is
- Easy to understand game state
- Minimal distractions
- Elegant, immersive

---

## 🎨 PART 6: ANIMATIONS & TRANSITIONS

### Animation Guidelines:

**DO USE:**
- Smooth, subtle transitions (200-300ms)
- Easing: `ease-in-out` or `cubic-bezier(0.4, 0, 0.2, 1)`
- Purposeful animations:
  - Card placement (slide + fade)
  - Turn change (fade indicator)
  - Hover effects (scale, shadow, border)
  - Button states (scale, glow)

**AVOID:**
- Bouncy animations
- Excessive motion
- Long duration (> 400ms)
- Unnecessary animations

### Specific Animations:

**Card Placement:**
```css
transition: transform 0.3s ease, opacity 0.3s ease;
/* On place: slide to position + fade in */
```

**Turn Change:**
```css
/* Fade out old indicator, fade in new */
transition: opacity 0.25s ease;
```

**Button Hover:**
```css
transition: all 0.2s ease;
/* Scale 1.02, shadow enhancement */
```

**Player Panel (Active):**
```css
/* Subtle pulse or glow */
animation: pulse-glow 2s ease-in-out infinite;

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 15px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 0 25px rgba(212, 175, 55, 0.5); }
}
```

---

## 🎨 PART 7: RESPONSIVE DESIGN

**Maintain Existing Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Adjustments:**
- Mobile: Stack layouts, full-width buttons, smaller font sizes
- Ensure touch-friendly button sizes (min 44x44px)
- Maintain visual hierarchy on all screen sizes

---

## 🎨 PART 8: TAILWIND CONFIG UPDATE

**Update `tailwind.config.ts` with new design tokens:**

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Background
        'casino-bg-primary': '#0a3d2e',
        'casino-bg-secondary': '#072820',
        'casino-bg-surface': '#0d3b2f',
        'casino-bg-elevated': '#11473a',
        'casino-bg-table': '#1a5c45',
        
        // Accent
        'casino-gold': '#d4af37',
        'casino-gold-light': '#f0d58c',
        'casino-gold-dark': '#b8941f',
        'casino-brass': '#c5a572',
        'casino-ivory': '#f5f0e8',
        
        // Text
        'casino-text-primary': '#f5f0e8',
        'casino-text-secondary': '#c4b5a0',
        'casino-text-muted': '#8a7d6f',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // Use 8px grid
      },
      borderRadius: {
        'casino': '12px',
        'casino-sm': '8px',
      },
      boxShadow: {
        'casino-sm': '0 2px 4px rgba(0, 0, 0, 0.3)',
        'casino-md': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'casino-lg': '0 8px 24px rgba(0, 0, 0, 0.5)',
        'casino-glow': '0 0 20px rgba(212, 175, 55, 0.3)',
        'casino-glow-strong': '0 0 30px rgba(212, 175, 55, 0.5)',
      },
    },
  },
};
```

---

## 🎨 PART 9: GLOBAL CSS (styles/globals.css)

**Add these global styles:**

```css
/* Base */
body {
  background-color: #0a3d2e;
  color: #f5f0e8;
  font-family: 'Inter', system-ui, sans-serif;
}

/* Casino Card */
.casino-card {
  background: #0d3b2f;
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.casino-card:hover {
  border-color: rgba(212, 175, 55, 0.25);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* Gold Button */
.btn-casino-gold {
  background: linear-gradient(135deg, #d4af37, #b8941f);
  color: #0a3d2e;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(212, 175, 55, 0.3);
  transition: all 0.2s ease;
}

.btn-casino-gold:hover {
  background: linear-gradient(135deg, #f0d58c, #d4af37);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 0 30px rgba(212, 175, 55, 0.5);
  transform: translateY(-1px);
}

/* Outline Button */
.btn-casino-outline {
  background: transparent;
  color: #d4af37;
  border: 1px solid #d4af37;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-casino-outline:hover {
  background: rgba(212, 175, 55, 0.1);
  border-color: #f0d58c;
  color: #f0d58c;
}

/* Input */
.input-casino {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 8px;
  padding: 12px 16px;
  color: #f5f0e8;
  transition: all 0.2s ease;
}

.input-casino:focus {
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
  outline: none;
}

/* Table Texture (for game board) */
.casino-table {
  background-color: #1a5c45;
  background-image: 
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.03) 2px,
      rgba(0, 0, 0, 0.03) 4px
    );
  position: relative;
}

.casino-table::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.3) 100%);
  pointer-events: none;
}

/* Active Player Glow */
.player-active {
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
  border-color: #d4af37;
}

/* Domino Tile */
.domino-tile {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Selected Card */
.card-selected {
  transform: translateY(-8px);
  border: 2px solid #d4af37;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), 0 0 15px rgba(212, 175, 55, 0.5);
}
```

---

## 🎨 PART 10: NAVBAR REDESIGN

**IMPORTANT: Keep existing navbar structure and content (links, buttons), only change styling**

**Navbar Styling:**
```css
background: rgba(7, 40, 32, 0.95);  /* Dark green with transparency */
backdrop-filter: blur(10px);
border-bottom: 1px solid rgba(212, 175, 55, 0.15);
```

**Logo:**
- Keep text/content same
- Color: Gold gradient or solid gold
- Font weight: Bold

**Nav Links:**
- Default: `--text-secondary`
- Active: `--accent-gold` with underline
- Hover: `--accent-gold-light`
- Transition: 200ms

**Buttons (Join/Create Room):**
- "Join Room": Outline style (gold border)
- "Create Room": Primary gold button
- Consistent with global button styles

**Icons (notification, profile):**
- Color: `--text-secondary`
- Hover: `--accent-gold`
- Outline style

---

## 🎨 PART 11: UX PRIORITIES

**Always Make Clear:**
1. Whose turn it is (large indicator, gold highlight)
2. Current game state (visible status)
3. Available actions (clear buttons)

**Reduce Distractions:**
- Highlight only important elements (use gold sparingly)
- Keep everything else subtle (muted colors)
- Avoid visual clutter

**Focus Points:**
- Game board in center
- Active player clearly indicated
- Turn indicator always visible
- Action buttons accessible

---

## 🎨 PART 12: IMPLEMENTATION CHECKLIST

### Global Changes:
- [ ] Update all color variables to casino theme
- [ ] Replace typography with Inter font + new hierarchy
- [ ] Apply 8px spacing grid throughout
- [ ] Update Tailwind config with new tokens
- [ ] Add global CSS for casino components

### Component Updates:
- [ ] Buttons: Gold primary, outline secondary
- [ ] Cards: Subtle borders, soft shadows
- [ ] Inputs: Dark background, gold focus
- [ ] Icons: Outline style, consistent set

### Page Updates:
- [ ] Home: Casino entry atmosphere, premium feel
- [ ] Matchmaking: Casino lobby, structured room list
- [ ] Lobby: Pre-game waiting room, clear player positions
- [ ] Game: Casino table feel, green felt texture, clear turn indicator

### Navbar:
- [ ] Dark green background with blur
- [ ] Gold accents on active/hover
- [ ] Keep existing links/buttons (just restyle)

### Animations:
- [ ] Smooth transitions (200-300ms)
- [ ] Subtle hover effects
- [ ] Card placement animations
- [ ] Active player glow

### Testing:
- [ ] All pages visually consistent
- [ ] Responsive on mobile/tablet/desktop
- [ ] High contrast, readable text
- [ ] No broken layouts
- [ ] Smooth animations, no jank
- [ ] All functionality preserved

---

## 🎨 FINAL GOAL

**Transform current UI into:**
- Premium, elegant casino experience
- Focused, competitive atmosphere
- Visually consistent across all pages
- Professional and mature aesthetic

**The result should feel:**
- Like playing at a high-end casino
- Calm and sophisticated
- Modern with classic influence
- Suitable for serious multiplayer competition

**Key Visual Markers:**
- Deep emerald green backgrounds (casino table)
- Gold accents for emphasis (buttons, highlights)
- Clean, modern typography
- Subtle shadows and depth
- Minimal, purposeful animations
- Clear visual hierarchy

---

## 📝 NOTES

- **Functionality**: DO NOT change any logic, only visual styling
- **Navbar**: Keep existing content, only restyle appearance
- **Color Usage**: Use gold SPARINGLY for maximum impact
- **Typography**: Consistent hierarchy, no random sizes
- **Spacing**: Follow 8px grid strictly
- **Animations**: Smooth and subtle, not bouncy
- **Game Board**: MUST feel like casino table (green felt texture)
- **Testing**: Ensure high contrast for accessibility

---

**THIS IS A COMPLETE VISUAL REDESIGN - EVERY COMPONENT SHOULD REFLECT THE NEO CLASSIC CASINO THEME**