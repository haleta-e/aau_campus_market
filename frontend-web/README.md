# AAU Campus Market — Web Frontend

> **Status:** Active — Sprint 3 Implemented (React + TypeScript + Vite Web Application & Product Catalogue).

This directory contains the **React + TypeScript + Vite** web frontend for AAU Campus Market — a web-based marketplace interface designed for Addis Ababa University students, faculty, and administrators.

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | ^18.3.1 |
| Language | TypeScript | ^5.4.5 |
| Build Tool | Vite | ^5.2.11 |
| Styling | Responsive CSS Design Tokens | Native CSS |
| HTTP Client | Fetch API with Typed Service | Native Browser API |
| Testing | Vitest + Testing Library | ^1.6.0 |

---

## Integration with Backend

The web frontend connects directly to the existing **Node.js / Express / TypeScript** backend.

- **Default API Base URL (local):** `http://localhost:4000/api/v1`
- **Product Endpoints Used:**
  - `GET /api/v1/products` — Retrieve active marketplace products with pagination, search, and category query parameters.
  - `GET /api/v1/products/:id` — Retrieve single product details with seller and campus metadata.
- **CORS:** Supported by the backend via `cors()` middleware.
- **Error Handling:** Centralized `ApiError` utility handling HTTP error responses (400, 404, 500) and network connection failures with retry capability.

---

## Environment Variables

Create a `.env.local` or `.env` file in this directory (never committed):

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_APP_NAME=AAU Campus Market
```

A template is provided in [.env.example](file:///c:/Users/Dell/aau_campus_market/frontend-web/.env.example).

---

## Directory Structure

```
frontend-web/
├── src/
│   ├── components/            # UI components
│   │   ├── EmptyState.tsx     # Empty catalogue & empty search results
│   │   ├── ErrorMessage.tsx   # Network & API error card with retry
│   │   ├── FilterBar.tsx      # Search input, category, campus & stock filters
│   │   ├── Header.tsx         # University marketplace branding & campus badges
│   │   ├── LoadingSkeleton.tsx# Shimmer loading skeleton cards
│   │   ├── Pagination.tsx     # Page navigation controls
│   │   ├── ProductCard.tsx    # Responsive product card with price & stock
│   │   └── ProductGrid.tsx    # Responsive multi-column grid
│   ├── config/
│   │   └── api.ts             # Base URL configuration & ApiError class
│   ├── services/
│   │   ├── productService.ts  # Typed API service for product retrieval
│   │   └── productService.test.ts # Vitest suite for productService
│   ├── types/
│   │   └── product.ts         # TypeScript interfaces (Product, Pagination, DTOs)
│   ├── test/
│   │   └── setup.ts           # Test environment setup (@testing-library/jest-dom)
│   ├── App.css                # Component styling & responsive breakpoints
│   ├── App.test.tsx           # Integration tests for catalogue & states
│   ├── App.tsx                # Main catalogue view with search & filters
│   ├── index.css              # Global styles & AAU color tokens
│   ├── main.tsx               # Application entry point
│   └── vite-env.d.ts          # Vite client type definitions
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Getting Started

```bash
# Navigate to the frontend-web directory
cd frontend-web

# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Run TypeScript type check
npm run typecheck

# Run automated tests
npm test

# Build for production
npm run build
```

---

## Features Implemented (Sprint 3)

* **Verified Web Scaffold:** Clean React 18, TypeScript, and Vite setup.
* **Typed Product API Service:** Communicates with Express backend `GET /api/v1/products` using native Fetch API.
* **Responsive Product Catalogue:** Accessible grid displaying product name, price in ETB, category tag, seller store name, campus location, and stock availability badge.
* **Search and Multi-Attribute Filtering:**
  * Real-time debounced text search by product name.
  * Category dropdown filter.
  * Campus location filter covering AAU campuses (4 Kilo, 5 Kilo, 6 Kilo, Sefer Selam, Mexico, Ledeta).
  * "In Stock Only" availability toggle.
  * Sort options (Price Low to High, Price High to Low, Name A-Z).
* **Comprehensive Application States:**
  * Initial loading skeleton with shimmer animation.
  * Error state handling backend disconnections with retry button.
  * Empty state handling zero products in marketplace or zero search matches with clear-filters action.
  * Pagination navigation for paginated result sets.
