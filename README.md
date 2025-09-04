# ⛰️ Zenith

> **Zenith** is a personal growth platform where your progress feels like climbing a mountain. It’s an AI-powered planning engine that turns ambitious goals into a realistic, step-by-step journey.

**Plan the path. Claim the peak.**

---

### 🌟 The Vision

Most to-do apps are just lists. Zenith is a **smart productivity companion** that makes progress tangible, visual, and motivating. It combines intelligent, adaptive planning with a calm, modern design to help you conquer your goals, one milestone at a time.

  * **Mountain Climb Progression:** Visualize your projects as a mountain climb. Every completed milestone is a checkpoint on your ascent to the summit.
  * **Intelligent Planning:** The AI engine breaks down your high-level goals into realistic daily tasks, adapting to your pace and providing motivational nudges.
  * **Calm & Focused Design:** A minimal, modern interface designed to reduce overwhelm and keep you focused on what's next.

---

### 🚀 Getting Started

The project is structured as a Turborepo monorepo.

**Prerequisites:** Node.js, pnpm

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/zenith.git
    cd zenith
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
3.  **Start the development server:**
    ```bash
    pnpm run dev
    ```
    This will start both the web frontend (`apps/web`) and the API backend (`apps/api`).

---

### 🛠️ Tech Stack

**Monorepo:** Turborepo, pnpm

**Frontend:** Next.js (App Router), React, TailwindCSS, shadcn/ui

**Backend:** Next.js API Routes, Prisma, MongoDB

**Shared:** TypeScript, Zod

---

### 🗺️ Current Status

We have a working monorepo scaffold with shared TypeScript and Zod schemas.

  * **Frontend:** Next.js + Tailwind + shadcn/ui setup is complete, ready for UI development.
  * **Backend:** API routes are defined and ready to be connected to the database.
  * **Schemas:** The core data models for `User`, `Plan`, `Milestone`, and `Task` are defined and shared across the apps.

---

### 🤝 Contributing

This project is in its early stages, and we welcome collaboration.

If you'd like to contribute, please feel free to open an issue or start a discussion.

---

### 📜 License

Zenith is licensed under the MIT License.
