# 🌄 Zenith

> A calm, modern, and motivating productivity platform — where your progress feels like climbing a mountain.  
> **Plans → Milestones → Tasks → Summit.**

---

## 🚀 Vision

Zenith is more than just a task manager. It’s a **personal growth companion** designed to make progress **immersive, minimal, and motivating**.  
The app combines **structured productivity** with **calm design and smart recommendations**, so users feel like they’re steadily climbing toward their goals.

### Core Ideas
- **Mountain Climb Progression**  
  Visualize plans, milestones, and tasks as part of a mountain climb. Every completed milestone takes you closer to the summit.
- **Daily Focus**  
  Clear distribution of **today’s goals**, **current milestone**, and **upcoming challenges**.
- **Calm & Motivating Design**  
  Modern UI with smooth animations, gradients, and an uplifting aesthetic.
- **Smart Assistance** (future)  
  AI-powered daily goal generation, insights, and motivational nudges.

---

## 🏗 Current Structure

zenith/
│
├── apps/
│   ├── api/                  # Backend service (Next.js API, DB-ready)
│   └── web/                  # Frontend (Next.js, Tailwind, shadcn/ui)
│
├── packages/
│   ├── types/                # Shared Zod schemas, TypeScript types, domain models
│   └── utils/                # (future) shared helpers (formatters, API client, auth utils)
│   ...
├── package.json              # Root deps & scripts
├── pnpm-workspace.yaml       # Monorepo workspace config
├── tsconfig.base.json        # Base TS config for monorepo
├── turbo.json                # Turborepo pipeline config
└── .gitignore

---

## ✅ What We’ve Built So Far

- **Monorepo Setup**
  - Turborepo + pnpm with `apps/` and `packages/`.
  - Shared TypeScript + Zod schemas across frontend & backend.
- **Frontend (apps/web)**
  - Next.js + Tailwind + shadcn/ui working setup.
  - Ready for UI development (auth, dashboard, progress views).
- **Backend (apps/api)**
  - Scaffolding in place with validation via shared schemas.
  - DB-ready structure (Postgres + Prisma planned).
- **Shared Types (packages/types)**
  - **Auth**: `RegisterUser`, `Login`, `Session`.
  - **Tasks**: `Task`, `Reminder`, `DailyGoal`.
  - **Plans & Progress**: `Plan`, `Milestone`, `ProgressSnapshot`.
  - **Shared**: `ApiResponse`, `PaginatedResponse`, `NavItem`, `QuoteOfTheDay`.
  - **AI (planned)**: `AIRecommendation`, `GenerateDailyGoals`.

---

## 🔮 Next Steps

1. **Backend API Routes**
   - `/auth/register`, `/auth/login`
   - `/plans` (CRUD), `/tasks` (CRUD)

2. **Frontend Integration**
   - Auth pages (login, register, forgot password).
   - Dashboard shell (sidebar, nav, landing).
   - Mountain-climb progress visualization.

3. **Database**
   - MongoDb + Prisma for `User`, `Plan`, `Task`, `Milestone`.

4. **Shared Utilities**
   - API client wrapper (`apiFetch<T>()`).
   - Date & progress tracking helpers.

5. **UI & Animations**
   - Framer Motion transitions.
   - Sleek, minimal, calm visual storytelling.

---

## 🧠 Long-Term Vision

- **AI Assistance**  
  Generate daily goals and progress insights.
- **Motivation Layer**  
  Streaks, motivational quotes, subtle nudges.
- **Immersive Experience**  
  Interactive mountain visualization, checkpoint highlights, and summit celebrations.

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)  
- **Styling**: [TailwindCSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)  
- **Backend**: Next.js API routes (Express/Fastify later if needed)  
- **Database**: MongoDB + Prisma (planned)  
- **Validation & Types**: Zod + TypeScript  
- **Monorepo Tools**: Turborepo + pnpm  

---

## 🤝 Contributing

This project is in its **early stages**. Contributions, ideas, and discussions are welcome.  
Open an issue or start a discussion if you’d like to collaborate.

---

## 📜 License

MIT License.  
Feel free to fork, use, and adapt Zenith for your own needs.
