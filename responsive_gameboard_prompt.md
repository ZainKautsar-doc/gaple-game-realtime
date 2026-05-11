# 🎮 RESPONSIVE GAMEBOARD & CARD STYLING FIX PROMPT
**Target:** Zoom-out gameboard, responsive card display, circular dot styling, optimized layout  
**Scope:** Layout/Styling ONLY — ZERO logic changes  
**Priority Fixes:**
1. Auto-zoom-out gameboard saat kartu bertambah
2. Card dot values: bulat, bukan kotak
3. Desktop: player hand box meluas ke kanan (maximize sidebar height)
4. Mobile-friendly responsive design

---

## 📋 Issues & Solutions

### Issue #1: Board Overflow (Many Cards)
**Problem:** Saat kartu di meja bertambah, dominoes mentok/overflow dari layar.

**Solution:** Implement dynamic scaling/zoom-out
- Detect number of cards on board
- Calculate optimal scale factor: `scale = Math.min(1, maxWidth / cardsTotalWidth)`
- Apply CSS transform: `transform: scale(calculatedScale)`
- Ensure all cards remain visible without horizontal scroll
- Center board after scale

**Implementation:**
```typescript
// In DominoBoard component
const [boardScale, setBoardScale] = useState(1);

useEffect(() => {
  const boardElement = document.querySelector('.domino-board-content');
  if (boardElement) {
    const contentWidth = boardElement.scrollWidth;
    const containerWidth = boardElement.parentElement.clientWidth;
    
    if (contentWidth > containerWidth) {
      const newScale = (containerWidth - 40) / contentWidth; // 40px margin
      setBoardScale(Math.min(newScale, 1)); // Don't scale up, only down
    } else {
      setBoardScale(1);
    }
  }
}, [playedCards, boardWidth]);

return (
  <div className="overflow-auto max-w-full">
    <div
      style={{ transform: `scale(${boardScale})`, transformOrigin: 'top center' }}
      className="transition-transform duration-300"
    >
      {/* Domino cards rendering */}
    </div>
  </div>
);
```

---

### Issue #2: Card Dot Values (Square → Circular)
**Problem:** Nilai pada kartu berbentuk kotak, kurang aesthetic.

**Solution:** Change to circular dots (border-radius: 50%)

**Current (Bad):**
```
┌──────────────┐
│ ■ ■ ■       │
│             │
│     ■ ■ ■   │
└──────────────┘
```

**Target (Good):**
```
┌──────────────┐
│ ● ● ●       │
│             │
│     ● ● ●   │
└──────────────┘
```

**Implementation:**

```css
/* Domino Card Styling */
.domino-card {
  background: #ffffff;
  border: 3px solid #000000;
  border-radius: 0px;
  box-shadow: 4px 4px 0px #000000;
  padding: 8px;
  width: 60px;
  height: 90px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 4px;
  align-items: center;
  justify-items: center;
}

/* Individual Dot (Circular) */
.domino-dot {
  width: 12px;
  height: 12px;
  background: #000000;
  border-radius: 50%;  /* IMPORTANT: Make it circular */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Empty spot (no dot) */
.domino-empty {
  width: 12px;
  height: 12px;
  /* Empty - no visual */
}

/* Domino divider line */
.domino-divider {
  grid-column: 1 / -1;
  width: 100%;
  height: 2px;
  background: #000000;
}
```

**HTML/JSX Example:**
```jsx
function DominoCard({ top, bottom }) {
  const dots = (value) => {
    const patterns = {
      0: [false, false, false, false, false, false, false, false, false],
      1: [false, false, false, false, true, false, false, false, false],
      2: [true, false, false, false, false, false, false, false, true],
      3: [true, false, false, false, true, false, false, false, true],
      4: [true, false, true, false, false, false, true, false, true],
      5: [true, false, true, false, true, false, true, false, true],
      6: [true, false, true, true, true, false, true, false, true],
    };
    return patterns[value] || [];
  };

  const topDots = dots(top);
  const bottomDots = dots(bottom);

  return (
    <div className="domino-card">
      {/* Top half */}
      {topDots.map((hasDot, idx) => (
        <div key={`top-${idx}`} className={hasDot ? 'domino-dot' : 'domino-empty'} />
      ))}
      
      {/* Divider */}
      <div className="domino-divider"></div>
      
      {/* Bottom half */}
      {bottomDots.map((hasDot, idx) => (
        <div key={`bottom-${idx}`} className={hasDot ? 'domino-dot' : 'domino-empty'} />
      ))}
    </div>
  );
}
```

---

### Issue #3: Player Hand Box Layout (Desktop Optimization)
**Problem:** Pada desktop, player hand box tidak maksimalkan sidebar space (Game Log + Chat terpotong).

**Current Layout:**
```
┌────────────────────────────────────────┐
│ Game Log (cramped, limited height)     │
├────────────────────────────────────────┤
│ Chat (cramped, limited height)         │
├────────────────────────────────────────┤
│ Your Cards (small box)                 │
└────────────────────────────────────────┘
```

**Target Layout:**
```
┌────────────────────────────────────────┐
│ Game Log (tall, maximized, scrollable) │
│                                        │
│                                        │
├────────────────────────────────────────┤
│ Chat (tall, maximized, scrollable)     │
│                                        │
│ (input at bottom)                      │
│                                        │
└────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ You | Your Cards (Horizontal) | PASS | Card Cnt│
└─────────────────────────────────────────────────┘
```

**Solution: Redesign Grid Layout**

**Old Grid (CSS):**
```css
.game-container {
  display: grid;
  grid-template-columns: 100px 1fr 250px;
  grid-template-rows: auto auto 1fr auto;
  gap: 24px;
}

.right-sidebar {
  grid-column: 3;
  grid-row: 2 / 4;  /* Span 2 rows */
  max-height: 500px;  /* ← PROBLEM: Limited height */
}

.player-hand {
  grid-column: 1 / 4;
  grid-row: 4;
}
```

**New Grid (CSS):**
```css
.game-container {
  display: grid;
  grid-template-columns: 100px 1fr 300px;  /* Wider sidebar */
  grid-template-rows: auto 1fr auto;        /* 3 rows: header, main, footer */
  gap: 24px;
  height: 100vh;  /* Full viewport height */
}

.top-section {
  grid-column: 1 / 4;
  grid-row: 1;
}

.left-players {
  grid-column: 1;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.main-board {
  grid-column: 2;
  grid-row: 2;
  overflow: auto;
  border: 3px solid #000000;
  background: #ffffff;
  box-shadow: 4px 4px 0px #000000;
}

.right-sidebar {
  grid-column: 3;
  grid-row: 2;  /* Single row */
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;  /* Fill all available height */
  overflow: hidden;
}

.game-log {
  flex: 0.4;  /* 40% of sidebar height */
  overflow-y: auto;
  border: 3px solid #000000;
  background: #ffffff;
  box-shadow: 4px 4px 0px #000000;
}

.chat-box {
  flex: 0.6;  /* 60% of sidebar height */
  overflow-y: auto;
  border: 3px solid #000000;
  background: #ffffff;
  box-shadow: 4px 4px 0px #000000;
  display: flex;
  flex-direction: column;
}

.player-hand {
  grid-column: 1 / 4;  /* Span all columns */
  grid-row: 3;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 24px;
  border: 3px solid #e7e700;  /* Yellow border */
  background: #ffffff;
  box-shadow: 4px 4px 0px #000000;
  height: 120px;  /* Fixed or flexible */
}

.player-badge {
  flex-shrink: 0;
  width: 80px;
  text-align: center;
}

.hand-cards {
  flex: 1;
  overflow-x: auto;
  display: flex;
  gap: 12px;
  padding: 0 12px;
}

.pass-button {
  flex-shrink: 0;
  width: 80px;
}

.card-count {
  flex-shrink: 0;
  width: 120px;
  text-align: right;
}
```

**React Structure:**
```jsx
<div className="game-container h-screen">
  {/* Top Section: Room info + Top Player */}
  <div className="top-section">
    {/* ... */}
  </div>

  {/* Main Game Area */}
  {/* Left Players */}
  <div className="left-players">
    {/* ... */}
  </div>

  {/* Main Board */}
  <div className="main-board">
    {/* ... */}
  </div>

  {/* Right Sidebar (Game Log + Chat) */}
  <div className="right-sidebar">
    <GameLog />
    <ChatBox />
  </div>

  {/* Bottom: Player Hand */}
  <div className="player-hand">
    <div className="player-badge">P1</div>
    <div className="hand-cards">
      {/* Your cards */}
    </div>
    <button className="pass-button">PASS</button>
    <div className="card-count">5 cards</div>
  </div>
</div>
```

---

### Issue #4: Mobile Responsiveness (< 768px)
**Problem:** Layout tidak responsive di mobile, terlalu banyak elemen di layar kecil.

**Solution: Mobile-First Grid Transformation**

**Mobile Layout (<768px):**
```
┌─────────────────┐
│ NAVBAR          │
├─────────────────┤
│ Top Player Info │ (collapsible badge)
├─────────────────┤
│ MAIN BOARD      │ (full-width, scaled)
│ (zoom-out if    │
│  many cards)    │
├─────────────────┤
│ Side Players    │ (collapsed)
├─────────────────┤
│ YOUR CARDS      │ (horizontal scroll)
├─────────────────┤
│ [LOG] [CHAT]    │ (toggle buttons)
└─────────────────┘
```

**CSS:**
```css
/* Desktop */
@media (min-width: 1024px) {
  .game-container {
    grid-template-columns: 100px 1fr 300px;
    grid-template-rows: auto 1fr auto;
  }
  
  .right-sidebar {
    grid-column: 3;
    grid-row: 2;
  }
}

/* Tablet */
@media (max-width: 1023px) and (min-width: 768px) {
  .game-container {
    grid-template-columns: 80px 1fr 250px;
    gap: 16px;
  }
  
  .left-players {
    width: 80px;
  }
  
  .right-sidebar {
    width: 250px;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .game-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto auto auto;
    gap: 16px;
    height: auto;
  }

  .top-section {
    grid-column: 1;
    grid-row: 1;
  }

  .left-players {
    display: none;  /* Hide, show toggle instead */
  }

  .main-board {
    grid-column: 1;
    grid-row: 2;
    max-height: 300px;
    min-height: 250px;
  }

  .right-sidebar {
    grid-column: 1;
    grid-row: 3;
    height: auto;
    max-height: 200px;
    display: none;  /* Hidden by default, toggle to show */
  }

  .player-hand {
    grid-column: 1;
    grid-row: 4;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
    height: auto;
  }

  .hand-cards {
    width: 100%;
    max-height: 150px;
  }

  /* Toggle Buttons for Log/Chat */
  .sidebar-toggle {
    grid-column: 1;
    grid-row: 5;
    display: flex;
    gap: 12px;
  }

  .sidebar-toggle button {
    flex: 1;
    padding: 12px;
    border: 3px solid #000000;
    background: #0001bb;
    color: #ffffff;
    font-weight: 700;
    cursor: pointer;
  }
}
```

**Mobile Toggle Implementation (React):**
```typescript
export function GameBoardMobile() {
  const [logOpen, setLogOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="game-container">
      {/* ... Top, Main, Player Hand sections ... */}

      {/* Toggle Buttons */}
      <div className="sidebar-toggle lg:hidden">
        <button
          onClick={() => setLogOpen(!logOpen)}
          className={logOpen ? 'bg-nb-secondary text-nb-on-surface' : 'bg-nb-primary text-nb-white'}
        >
          GAME LOG
        </button>
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className={chatOpen ? 'bg-nb-secondary text-nb-on-surface' : 'bg-nb-primary text-nb-white'}
        >
          CHAT
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {logOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setLogOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-nb-white border-t-3 border-nb-outline p-md max-h-96 overflow-y-auto">
            <GameLog />
          </div>
        </div>
      )}

      {chatOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setChatOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-nb-white border-t-3 border-nb-outline p-md max-h-96 overflow-y-auto">
            <ChatBox />
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 Gameboard Auto-Scale Algorithm

**Logic:**
1. Calculate total width of all placed cards
2. Compare with container width
3. If cards overflow, calculate scale: `scale = availableWidth / totalWidth`
4. Apply scale with transform-origin at center
5. Monitor playedCards changes, recalculate continuously

**Detailed Implementation:**

```typescript
import { useEffect, useState, useRef } from 'react';

interface GameBoardProps {
  playedCards: Card[];
  containerRef?: React.RefObject<HTMLDivElement>;
}

export function DominoBoard({ playedCards }: GameBoardProps) {
  const [boardScale, setBoardScale] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateScale = () => {
      if (!contentRef.current || !containerRef.current) return;

      const contentWidth = contentRef.current.scrollWidth;
      const containerWidth = containerRef.current.clientWidth;
      const padding = 40; // 20px on each side

      if (contentWidth > containerWidth - padding) {
        const calculatedScale = (containerWidth - padding) / contentWidth;
        // Limit scale to prevent cards from becoming too small
        setBoardScale(Math.max(calculatedScale, 0.5));
      } else {
        setBoardScale(1);
      }
    };

    // Calculate on mount and when played cards change
    calculateScale();

    // Recalculate on window resize
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [playedCards.length]);

  return (
    <div
      ref={containerRef}
      className="
        bg-nb-white
        border-3 border-nb-outline
        rounded-none
        shadow-nb-md
        p-lg
        min-h-96
        flex flex-col items-center justify-center
        overflow-hidden
      "
    >
      {/* Current Turn Indicator */}
      <div className="mb-lg font-display text-lg uppercase text-nb-primary">
        {currentPlayerName}'s Turn
      </div>

      {/* Board Content with Dynamic Scale */}
      <div
        ref={contentRef}
        style={{
          transform: `scale(${boardScale})`,
          transformOrigin: 'top center',
          transition: 'transform 300ms ease-out',
        }}
        className="flex gap-md flex-wrap justify-center whitespace-nowrap"
      >
        {playedCards.map((card, idx) => (
          <DominoCard
            key={idx}
            top={card.top}
            bottom={card.bottom}
            isFlipped={card.isFlipped}
          />
        ))}
      </div>

      {/* Card Count Indicator */}
      <div className="mt-lg pt-lg border-t-3 border-nb-outline text-sm font-mono">
        {playedCards.length} cards played (Scale: {(boardScale * 100).toFixed(0)}%)
      </div>
    </div>
  );
}
```

---

## 📐 Responsive Card Sizing

**Goal:** Cards scale responsively on different screen sizes without breaking layout.

**Implementation:**
```css
/* Card sizes based on screen */
@media (max-width: 480px) {
  .domino-card {
    width: 40px;
    height: 60px;
    padding: 4px;
  }
  
  .domino-dot {
    width: 8px;
    height: 8px;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .domino-card {
    width: 50px;
    height: 75px;
    padding: 6px;
  }
  
  .domino-dot {
    width: 10px;
    height: 10px;
  }
}

@media (min-width: 769px) {
  .domino-card {
    width: 60px;
    height: 90px;
    padding: 8px;
  }
  
  .domino-dot {
    width: 12px;
    height: 12px;
  }
}
```

---

## 📋 Files to Modify (Priority)

### Priority 1 (Critical)
- [ ] `frontend/src/components/DominoBoard.tsx` → Auto-scale logic + board rendering
- [ ] `frontend/src/components/DominoCard.tsx` → Circular dots styling
- [ ] `frontend/src/app/game/page.tsx` → New grid layout structure

### Priority 2 (High)
- [ ] `frontend/src/components/GameLog.tsx` → Flex layout, scrollable
- [ ] `frontend/src/components/ChatBox.tsx` → Flex layout, scrollable, input at bottom
- [ ] `frontend/src/components/PlayerHand.tsx` → New bottom layout
- [ ] `tailwind.config.ts` → Responsive utilities, breakpoints

### Priority 3 (Medium)
- [ ] `frontend/src/globals.css` → Scrollbar styling, grid defaults
- [ ] `frontend/src/components/PlayerPanel.tsx` → Mobile collapse/badge

---

## ✅ Validation Checklist

**Gameboard Scaling:**
- [ ] With 5 cards: scale = 1 (no zoom-out)
- [ ] With 10 cards: scale = 0.8-0.9 (slight zoom-out)
- [ ] With 20 cards: scale = 0.5-0.7 (visible zoom-out)
- [ ] All cards remain visible without horizontal scroll
- [ ] Cards remain readable (min size ~30px width)
- [ ] Scale factor displays for debugging

**Card Styling:**
- [ ] Card dots are circular (border-radius: 50%), not square
- [ ] Dot sizes responsive to screen (8px-12px)
- [ ] Card divider line present
- [ ] Card borders 3px black, corners sharp
- [ ] Card shadows hard offset (4px)

**Layout (Desktop 1024px+):**
- [ ] 3-column grid visible (left, center, right)
- [ ] Right sidebar height maximized
- [ ] Game Log takes 40% sidebar height
- [ ] Chat takes 60% sidebar height
- [ ] Both scrollable independently
- [ ] Player hand at bottom, full-width
- [ ] Player hand: badge | cards | PASS | count (horizontal)

**Layout (Tablet 768-1024px):**
- [ ] 2-column or adjustable grid
- [ ] Sidebar widths reduced (250px)
- [ ] All elements still visible
- [ ] No overflow or clipping

**Layout (Mobile <768px):**
- [ ] 1-column stacked layout
- [ ] Top player collapsed (badge only)
- [ ] Main board full-width
- [ ] Side players hidden (toggle available)
- [ ] Player hand full-width
- [ ] Game Log + Chat toggle buttons visible
- [ ] Overlay panel slides up on toggle
- [ ] All text readable, tap targets >= 44px

**Responsive:**
- [ ] Window resize: layout adapts smoothly
- [ ] Orientation change: layout adjusts
- [ ] Card size scales with viewport
- [ ] No horizontal scroll (except player hand)
- [ ] No layout breakage at any breakpoint

---

## 🎬 Animation & Transitions

- **Scale transition:** 300ms ease-out (smooth scaling)
- **Mobile overlay:** 200ms slide-up (bottom sheet)
- **Toggle buttons:** instant state change
- **Card selection:** border color change (no animation)

---

## 💡 Key CSS Utilities to Add

```css
/* Circular dot utility */
.dot-circular {
  border-radius: 50%;
  width: 12px;
  height: 12px;
  background: #000000;
}

/* Auto-scale board */
.board-scale {
  transform-origin: top center;
  transition: transform 300ms ease-out;
}

/* Sidebar maximized */
.sidebar-maximize {
  height: 100%;
  flex: 1;
  overflow-y: auto;
}

/* Player hand row */
.hand-row {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px;
  border: 3px solid #e7e700;
  width: 100%;
}

/* Mobile hidden */
@media (max-width: 767px) {
  .hidden-mobile {
    display: none;
  }
}
```

---

## 🎯 Expected Results

**Before:**
- ❌ Cards overflow, need horizontal scroll
- ❌ Card dots square, not aesthetic
- ❌ Sidebar cramped, limited height
- ❌ Mobile: all elements cramped, hard to use
- ❌ Layout breaks at certain sizes

**After:**
- ✅ Gameboard auto-scales, all cards visible
- ✅ Card dots circular, clean design
- ✅ Sidebar maximized, Game Log + Chat full height
- ✅ Mobile: responsive, toggleable, usable
- ✅ Layout works at all breakpoints (480px-2560px)
- ✅ NeoBrutalism styling maintained throughout

---

## 🔗 Summary of Changes

| Component | Change | Impact |
|-----------|--------|--------|
| DominoBoard | Add auto-scale logic | Cards stay visible |
| DominoCard | Circular dots (border-radius: 50%) | Better aesthetics |
| Game Grid | 3-col desktop → 2-col tablet → 1-col mobile | Responsive layout |
| Sidebar | Max height with flex | Game Log + Chat full height |
| Player Hand | Full-width, flex layout | Better space utilization |
| Mobile | Toggle buttons + overlay | Mobile-friendly |

---

**STATUS:** Ready for implementation  
**ESTIMATED EFFORT:** 10-14 hours (layout refactor + responsive + styling)  
**RISK LEVEL:** Low (UI-only changes)  
**COMPLEXITY:** Medium-High (grid layout, scaling logic, responsive design)