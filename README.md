# AAU Campus Market

*Your Campus Marketplace*

## Description

AAU Campus Market is a multi-client university e-commerce platform built specifically for Addis Ababa
University students. It provides a campus-tailored marketplace where students buy everyday
essentials — stationery, snacks, drinks, detergent, and sanitary items —
directly from other students acting as sellers, filtered by which of the
six AAU campuses (4 Kilo, 5 Kilo, 6 Kilo, Mexico, Sefer Selam, Ledeta) the
buyer is on.

## The Problem

Students on a large, multi-campus university regularly need small, everyday
items — a notebook before a lecture, water on a hot day, detergent for the
dorm — but the options are usually limited to whatever's physically nearby,
with no easy way to see who has what in stock, at what price, or how to
actually reach them. Meanwhile, students who already have those items to
sell (or are running small side businesses on campus) have no simple,
trusted platform to reach buyers on their own campus.

AAU Campus Market solves this by giving students a single place to browse
what's available specifically on their campus, see who's selling it, and
choose to either have it delivered or picked up in person if they're
already there — turning informal, word-of-mouth campus trade into something
organized and searchable.

## Main Features

- **Student Authentication** validated against campus credentials, authenticated through the Node.js/Express backend with JWT tokens (`accessToken` and `refreshToken`).
- **Unified Product Marketplace** — Campus products across categories (Stationery, Snacks, Drinks, Detergent, Sanitary, Electronics, Books, Clothing) listed by student sellers and managed through PostgreSQL.
- **Campus-Based Scoping** — Scoped to AAU campuses: 4 Kilo, 5 Kilo, 6 Kilo, Mexico, Sefer Selam, Ledeta.
- **Category Browsing & Live Search** — Instant debounced search and category filtering.
- **Product Details & Stock Tracking** — Live stock availability, unit prices in ETB, and seller info.
- **Persistent Shopping Cart** — LocalStorage persistence surviving browser refreshes, with item counter and quantity controls.
- **Order Checkout & Payment** — Multi-step checkout supporting fulfillment (Pickup or Campus Delivery) and payment methods (Cash on Delivery/Pickup, Telebirr, CBE Birr, Mock Payment).
- **Order History & Real-Time Tracking** — Buyer order history with status lifecycle (PENDING, CONFIRMED, PREPARING, READY, ACCEPTED, COMPLETED, CANCELLED).
- **Administrative Control Panel** — Full web dashboard for administrators: live KPI stats, user account moderation (Activate, Suspend, Deactivate), order monitoring across campuses, dispute resolution for student complaints, inventory stock/price management, and audit trail.
- **Resilient UI States** — Accessible ARIA landmarks, loading skeletons, error states with retry, empty states, and responsive design.

## Submission Details

- **Full Name:** [Etsegenet Amsalu]
- **CTC Number:** [CTC-1495-26]
- **Classroom Number:** [30003]

---

## Architecture

AAU Campus Market is a **tri-stack** architecture sharing a single REST API:

| Layer | Technology | Directory | Status |
|---|---|---|---|
| 🌐 Web App | React 18 + TypeScript + Vite | `frontend-web/` | ✅ Production Ready (Sprints 3–8) |
| ⚙️ Backend API | Node.js + Express + TypeScript + Drizzle ORM | `backend/` | ✅ Active (v1 API) |
| 🗄️ Database | PostgreSQL 16 (Docker Compose) | `backend/src/db/` | ✅ Active |
| 📱 Mobile App | Flutter + Dart + Riverpod | Root (`lib/`) | 📱 Mobile Client |

All clients communicate with the backend REST API at `/api/v1` (`http://localhost:4000/api/v1` in development).

---

## Getting Started

### Prerequisites

- **Node.js** v20+ (tested on v24.18.0)
- **npm** v10+ (tested on v11.16.0)
- **Docker & Docker Compose** (for PostgreSQL database)
- **Flutter SDK** v3.19+ (optional, for mobile app development)

### 1. Database & Backend Setup

Navigate to the `backend/` directory:

```bash
cd backend
npm install
```

Configure your environment variables in `backend/.env` (or copy from `.env.example`):
```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgres://aau_market_user:aau_market_pass@localhost:5432/aau_campus_market_db
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=*
```

Start PostgreSQL using Docker Compose:
```bash
docker compose up -d db
```

Run database migrations and seed default data:
```bash
npm run db:push
npm run db:seed
```

Start the backend server in development mode:
```bash
npm run dev
# The API will be available at http://localhost:4000/api/v1
# Swagger documentation is accessible at http://localhost:4000/api/v1/docs
```

Run backend unit tests:
```bash
npm test -- tests/unit
```

### 2. Web Frontend Setup

Navigate to the `frontend-web/` directory:

```bash
cd frontend-web
npm install
```

Start the Vite development server:
```bash
npm run dev
# The web app will launch at http://localhost:5173
```

Run the frontend test suite:
```bash
npx vitest run
```

Run TypeScript verification and production build:
```bash
npm run typecheck
npm run build
```

### 3. Web Deployment (Vercel)

The web frontend includes SPA routing configuration in `frontend-web/vercel.json` and is ready for one-click deployment on [Vercel](https://vercel.com):

#### Option A: Deploy via Vercel Dashboard (Recommended)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `aau_campus_market` repository.
4. In the Project Configuration settings:
   - **Root Directory**: Select `frontend-web`.
   - **Framework Preset**: `Vite` (automatically detected).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. In **Environment Variables**, add:
   - `VITE_API_BASE_URL`: The public URL of your deployed backend API (e.g. `https://your-api.onrender.com/api/v1` or `https://your-backend.up.railway.app/api/v1`).
6. Click **Deploy**. Vercel will build and assign a global HTTPS URL (e.g., `https://aau-campus-market.vercel.app`).

#### Option B: Deploy via Vercel CLI
```bash
cd frontend-web
npx vercel
# Follow the interactive prompts to deploy preview or production (--prod)
```


---

## Known Boundaries & Documented Limitations (MVP)

1. **Role Model**: The database `users.role` enum supports `'ADMIN' | 'SELLER' | 'BUYER'`. The `DELIVERY_WORKER` role is not supported in the existing database schema; delivery coordination features are documented as blocked pending a future schema migration.
2. **Single-Seller Checkout**: In the current MVP checkout implementation, an order is placed against a single seller (`items[0].product.seller_id`). Multi-seller cart split is documented for future release.
3. **Discounts & Special Requests**: Discount campaigns and special request workflows are not backed by tables in the database schema and are disabled/noted in the admin dashboard.
4. **Currency**: All pricing, fees, and revenue are strictly denominated in Ethiopian Birr (`ETB`).

---

## CI/CD Workflow

The repository includes `.github/workflows/ci-cd.yml` which triggers automatically on pushes and pull requests to `main`:
1. Source checkout.
2. Node.js environment setup.
3. Backend dependencies installation (`npm ci`).
4. Unit test verification (`npm test`).
5. Docker image container build validation (`docker build`).
