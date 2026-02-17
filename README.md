# My Library — Reading Tracker

A personal book tracking application built with Next.js 14, Prisma, MySQL, and NextAuth v5.

## Features

- 📚 Track your reading progress
- 🎯 Set yearly reading goals
- ⭐ Add ratings and reviews
- 📊 View reading statistics and trends
- 🔖 Create favorites lists
- 🔍 Search books via Open Library API

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** MySQL (Docker)
- **ORM:** Prisma
- **Auth:** NextAuth.js v5
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **External API:** Open Library

## Getting Started

### Prerequisites

- Node.js 18+ 
- Docker Desktop
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd my-library
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your `NEXTAUTH_SECRET`:
   ```bash
   # Generate with: openssl rand -base64 32
   NEXTAUTH_SECRET="your-secret-here"
   ```

4. **Start MySQL with Docker**
   ```bash
   docker-compose up -d
   ```
   
   Verify it's running:
   ```bash
   docker ps
   ```

5. **Push database schema**
   ```bash
   npm run db:push
   ```

6. **Seed initial data**
   ```bash
   npm run db:seed
   ```

7. **Run development server**
   ```bash
   npm run dev
   ```

8. **Open http://localhost:3000**

## Database Commands

```bash
# Push schema changes to database
npm run db:push

# Open Prisma Studio (DB GUI)
npm run db:studio

# Generate Prisma Client
npm run db:generate

# Seed database
npm run db:seed
```

## Project Structure

```
my-library/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts            # Seed script
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── (app)/        # Protected routes
│   │   └── (auth)/       # Auth routes
│   ├── components/        # React components
│   ├── lib/              # Utilities & configs
│   └── auth.ts           # NextAuth config
├── docker-compose.yml     # MySQL container
└── package.json
```

## Environment Variables

Required variables in `.env`:

```bash
DATABASE_URL="mysql://mylib_user:mylib_pass@localhost:3306/my_library"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-with-openssl>"
```

## Sprint Plan

- [x] Sprint 1: Setup (Next.js, Prisma, MySQL, NextAuth, Tailwind)
- [ ] Sprint 2: Auth (Login, Register, Onboarding)
- [ ] Sprint 3: Book CRUD (Manual entry)
- [ ] Sprint 4: Open Library API integration
- [ ] Sprint 5: Library page (Grid/List views, Filter/Sort)
- [ ] Sprint 6: Book Detail + Progress tracking
- [ ] Sprint 7: Ratings & Reviews
- [ ] Sprint 8: Favorites
- [ ] Sprint 9: Settings (Profile + Goals)
- [ ] Sprint 10: Dashboard (Stats, Charts, Trends)
- [ ] Sprint 11: Polish & Deploy

## License

MIT