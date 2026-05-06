# 🧠 PROJECT CONTEXT

## 1. Informasi Umum
- **Nama Project**: Gaple Game Realtime
- **Deskripsi Project**: Aplikasi web permainan Gaple (Domino) multiplayer secara real-time. Project ini mencakup frontend untuk antarmuka pemain dan backend sebagai engine permainan dan server komunikasi.
- **Tujuan Utama**: Menyediakan platform bermain Gaple tradisional Indonesia secara online dengan pengalaman yang mulus, interaktif, dan real-time.
- **Target User**: Penggemar permainan kartu/domino yang ingin bermain bersama orang lain secara remote.
- **Fitur Utama**:
    - **Multiplayer Real-time**: Sinkronisasi state permainan antar pemain menggunakan WebSocket.
    - **Sistem Lobby (Waiting Room)**: Ruang tunggu sebelum permainan dimulai di mana pemain bisa melihat daftar pemain lain yang sudah bergabung.
    - **Gameplay Gaple Lengkap**: Implementasi aturan kartu Gaple, termasuk pembagian kartu, giliran pemain, validasi penempatan kartu di dua sisi (kiri/kanan), dan deteksi pemenang.
    - **Sistem Chat Interaktif**: Fitur chat di dalam lobby dan saat bermain dengan gaya "bubble chat", indikator sedang mengetik (typing indicator), dan pesan sistem.
    - **Responsive UI**: Tampilan yang dioptimalkan untuk berbagai ukuran layar dengan estetika modern (neon/dark mode).

## 2. Teknologi yang Digunakan
- **Bahasa Pemrograman**: TypeScript (Frontend & Backend) untuk keamanan tipe data dan pengembangan yang lebih terukur.
- **Framework Utama**: 
    - **Next.js 14 (App Router)**: Sebagai framework frontend untuk rendering dan routing.
    - **Express.js**: Sebagai framework server backend.
- **Library / Packages Penting**:
    - **Socket.io & Socket.io-client**: Engine utama untuk komunikasi bi-directional real-time.
    - **Zustand**: Library state management di frontend yang ringan untuk mengelola state game dan chat secara global.
    - **Framer Motion**: Digunakan untuk animasi kartu dan transisi UI agar terasa lebih premium.
    - **Tailwind CSS**: Framework styling untuk desain antarmuka yang cepat dan responsif.
    - **Lucide React**: Koleksi icon untuk mempercantik UI.
    - **Zod**: Digunakan untuk validasi skema data baik di client maupun server.
- **Tools Tambahan**: 
    - **Nodemon & ts-node**: Untuk pengembangan backend yang lebih cepat.

## 3. Arsitektur & Alur Sistem
- **Arsitektur**: Menggunakan pola **Event-Driven Architecture** berbasis WebSocket. Backend bertindak sebagai *authoritative server* yang memegang kendali penuh atas logika dan state permainan.
- **Alur Data**:
    1. **User Action**: Pemain melakukan aksi (join, kirim chat, pasang kartu) di UI.
    2. **Socket Emit**: Frontend mengirimkan event ke backend melalui socket.
    3. **Backend Processing**: Server memvalidasi aksi (misal: apakah giliran pemain tersebut? apakah kartu bisa dipasang?).
    4. **State Update**: Jika valid, server memperbarui state internal permainan.
    5. **Broadcast**: Server mengirimkan "snapshot" state terbaru (RoomState/GameState) ke semua pemain yang terhubung di ruangan tersebut.
    6. **UI Sync**: Frontend menerima state baru dan memperbarui tampilan menggunakan Zustand secara reaktif.
- **Authentication**: Saat ini menggunakan sistem *nickname-based session* yang disimpan dalam state aplikasi (tanpa database persisten untuk kemudahan testing).

## 4. Struktur Folder & Penjelasan Detail

### Tree Struktur
```text
gaple-game/
├── backend/                # Server-side logic
│   ├── src/
│   │   ├── game/           # Core game engine (Logic, Room management)
│   │   ├── socket/         # Event handlers & socket configuration
│   │   ├── types/          # Shared interfaces & types
│   │   ├── utils/          # Helper functions
│   │   └── server.ts       # Entry point server
│   └── tsconfig.json
├── frontend/               # Client-side UI
│   ├── src/
│   │   ├── app/            # Next.js pages & layout (Lobby, Game, etc.)
│   │   ├── components/     # Reusable UI components (Chat, GameBoard, etc.)
│   │   ├── hooks/          # Custom hooks (useGame, useSocket)
│   │   ├── lib/            # Client-side utilities
│   │   ├── store/          # Zustand stores (Global state)
│   │   └── types/          # Type definitions
│   ├── tailwind.config.ts
│   └── next.config.mjs
└── PROJECT_CONTEXT.md      # File ini
```

### Penjelasan Folder & File Penting
- **`backend/src/game/GameRoom.ts`**: Mengelola siklus hidup satu ruangan permainan, termasuk penambahan pemain dan transisi antar fase (waiting -> playing -> finished).
- **`backend/src/game/GameLogic.ts`**: Berisi aturan murni permainan Gaple (validasi kartu, perhitungan skor).
- **`frontend/src/hooks/useGame.ts`**: Hook utama yang menghubungkan UI dengan event socket dan state management.
- **`frontend/src/store/gameStore.ts`**: Menyimpan state permainan yang sedang berlangsung agar bisa diakses oleh komponen manapun.
- **`frontend/src/components/chat/ChatBox.tsx`**: Komponen UI chat yang telah dioptimalkan dengan tampilan bubble dan internal scrolling.

## 5. Konvensi & Gaya Coding
- **Clean Code & DRY**: Pemisahan logika permainan ke dalam kelas-kelas khusus (Manager/Logic) agar mudah diuji dan dipelihara.
- **Naming Convention**: 
    - File & Komponen: PascalCase (contoh: `ChatBox.tsx`).
    - Fungsi & Variabel: camelCase (contoh: `sendChatMessage`).
    - Types/Interfaces: PascalCase.
- **Pemisahan Logic**: Logika komunikasi (socket) dipisahkan dari komponen UI menggunakan custom hooks (`useGame`).
- **Error Handling**: Menggunakan event `action-error` dari backend untuk memberitahu user jika ada aksi yang tidak valid (misal: salah giliran).

## 6. Cara Menjalankan Project

### Prasyarat
- Node.js (versi 18 atau terbaru)
- npm atau yarn

### Langkah-langkah
1. **Clone & Install**:
   ```bash
   # Install backend dependencies
   cd backend && npm install
   
   # Install frontend dependencies
   cd ../frontend && npm install
   ```
2. **Environment**:
   - Salin `.env.example` menjadi `.env` di masing-masing folder (jika ada).
3. **Running Dev Mode**:
   - Buka dua terminal terpisah:
     - Terminal 1 (Backend): `cd backend && npm run dev`
     - Terminal 2 (Frontend): `cd frontend && npm run dev`
4. **Akses**: Buka `http://localhost:3000` di browser.

## 7. Insight Teknis Tambahan
- **Keputusan Teknologi**: Menggunakan Socket.io karena handal dalam menangani *auto-reconnection* dan *room management* secara out-of-the-box.
- **Potensi Improvement**:
    - Penambahan database (MongoDB/PostgreSQL) untuk menyimpan statistik pemain dan histori pertandingan.
    - Implementasi sistem akun/auth yang lebih aman (JWT/NextAuth).
    - Optimasi performa sinkronisasi untuk mendukung ribuan room secara bersamaan.
- **Known Limitation**: State permainan saat ini disimpan di memori server (RAM). Jika server restart, permainan yang sedang berjalan akan hilang.

## 8. Ringkasan untuk AI
- **Project**: Game Gaple Realtime (Multiplayer).
- **Stack**: Next.js (Frontend), Node.js/Express (Backend), Socket.io (Real-time).
- **Logic**: Backend adalah sumber kebenaran (authoritative); Frontend hanya menampilkan state dan mengirim input user.
- **Struktur**: Terbagi menjadi dua folder utama (`frontend` & `backend`) yang berkomunikasi via WebSocket.
- **Hal Penting**: Perhatikan event socket yang didefinisikan di `useGame.ts` dan `socketHandler.ts` untuk memahami interaksi sistem.
