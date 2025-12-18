# Pulse & Flow Gym

A premium gym management platform for **Pulse & Flow Gym** in Akure.

## Tech Stack
- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **Database**: Neon (Postgres) - *Pending Setup*

## Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Development Server
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. Database Setup (Prisma & Neon)
1.  **Install Prisma**:
    ```bash
    pnpm add -D prisma
    pnpm add @prisma/client
    ```
2.  **Set up Environment**:
    Copy `.env.example` to `.env` and add your Neon connection string.
    ```bash
    cp .env.example .env
    ```
3.  **Push Schema**:
    ```bash
    npx prisma db push
    ```

## Features (In Progress)
- [x] Landing Page (Red/White/Black Theme)
- [x] Authentication (UI Only)
- [x] Member Dashboard
- [x] Class Booking
- [x] Admin Portal
- [ ] Database Integration (Schema Ready)
