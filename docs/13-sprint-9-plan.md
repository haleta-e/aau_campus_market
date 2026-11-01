# AAU Campus Market — Sprint 9 Plan
## End-to-End Verification, Security, Deployment Readiness, and MVP Release

**Status:** Completed — Final MVP Release Gate Passed  
**Goal:** Verify the complete first-version journey across clients/backend, fix release blockers, and document reproducible setup and known limitations.

### Preconditions
Review Sprints 3–8 and the project requirements/backlog. Resolve or explicitly exclude role, delivery, payment, and business-rule items that are not part of the MVP.

### Tasks
- [x] **S9-01 Scope audit:** Mapped all MVP requirements to code and test evidence across web, backend, and documentation. Identified and documented known boundaries (delivery worker role not in DB, multi-seller cart split, unbacked discount/special request schemas).
- [x] **S9-02 Buyer E2E:** Verified full buyer journey: login, token persistence in localStorage, catalogue browsing, search, category filter, product details, stock display, cart persistence, checkout with fulfillment/payment choices, order placement with backend ID, post-order confirmation receipt, order history list, order detail breakdown, and route guards.
- [x] **S9-03 Admin/operations E2E:** Verified admin dashboard: real KPI data from backend, user account moderation (activation/suspension/deactivation), order monitoring across campuses, complaint dispute resolution with notes, inventory adjustments and deactivations, and paginated audit logs.
- [x] **S9-04 Automated checks:**
  * Frontend unit & component tests: **16 test files, 91 tests passing** (`npx vitest run`).
  * Frontend typecheck: **0 errors** (`npm run typecheck`).
  * Frontend production build: **Successful** (`npm run build` → 222.86 kB JS, 39.23 kB CSS).
  * Backend unit tests: **2 test files, 9 tests passing** (`npm test -- tests/unit`).
- [x] **S9-05 Security/privacy:** Server-side authorization enforced via JWT and `authorize('ADMIN' | 'SELLER' | 'BUYER')`. Client-side route guards redirect unauthenticated and unauthorized requests. Passwords hashed using bcrypt. Sensitive credentials never logged.
- [x] **S9-06 Reliability/UX:** Loading skeletons, empty states, error retry banners, accessible ARIA landmarks and roles, and responsive mobile-first grid layout verified.
- [x] **S9-07 Setup/release docs:** Updated `README.md` with complete setup instructions for backend, database, web frontend, environment variables, and documented MVP boundaries.
- [x] **S9-08 Release decision:** **READY FOR MVP RELEASE** (with documented boundaries).

### Acceptance criteria
- [x] Every MVP requirement has an evidence-based status.
- [x] Core buyer journey passes end to end against the real backend contract.
- [x] Included admin/operational flows are tested.
- [x] Configured automated checks pass (91 frontend tests, 9 backend unit tests, 0 type errors, clean build).
- [x] No known critical/high-severity release blockers remain.
- [x] Authorization and sensitive-data handling are reviewed.
- [x] Setup instructions are reproducible in `README.md`.
- [x] Known limitations and excluded features are documented.
- [x] Release decision is recorded as **READY FOR MVP RELEASE**.

### Release Decision: READY FOR MVP RELEASE
The core MVP capabilities for Addis Ababa University Campus Market are fully implemented, thoroughly tested, and ready for release under the documented operational assumptions.
