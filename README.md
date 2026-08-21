 AAU Campus Market

*Your Campus Marketplace*

## Description

AAU Campus Market is a mobile e-commerce application built for Addis Ababa
University students. It combines a real product catalog from the Fake Store
API with a local, campus-specific marketplace where students buy everyday
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

- **Student login** validated against a campus ID (`UGR/1234/24` format)
  and authenticated through the Fake Store API
- **Unified product marketplace** — Fake Store API products (Electronics,
  Fashion, Accessories) and local campus products (Stationery, Snacks,
  Drinks, Detergent, Sanitary) shown together, with no visible distinction
  between the two sources
- **Campus-based filtering** — products and sellers shown are scoped to the
  student's selected campus, with an option to browse other campuses before
  deciding whether to order
- **Category browsing and search by product title**
- **Product details** with price, stock, seller info, and ratings
- **Seller profiles** with campus, department, contact (call/message), and
  student-submitted reviews
- **Shopping cart** with quantity management and per-item notes for the
  seller (e.g. brand preference), persisted locally so it survives an app
  restart
- **Buy Now** — skip the cart and check out a single product immediately
- **Checkout** with simulated payment methods (Cash, Telebirr, CBE Birr,
  Pay on Delivery) and a choice between **Delivery** (flat 20 Birr fee) and
  **Pickup** (free, available when every item in the order is a local
  campus product with a real seller to collect from)
- **Order history** with simulated delivery/pickup status tracking
- **User profile** combining local student data with Fake Store API user
  data
- **Active discounts** (e.g. Exam Season Discount) shown only when
  currently within their configured date range
- **Hidden admin mode** (long-press the app logo) with a dashboard showing
  marketplace stats
- Proper loading, empty, and error states throughout, with retry on failure
- Built with Flutter, Dart, Material 3, and Riverpod for state management

## Submission Details

- **Full Name:** [Etsegenet Amsalu]
- **CTC Number:** [CTC-1495-26]
- **Classroom Number:** [30003]

---

## DevOps Practical Assignment Setup

### 1. Building the Backend Docker Image
To build the Docker image for the Node.js + Express backend from the root directory:
```bash
docker build -t YOUR_DOCKERHUB_USERNAME/aau-campus-market-backend:1.0 .
```

### 2. Running with Docker Compose
To start the backend and PostgreSQL services together in detached mode:
```bash
docker compose up -d --build
```
To stop the services and retain database data:
```bash
docker compose down
```
To stop the services and remove the database volume:
```bash
docker compose down -v
```

### 3. Database Connectivity
The backend connects to PostgreSQL using environment variables:
* **Host**: `DB_HOST=db` inside Docker Compose (uses Docker service name resolution).
* **Port**: `DB_PORT=5432`
* **Database Name**: `DB_NAME=aau_campus_market_db`
* **Health Check**: `GET /health` runs a `SELECT NOW()` query to verify live DB connectivity.

### 4. Docker Hub Image Tagging & Pushing
Tag and push the image to Docker Hub:
```bash
docker login
docker tag YOUR_DOCKERHUB_USERNAME/aau-campus-market-backend:1.0 YOUR_DOCKERHUB_USERNAME/aau-campus-market-backend:1.0
docker push YOUR_DOCKERHUB_USERNAME/aau-campus-market-backend:1.0
```

### 5. GitHub Actions CI/CD Workflow
The repository includes `.github/workflows/ci-cd.yml` which triggers automatically on every push or pull request to `main`/`master`:
1. Checks out repository source code.
2. Sets up Node.js environment.
3. Installs backend dependencies (`npm ci`).
4. Runs backend unit tests (`npm test`).
5. Validates Docker image build (`docker build`).

