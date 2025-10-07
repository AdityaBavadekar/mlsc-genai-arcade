# GEN AI Arcade - MLSC VIT Pune

GEN AI Arcade is a web application combining an arcade-style game and an event portal for MLSC VIT Pune.  
It includes:

- Landing page with event info and countdown  
- Arcade game with leaderboard  
- Post-game pages with player rank and social links  
- "Why Join" section

**Tech Stack:** Next.js, TailwindCSS, PostgreSQL, Prisma  
**Deployment:** Vercel ([View](https://mlsc-genaiarcade.vercel.app/))

## Pages & Routes

- **Landing Page:** `src/app/page.tsx` — Event intro, countdown, registration links  
- **Arcade Game:** `src/app/arcade/page.tsx` — Game interface with score input  
- **API Routes:** `src/app/api/arcade/route.ts` — Save scores, fetch leaderboard  

## Setup

1. Clone the repo:

```bash
git clone https://github.com/AdityaBavadekar/mlsc-genai-arcade.git
cd gen-ai-arcade
````

2. Install dependencies with pnpm:

```bash
pnpm install
```

3. Set up environment variables:

```
# For macOS/Linux
cp .env.example .env

# For Windows
copy .env.example .env
```

4. Setup Prisma and migrations:

- Start PostgreSQL using Docker Compose:
```bash
docker-compose up -f docker-compose.yml -d
```

- Run migrations:

```bash
npx prisma migrate deploy && npx prisma generate
```

5. Start the development server:

```bash
pnpm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Notes

* **Leaderboard**: Cached for 1min
* Whenever someone plays the game, their score is saved to the database and the cache is invalidated.

## Structure

```
/src/app
  ├─ page.tsx          # Landing page
  ├─ arcade/page.tsx   # Game page
  ├─ api/arcade/route.ts # Leaderboard API
/prisma
  ├─ schema.prisma
  └─ migrations
```

