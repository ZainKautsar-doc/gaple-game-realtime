# 🎨 NeoBrutalism UI Redesign Prompt
**Target Project:** Gaple Game Realtime  
**Scope:** UI/Design/Styling ONLY — NO logic/algorithm changes  
**Design System:** Retro Primary (NeoBrutalism) + Custom Brand Colors

---

## 📌 Mission Brief

Retransform the entire Gaple Game Realtime frontend (Next.js) from its current design to a **NeoBrutalism aesthetic**. This is a pure styling/UI redesign—preserve all game logic, state management (zustand), socket event handlers, and algorithmic integrity. Focus on visual transformation only.

---

## 🎨 Design System Reference

### Color Palette (Strict)
- **Primary Blue:** `#0001bb` (headlines, primary buttons, borders)
- **Alternative Primary:** `#0000ff` (pure digital blue for secondary highlights)
- **Secondary Yellow:** `#e7e700` or `#ffff00` (accents, warnings, attention)
- **Tertiary Red:** `#9d0100` or `#720100` (destructive actions, alerts)
- **Surface/Background:** `#fbf8ff` (off-white, very light purple tint)
- **Text/Dark:** `#1a1b26` (near-black, for maximum contrast)
- **Borders/Shadows:** `#000000` (pure black, hard shadows, no blur)
- **White:** `#ffffff` (for text on colored backgrounds, card surfaces)

### Typography Stack
| Use Case | Font | Size | Weight | Style |
|----------|------|------|--------|-------|
| Titles/Headlines | **Anton** | 32–80px | 400 | UPPERCASE |
| Display/Mobile Titles | **Anton** | 36–48px | 400 | UPPERCASE |
| Body Copy / Labels | **Space Mono** | 12–18px | 400–700 | Regular or Bold |
| Buttons/CTAs | **Space Mono** | 12px (label-sm) | 700 | UPPERCASE |

### Border & Shadow Strategy
- **All borders:** Minimum 3px solid black (`#000000`), no rounded corners (0px border-radius)
- **Hard shadows:** 4px or 8px offset, 0px blur, 100% opaque black
  - Example: `box-shadow: 4px 4px 0px #000000;` or `box-shadow: 8px 8px 0px #000000;`
- **Active/Pressed state:** Remove shadow, apply `transform: translate(4px, 4px)` or `translate(8px, 8px)` to simulate button press
- **No rounded corners** except for perfect circles (badges) or specific icons
- **Shapes are sharp (0°):** All boxes remain boxes

### Spacing Baseline (8px grid)
- `xs: 4px`
- `sm: 12px`
- `md: 24px`
- `lg: 48px`
- `xl: 80px`
- Gutters: 24px (desktop), 16px (mobile)
- Section margins: aggressive (32px+ between unrelated blocks)

---

## 🛠️ Implementation Scope

### Components to Restyle (Exhaustive Checklist)

#### 1. **Global / Layout**
- [ ] Root background color → `#fbf8ff`
- [ ] Remove all rounded corners from containers (set `border-radius: 0`)
- [ ] Update Tailwind config with NeoBrutalism color tokens
- [ ] Import **Anton** (Google Fonts) and ensure **Space Mono** is available
- [ ] Reset all shadows to hard black 4–8px offsets

#### 2. **Navigation / Header**
- [ ] Header background → `#fbf8ff` with 3px black bottom border
- [ ] Logo/title → Anton, uppercase, `#0001bb`
- [ ] Navigation links → Space Mono, hover state = background `#0001bb` + text white
- [ ] Remove any subtle hovers; use bold color flips instead

#### 3. **Buttons**
- [ ] Primary button: `#0001bb` background, 3px black border, hard black shadow (4–8px)
- [ ] Secondary button: white background, 3px black border, hard shadow
- [ ] Destructive button: `#9d0100` or `#720100` background, white text, 3px black border
- [ ] Hover state: color swap OR shadow removal + translate press effect
- [ ] All button text: Space Mono, `label-sm` (12px), bold, UPPERCASE
- [ ] Remove all transitions/animations on hover; use instant color flip

#### 4. **Cards / Containers**
- [ ] Card background: white, 3px black border, 4–8px hard black shadow
- [ ] Card header (if applicable): solid color block (`#0001bb` or `#e7e700`), 3px border bottom, Anton uppercase title
- [ ] Card spacing: 24px padding (md spacing unit)
- [ ] Remove any card elevation animations; keep them static

#### 5. **Forms / Inputs**
- [ ] Input fields: white background, 3px black border, 0px border-radius
- [ ] Focus state: background tint to pale blue or border color change to yellow
- [ ] Checkboxes/radio buttons: pure square (0px radius), 3px black border, heavy black checkmark
- [ ] Labels: Space Mono, 12–14px, `#1a1b26`
- [ ] Placeholder text: `#757589`
- [ ] Error states: 3px red border + inline error message in Space Mono

#### 6. **Game Board / Cards Display**
- [ ] Domino cards: white background, 3px black border, 4px hard shadow
- [ ] Card selection highlight: `#0001bb` border (increase thickness or add secondary border)
- [ ] Card hover: shadow lift removed; instead use color inversion or border color change
- [ ] Playable cards indicator: yellow (`#e7e700`) 3px accent border on left/right
- [ ] Card text/numbers: Space Mono, bold, large enough for readability

#### 7. **Game Board Layout**
- [ ] Board area: white background, 3px black border, adequate padding (24–32px)
- [ ] Player panels: white cards with 3px black border, 4px hard shadow, Anton headers
- [ ] Current player highlight: yellow (`#e7e700`) 3px border or solid background block
- [ ] Score display: large Space Mono numbers, bold, `#0001bb`
- [ ] Turn indicator: bright yellow background, 3px black border, Anton text

#### 8. **Chat / Messages**
- [ ] Chat container: white, 3px black border, 4px hard shadow
- [ ] Message bubbles: alternate between white (for user) and pale blue (`#f5f2ff` or `#eeecfc`) for others
- [ ] Message bubbles: 3px black border, no shadow (or very minimal)
- [ ] Chat input: white, 3px black border, Space Mono
- [ ] Send button: primary blue with hard shadow, Space Mono uppercase

#### 9. **Modals / Dialogs**
- [ ] Modal background: white, 3px black border, 8px hard black shadow
- [ ] Modal header: solid `#0001bb` or `#e7e700` block with Anton uppercase title
- [ ] Modal buttons: follow button spec above
- [ ] Close button (X): red (`#9d0100`), centered, 3px black border, hard shadow

#### 10. **Lobby / Room Management UI**
- [ ] Room cards: white, 3px black border, 4–8px hard shadow
- [ ] Room status badges: yellow/red/blue chips with 3px border, no shadow
- [ ] Join/Create buttons: primary spec above
- [ ] Code display: Space Mono monofont, bold, `#0001bb`, in a bordered container

#### 11. **Notifications / Toasts**
- [ ] Toast background: `#e7e700` (warning) or `#9d0100` (error) or `#0001bb` (info)
- [ ] Toast text: white or dark, Space Mono, 3px black border, 4px hard shadow
- [ ] Remove any fade-in/fade-out animations; prefer instant appearance
- [ ] Position: bottom-right, with 24px margin

#### 12. **Typography System (Global)**
- [ ] Headings (h1–h3): Anton, UPPERCASE, `#0001bb`, no subtlety
- [ ] Body text: Space Mono, `#1a1b26`, line-height 1.5–1.6
- [ ] Links: `#0001bb`, underlined, no color fade on hover (instant swap to `#e7e700`)
- [ ] Labels: Space Mono, 12px, bold, `#1a1b26`

#### 13. **Animations / Interactions (Constraints)**
- [ ] Remove soft easing/transitions; use instant state flips
- [ ] Press button state: shadow disappears + translate 4–8px down-right
- [ ] Hover states: instant color flip, no fade
- [ ] Card flips / turns: keep Framer Motion but simplify to hard geometric transforms
- [ ] Loading indicators: solid color blocks, pulsing (not fade), bold black borders
- [ ] No blur, no transparency, no gradients

#### 14. **Responsive Design (Mobile)**
- [ ] 4-column grid, 16px gutters/margins
- [ ] Font sizes scale down (Anton 36px for mobile headlines)
- [ ] Buttons remain 3px border + hard shadow
- [ ] Spacing follows 8px baseline (xs, sm, md units)
- [ ] Full-width inputs on mobile, maintain 3px borders

---

## 💻 Technical Implementation Details

### Tailwind CSS Custom Config
```javascript
// tailwind.config.ts - Add custom colors and utilities
module.exports = {
  theme: {
    colors: {
      'nb-primary': '#0001bb',
      'nb-primary-pure': '#0000ff',
      'nb-secondary': '#e7e700',
      'nb-tertiary': '#9d0100',
      'nb-surface': '#fbf8ff',
      'nb-surface-low': '#f5f2ff',
      'nb-on-surface': '#1a1b26',
      'nb-outline': '#000000',
      'nb-white': '#ffffff',
    },
    borderRadius: {
      'none': '0px',
      'full': '9999px', // only for circles
    },
    extend: {
      boxShadow: {
        'nb-sm': '4px 4px 0px #000000',
        'nb-md': '8px 8px 0px #000000',
        'nb-none': 'none',
      },
      fontFamily: {
        'display': ['Anton', 'sans-serif'],
        'mono': ['Space Mono', 'monospace'],
      },
    },
  },
};
```

### CSS/Component Patterns
```css
/* NeoBrutalism Button Base */
.nb-btn {
  border: 3px solid #000000;
  border-radius: 0px;
  box-shadow: 4px 4px 0px #000000;
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  transition: none; /* NO transitions */
  cursor: pointer;
}

.nb-btn:hover {
  /* Instant state flip, no fade */
  box-shadow: 4px 4px 0px #000000;
  /* OR press effect: */
  transform: translate(4px, 4px);
  box-shadow: none;
}

.nb-btn-primary {
  background-color: #0001bb;
  color: #ffffff;
}

.nb-btn-primary:hover {
  background-color: #e7e700;
  color: #1a1b26;
}

/* NeoBrutalism Card Base */
.nb-card {
  background: #ffffff;
  border: 3px solid #000000;
  border-radius: 0px;
  box-shadow: 4px 4px 0px #000000;
  padding: 24px;
}

.nb-card-header {
  background: #0001bb;
  border-bottom: 3px solid #000000;
  padding: 16px 24px;
  margin: -24px -24px 24px -24px;
  font-family: 'Anton', sans-serif;
  font-size: 32px;
  font-weight: 400;
  text-transform: uppercase;
  color: #ffffff;
}

/* NeoBrutalism Input */
.nb-input {
  background: #ffffff;
  border: 3px solid #000000;
  border-radius: 0px;
  padding: 12px 16px;
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  color: #1a1b26;
}

.nb-input:focus {
  outline: none;
  background: #f5f2ff;
  border-color: #0001bb;
  box-shadow: 0px 0px 0px 6px rgba(0, 1, 187, 0.1); /* subtle inner glow, optional */
}

/* NeoBrutalism Hard Shadow Utility */
.shadow-nb-sm {
  box-shadow: 4px 4px 0px #000000;
}

.shadow-nb-md {
  box-shadow: 8px 8px 0px #000000;
}

/* Active/Pressed State */
.active\:translate-nb {
  &:active {
    transform: translate(4px, 4px);
    box-shadow: none;
  }
}
```

### Font Imports (in `globals.css` or `layout.tsx`)
```css
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:wght@400;700&display=swap');

:root {
  --font-display: 'Anton', sans-serif;
  --font-mono: 'Space Mono', monospace;
}
```

---

## 📋 File-by-File Change Strategy

### Frontend Structure (`frontend/src/`)

#### 1. **Global Styles** (`globals.css`)
- Import Anton + Space Mono from Google Fonts
- Reset default margins/paddings
- Set root background to `#fbf8ff`
- Define NeoBrutalism CSS variables
- Remove all `border-radius` defaults (set to 0)

#### 2. **Components** (`components/`)
Restyle in priority order:
- `GameBoard.tsx` → border 3px black, domino cards with borders/shadows
- `PlayerPanel.tsx` → white cards, Anton headers, yellow highlight for current player
- `ChatBox.tsx` → bordered container, message bubbles with borders
- `Lobby.tsx` → room cards, buttons with hard shadows
- `Header.tsx` → remove subtlety, add 3px border bottom, Anton logo
- `Button.tsx` (if exists) → primary/secondary/destructive spec
- All modal/dialog components → header block + border spec

#### 3. **Layout** (`app/layout.tsx`)
- Update background color, font imports
- Ensure all pages inherit NeoBrutalism spacing grid

#### 4. **Pages** (`app/`)
- Ensure no component-level color overrides conflict with new design
- Update any inline styles to match NeoBrutalism spec

#### 5. **Tailwind Config** (`tailwind.config.ts`)
- Add NeoBrutalism color tokens
- Define shadow utilities (`shadow-nb-sm`, `shadow-nb-md`)
- Ensure no default border-radius
- Export custom fontFamily settings

#### 6. **Typography/Atoms** (if separate)
- Create utility classes: `.heading-anton`, `.body-mono`, `.label-mono`
- Ensure uppercase applied where needed

---

## ⚠️ Constraints & Warnings

### DO NOT TOUCH
- ❌ Game logic (GameRoom, GameLogic, DeckManager)
- ❌ Socket event handlers or payload validation
- ❌ State management (zustand stores)
- ❌ API/routing structure
- ❌ Game rule algorithms or scoring

### DO APPLY
- ✅ CSS/Tailwind utilities
- ✅ Component visual markup (borders, shadows, colors)
- ✅ Typography updates (fonts, sizes, weights)
- ✅ Spacing/padding adjustments
- ✅ Hover/active state styling
- ✅ Responsive breakpoints (8px grid baseline)

### Common Pitfalls to Avoid
1. **Rounded corners:** Check for lingering `rounded-md`, `rounded-lg`, etc. → Replace with `rounded-none`
2. **Soft shadows:** Replace `shadow-sm`, `shadow-md`, etc. with hard 4–8px black offsets
3. **Gradients:** Remove all gradient backgrounds; use solid colors only
4. **Transparency/opacity:** Avoid `opacity-*` utilities; use solid colors
5. **Transitions:** Remove `transition-*` classes; use instant state flips
6. **Colors:** Ensure only NeoBrutalism palette is used (no custom hex outside spec)
7. **Fonts:** Verify Anton (headings) and Space Mono (body) are loaded and applied correctly

---

## 🎯 Validation Checklist (Before Completion)

- [ ] All page backgrounds are `#fbf8ff`
- [ ] All borders are 3px solid black (`#000000`)
- [ ] All boxes have 0px border-radius
- [ ] All elevated elements have 4–8px hard black shadows
- [ ] Headings use Anton, uppercase
- [ ] Body text uses Space Mono, regular or bold
- [ ] Buttons have 3px border, hard shadow, Space Mono uppercase label
- [ ] No gradients, no transparency, no blur effects
- [ ] Hover states are instant (no fade transitions)
- [ ] Spacing follows 8px grid (4, 12, 24, 48, 80px multiples)
- [ ] Game logic tests pass (no changes to backend or game rules)
- [ ] Responsive design works on mobile (4-column grid, 16px gutters)
- [ ] All interactive elements have clear focus/active states
- [ ] Colors match NeoBrutalism palette (no deviation)

---

## 📝 Notes for AI/Developer

- **Preserve functionality:** This is a visual skin—the game must work identically after styling
- **Test on multiple pages:** Ensure Lobby, GameBoard, Chat, and Player Panels all follow the spec
- **Mobile-first awareness:** Use responsive classes (`md:`, `sm:`) sparingly; default spacing should work on mobile
- **Iteration:** Build one component at a time, validate, then move to next
- **Ask questions:** If unclear about shadow offset or color application, refer back to the design system section

---

**STATUS:** Ready for implementation  
**ESTIMATED EFFORT:** 4–8 hours (depending on codebase complexity)  
**RISK LEVEL:** Low (design-only, no logic changes)