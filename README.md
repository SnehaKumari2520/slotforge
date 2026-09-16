# 🎰 SlotForge Simulations

**SlotForge Simulations** is a full-stack, high-performance web application designed to schedule, simulate, and analyze slot machine performance and interval time allocations in real time.

🔗 **Live Demo:** [slotforge-dun.vercel.app](https://slotforge-dun.vercel.app/)

---

## 🛠️ Tech Stack & Architecture

### Frontend
* **Framework:** [React.js](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Styling:** CSS3 (Custom keyframes, glassmorphism, responsive grid/flex layouts)

### Backend & Database
* **Runtime:** [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
* **Validation:** [Zod](https://zod.dev/) — Strict runtime schema parsing
* **Database ORM:** [Prisma](https://www.prisma.io/) (SQLite) — Type-safe query engine & migrations
* **Language:** [TypeScript](https://www.typescriptlang.org/) — Full-stack type safety

---

## 🧠 What I Learned & Key Technical Concepts

### 1. End-to-End Type Safety with Zod & Prisma
* **Zod Validation:** Implemented runtime schema parsing on incoming request bodies to reject malformed timestamps or missing titles before executing business logic.
* **Prisma Integration:** Leveraged Prisma’s auto-generated TypeScript client to perform type-safe database queries, completely avoiding raw SQL boilerplate and runtime type mismatches.

---

### 2. Overlap Detection Logic (Interval Scheduling Problem)
To prevent scheduling collisions where a new slot time range `New_Start < Exist_End` AND `New_End > Exist_Start`

I implemented mathematical interval comparison logic:

Two time intervals overlap **if and only if** the start of the new interval occurs before the end of the existing interval **AND**
the end of the new interval occurs after the start of the existing interval:

(New_Start < Exist_End) AND (New_End > Exist_Start)


* **Frontend Pre-flight Check:** Validates input timestamps instantly to display real-time availability badges before submission.
* **Backend Guard:** Re-verifies intervals server-side using the same mathematical constraint to prevent race conditions and illegal database writes.

---

### 3. Dynamic Timeline Mapping Mechanics
To render reservations accurately across a visual 24-hour track on the UI, start and end timestamps are translated into relative percentage offsets:

1. **Convert Timestamp to Minute Offset ($M$):**
   $$M = (\text{Hours} \times 60) + \text{Minutes}$$

2. **Calculate Left Offset ($L$) and Width ($W$):**
   $$L = \left( \frac{M_{\text{start}}}{1440} \right) \times 100\%$$

   $$W = \left( \frac{M_{\text{end}} - M_{\text{start}}}{1440} \right) \times 100\%$$

This mathematical mapping allows slots to position themselves dynamically along a continuous CSS track without hardcoded layout values.

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
clone the repo
cd slotforge-simulations
npm install

2. Configure Environment & Database
Create a .env file in the root directory:
DATABASE_URL="file:./dev.db"
PORT=5000

3. Run database migrations: npx prisma migrate dev --name init

4. Run the app
# Start backend server
npm run server

# Start frontend dev server
npm run dev
