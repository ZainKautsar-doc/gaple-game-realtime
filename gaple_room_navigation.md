# 🚀 Gaple Game - Room Navigation & Back to Room Feature

## 📌 OVERVIEW

Fitur navigasi untuk memungkinkan user:
1. **From Room/Lobby/Game** → Click "Home" di navbar → Kembali ke home page
2. **From Home Page** (setelah dari room) → Button "Create Table" & "Join Table" menjadi "Back to Room"

Flow ini memerlukan state management untuk tracking apakah user sedang dalam room atau tidak.

---

## 🎯 USER FLOWS

### Flow 1: Normal Flow (Tanpa Room)
```
Home Page
  ↓ Click "Create Table" / "Join Table"
  ↓
Matchmaking Page
  ↓ Click "Create Room" / Join existing room
  ↓
Lobby Page (inside room)
  ↓
Game Page (in-game)
```

### Flow 2: Navigate Back to Home (From Room)
```
Lobby Page (inside room)
  ↓ Click "Home" link di navbar
  ↓
Home Page (with "Back to Room" button)
  ↓ Click "Back to Room"
  ↓
Lobby Page (kembali ke room yang sama)
```

### Flow 3: Leave Room & Back to Normal
```
Home Page (with "Back to Room" button)
  ↓ Click "Back to Room" → Kembali ke room
  ↓
(In room - user keluar aplikasi atau close room)
  ↓ Room state cleared
  ↓
Home Page (tombol normal kembali: "Create Table" / "Join Table")
```

---

## 🎯 PART 1: STATE MANAGEMENT

### Zustand Store Update

**Create/Update `frontend/src/store/navigationStore.ts`:**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavigationStore {
  // Room tracking
  currentRoomId: string | null;
  currentRoomCode: string | null;
  playerName: string | null;
  isInRoom: boolean;
  
  // Actions
  setRoomInfo: (roomId: string, roomCode: string, playerName: string) => void;
  clearRoomInfo: () => void;
  
  // Derived state
  getBackToRoomUrl: () => string | null;
}

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      currentRoomId: null,
      currentRoomCode: null,
      playerName: null,
      isInRoom: false,
      
      setRoomInfo: (roomId, roomCode, playerName) =>
        set({
          currentRoomId: roomId,
          currentRoomCode: roomCode,
          playerName: playerName,
          isInRoom: true,
        }),
      
      clearRoomInfo: () =>
        set({
          currentRoomId: null,
          currentRoomCode: null,
          playerName: null,
          isInRoom: false,
        }),
      
      getBackToRoomUrl: () => {
        const { currentRoomId, isInRoom } = get();
        return isInRoom && currentRoomId ? `/lobby/${currentRoomId}` : null;
      },
    }),
    {
      name: 'navigation-store', // localStorage key
      partialize: (state) => ({
        currentRoomId: state.currentRoomId,
        currentRoomCode: state.currentRoomCode,
        playerName: state.playerName,
        isInRoom: state.isInRoom,
      }),
    }
  )
);
```

**Why persist?**
- Jika user refresh page di home, room info tetap tersimpan
- User bisa kembali ke room setelah refresh
- Hilang otomatis ketika user close browser (atau manually clear)

---

## 🎯 PART 2: NAVBAR UPDATES

### Header Component Enhancement

**Update `frontend/src/components/layout/Header.tsx`:**

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useNavigationStore } from '@/store/navigationStore';

export function Header() {
  const router = useRouter();
  const { isInRoom } = useNavigationStore();
  
  const handleHomeClick = () => {
    router.push('/');
  };
  
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <span>GAPLE.IO</span>
      </div>
      
      {/* Nav Links */}
      <div className="navbar-links">
        {/* Home link - always visible */}
        <button 
          onClick={handleHomeClick}
          className="nav-link"
        >
          {isInRoom ? 'Home' : 'Lobby'}
        </button>
        
        <a href="#" className="nav-link">Leaderboard</a>
        <a href="#" className="nav-link">Tournaments</a>
        <a href="#" className="nav-link">How to Play</a>
      </div>
      
      {/* Right side buttons */}
      <div className="navbar-actions">
        {/* Notification & Profile icons */}
        <button className="icon-btn">🔔</button>
        <button className="icon-btn">👤</button>
      </div>
    </nav>
  );
}
```

**Key Changes:**
- Click "Home" link → Always available
- When in room: navigates back to home page (preserves room info)
- When in home: stays on home page

---

## 🎯 PART 3: HOME PAGE BUTTON LOGIC

### Update `frontend/src/app/page.tsx` (or relevant home component)

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useNavigationStore } from '@/store/navigationStore';

export default function HomePage() {
  const router = useRouter();
  const { isInRoom, currentRoomId } = useNavigationStore();
  
  const handleCreateRoom = () => {
    if (isInRoom) {
      // Already in room, go back
      router.push(`/lobby/${currentRoomId}`);
    } else {
      // Normal flow
      router.push('/matchmaking?action=create');
    }
  };
  
  const handleJoinRoom = () => {
    if (isInRoom) {
      // Already in room, go back
      router.push(`/lobby/${currentRoomId}`);
    } else {
      // Normal flow
      router.push('/matchmaking?action=join');
    }
  };
  
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        {/* ... existing hero content ... */}
      </section>
      
      {/* CTA Buttons - IMPORTANT CHANGE */}
      <div className="hero-buttons">
        <button 
          onClick={handleCreateRoom}
          className="btn-casino-gold"
        >
          {isInRoom ? 'Back to Room' : 'Create Room'}
        </button>
        
        <button 
          onClick={handleJoinRoom}
          className="btn-casino-outline"
        >
          {isInRoom ? 'Back to Room' : 'Join Room'}
        </button>
      </div>
      
      {/* ... rest of home page ... */}
    </div>
  );
}
```

**Button Behavior:**
- If `isInRoom === true`: Both buttons show "Back to Room" → Navigate to room
- If `isInRoom === false`: Normal buttons → Navigate to matchmaking

---

## 🎯 PART 4: ROOM SETUP - SET NAVIGATION STATE

### When User Joins/Creates Room

**Update socket event handlers atau room logic:**

```typescript
// In your useGame hook atau socket handler

// When room is successfully joined/created
const handleRoomJoined = (roomData) => {
  const { roomId, roomCode } = roomData;
  const playerName = usePlayerStore.getState().name; // or from props
  
  // Set navigation state
  useNavigationStore.getState().setRoomInfo(
    roomId,
    roomCode,
    playerName
  );
  
  // Navigate to lobby
  router.push(`/lobby/${roomId}`);
};

// When user leaves room
const handleLeaveRoom = () => {
  // Clear navigation state
  useNavigationStore.getState().clearRoomInfo();
  
  // Navigate to home
  router.push('/');
};
```

---

## 🎯 PART 5: LEAVE ROOM FUNCTIONALITY

### Update Lobby/Game Page Leave Buttons

**Update `frontend/src/app/lobby/page.tsx` atau game page:**

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useNavigationStore } from '@/store/navigationStore';

export default function LobbyPage() {
  const router = useRouter();
  const { clearRoomInfo } = useNavigationStore();
  
  const handleLeaveRoom = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin meninggalkan room?'
    );
    
    if (!confirmed) return;
    
    try {
      // Emit socket event to leave room
      socket.emit('leave-room', {
        // ... room data ...
      });
      
      // Clear navigation state
      clearRoomInfo();
      
      // Navigate to home
      router.push('/');
      
      // Show success toast
      showToast('Berhasil meninggalkan room', 'success');
    } catch (error) {
      showToast('Gagal meninggalkan room', 'error');
    }
  };
  
  return (
    <div className="lobby-page">
      {/* ... lobby content ... */}
      
      {/* Leave Room Button */}
      <button 
        onClick={handleLeaveRoom}
        className="btn-casino-outline"
      >
        Leave Room
      </button>
    </div>
  );
}
```

---

## 🎯 PART 6: VISUAL INDICATOR (Optional)

### Show Room Status on Home Page

```typescript
export default function HomePage() {
  const { isInRoom, currentRoomCode } = useNavigationStore();
  
  return (
    <div className="home-page">
      {/* Room Status Banner */}
      {isInRoom && (
        <div className="room-status-banner">
          <div className="banner-content">
            <span className="status-icon">✓</span>
            <span className="status-text">
              You are in a room (Code: {currentRoomCode})
            </span>
          </div>
          <button className="banner-btn">
            Go Back
          </button>
        </div>
      )}
      
      {/* ... rest of page ... */}
    </div>
  );
}
```

**Styling:**
```css
.room-status-banner {
  background: linear-gradient(135deg, var(--casino-bg-elevated), var(--casino-bg-surface));
  border: 1px solid var(--accent-gold);
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  animation: slideDown 0.3s ease;
}

.status-icon {
  color: var(--accent-gold);
  font-size: 20px;
  margin-right: 12px;
}

.status-text {
  color: var(--text-primary);
  font-weight: 500;
}

.banner-btn {
  background: var(--accent-gold);
  color: var(--bg-primary);
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.banner-btn:hover {
  background: var(--accent-gold-light);
  box-shadow: var(--glow-gold-strong);
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

---

## 🎯 PART 7: EDGE CASES & HANDLING

### Case 1: Page Refresh While in Room
```
User in lobby/game → Refresh page
→ Room info loaded from localStorage
→ User stays in lobby (automatic redirect if on home)
```

**Implementation:**
```typescript
// In layout.tsx atau app root component
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useNavigationStore } from '@/store/navigationStore';

export function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { isInRoom, currentRoomId } = useNavigationStore();
  
  useEffect(() => {
    // If user is supposed to be in room but on home page
    if (isInRoom && currentRoomId && pathname === '/') {
      // Optional: auto-redirect to room
      // router.push(`/lobby/${currentRoomId}`);
      
      // Or: show "Back to Room" buttons (implemented above)
    }
  }, [isInRoom, currentRoomId, pathname, router]);
  
  return (
    // ... layout ...
  );
}
```

### Case 2: Room No Longer Exists
```
User clicks "Back to Room" but room was deleted
→ Backend returns 404
→ Clear room state
→ Redirect to home with error message
```

**Implementation:**
```typescript
// In Back to Room handler
const handleBackToRoom = async () => {
  try {
    // Check if room still exists
    const response = await fetch(`/api/rooms/${currentRoomId}`);
    
    if (!response.ok) {
      throw new Error('Room not found');
    }
    
    // Room exists, go back
    router.push(`/lobby/${currentRoomId}`);
  } catch (error) {
    // Room no longer exists
    clearRoomInfo();
    showToast('Room tidak ditemukan', 'error');
    // Stay on home page (buttons back to normal)
  }
};
```

### Case 3: User Disconnected from Socket
```
User in lobby → Connection lost → Navigates home
→ On home page, can still see "Back to Room" button
→ Click → Reconnect to room if possible
```

**Implementation:**
```typescript
// In socket reconnection handler
socket.on('reconnect', () => {
  const { isInRoom, currentRoomId } = useNavigationStore.getState();
  
  if (isInRoom && currentRoomId) {
    // Attempt to rejoin room
    socket.emit('rejoin-room', { roomId: currentRoomId });
  }
});
```

---

## 🎯 PART 8: SOCKET EVENTS

### New/Updated Socket Events

**Emit Events (Frontend → Backend):**
- `leave-room` → { roomId, playerId }
- `rejoin-room` → { roomId } (for reconnection)

**Listen Events (Backend → Frontend):**
- `player-left` → { playerId, playerName } (player left room)
- `room-deleted` → {} (room was deleted by host)

---

## 🎯 PART 9: IMPLEMENTATION CHECKLIST

- [ ] Create `navigationStore.ts` dengan Zustand persistence
- [ ] Update Header component → Click "Home" navigates to home
- [ ] Update home page buttons → Change text based on `isInRoom`
- [ ] Update button click handlers → Route to room if in room
- [ ] Update room join logic → Set navigation state
- [ ] Update room leave logic → Clear navigation state
- [ ] Update leave room buttons → Add confirmation + clear state
- [ ] (Optional) Add room status banner on home page
- [ ] Handle page refresh (localStorage persistence)
- [ ] Handle room deletion/not found errors
- [ ] Handle socket reconnection
- [ ] Test all navigation flows
- [ ] Mobile responsive navigation

---

## 🎯 PART 10: TESTING FLOWS

### Test Case 1: Normal Flow (No Room)
```
1. Open home page
2. Buttons show: "Create Room" / "Join Room"
3. Click "Create Room"
4. Create room → Enter lobby
5. Verify room info in store
```

### Test Case 2: Navigate Back to Home
```
1. In lobby/game page
2. Click "Home" in navbar
3. Navigate to home page
4. Verify buttons show: "Back to Room" / "Back to Room"
5. Click "Back to Room"
6. Navigate back to lobby
7. Verify room state preserved
```

### Test Case 3: Leave Room
```
1. In lobby/game page
2. Click "Leave Room" button
3. Confirm dialog
4. Navigate to home page
5. Verify buttons back to normal: "Create Room" / "Join Room"
6. Verify room state cleared
```

### Test Case 4: Page Refresh
```
1. In room
2. Refresh page (F5)
3. Should stay in room (localStorage)
4. Go to home page
5. Buttons should show: "Back to Room"
```

---

## 📝 NOTES

- **Persistence**: Use localStorage untuk room info (survives refresh)
- **Cleanup**: Clear state when user leaves room
- **Error Handling**: Handle room not found, disconnection, etc
- **UX**: Clear visual feedback on home page
- **Navigation**: Smooth transitions between pages
- **Socket**: Emit proper events for server-side cleanup

---

## 🎯 SUMMARY OF CHANGES

| Location | Change | Purpose |
|----------|--------|---------|
| `navigationStore.ts` | NEW | Track room state |
| `Header.tsx` | UPDATE | "Home" link navigates |
| `page.tsx` (home) | UPDATE | Button text & logic change |
| Lobby/Game pages | UPDATE | Leave room functionality |
| Socket handlers | UPDATE | Set/clear room state |
| Layout/Root | UPDATE | Handle edge cases |

---

**Implementasikan dengan hati-hati untuk smooth navigation experience!**