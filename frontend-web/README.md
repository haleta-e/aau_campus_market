# AAU Campus Market — Web Frontend (Planned)

> **Status:** Directory scaffolded. React application not yet initialized.

This directory will contain the **React + TypeScript** web frontend for AAU Campus Market — a web-based interface targeted at administrators and power users who prefer a browser experience over the mobile app.

---

## Planned Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| State Management | TanStack Query (React Query) |
| HTTP Client | Axios |
| Routing | React Router v6 |

---

## Integration with Backend

The web frontend will connect to the existing **Node.js / Express / TypeScript** backend.

- **API Base URL (local):** `http://localhost:4000/api/v1`
- **API Base URL (Docker Compose):** `http://backend:4000/api/v1`
- Authentication will use the same JWT tokens issued by the backend.

---

## Environment Variables

When initialized, create a `.env.local` file in this directory (never committed):

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_APP_NAME=AAU Campus Market
```

---

## Planned Directory Structure

```
frontend-web/
├── public/              # Static assets (favicon, icons)
├── src/
│   ├── api/             # Axios instances and API call functions
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Route-level page components
│   ├── store/           # Global state (if needed beyond React Query)
│   ├── types/           # Shared TypeScript interfaces/types
│   └── main.tsx         # Entry point
├── .env.local           # Local env vars (gitignored)
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Getting Started (once initialized)

```bash
# From this directory
cd frontend-web

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Relationship to Other Parts of the Project

```
aau_campus_market/
├── lib/                 ← Flutter mobile app (Android / iOS)
├── backend/             ← Node.js + Express + Drizzle ORM + PostgreSQL
├── frontend-web/        ← React web app (this directory — planned)
├── docker-compose.yml   ← Orchestrates backend + database containers
└── Dockerfile           ← Backend Docker image definition
```

The Flutter mobile app and this React web app are **independent clients** that both consume the same backend REST API. They share no code but share the same data model.

---

## Notes

- Do **not** place this app inside the root `web/` directory — that folder is Flutter's built-in web runner and is managed by the Flutter toolchain.
- All backend API changes must remain backward-compatible with the Flutter app.
