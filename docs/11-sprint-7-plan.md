# AAU Campus Market — Sprint 7 Plan
## Order History, Status Visibility, and Delivery Workflow Foundation

**Status:** Completed (Order History & Detail Views) & Blocked by Architecture Decision (Delivery Workflow)  
**Goal:** Let buyers view their real orders and statuses, and prepare or implement the minimum delivery workflow only after role/data decisions are confirmed.

### Decision gate
Inspect order APIs, status transitions, current DB schema, campus/seller relationships, authorization, and existing mobile order screens. A previous audit reported that `DELIVERY_WORKER` was not a DB role enum and multi-role student accounts need a design decision. Verify current code. Do not add roles or migrations without approval.

**Investigation Findings & Decision Outcome:**
1. **Database Role Enum:** Verified in `backend/src/db/schema.ts` that the users table `role` column enum strictly permits: `'ADMIN' | 'SELLER' | 'BUYER'`. There is **no `DELIVERY_WORKER` role** in the database schema or auth middleware.
2. **Delivery Tables & Endpoints:** No delivery worker assignment tables, routes, or order assignment endpoints currently exist in the backend.
3. **Multi-Role Structure:** Students cannot currently hold both `BUYER` and `DELIVERY_WORKER` roles without a schema migration and architectural decision (e.g. separate role membership table vs enum expansion).
4. **Resolution:** Per project guidelines prohibiting unauthorized database schema migrations and unapproved role redesigns, **S7-04 and S7-05 are explicitly blocked**. Full buyer order history, detail viewing, and real status mapping are completed and verified without mutating the backend schema.

### Tasks
- [x] **S7-01 Order history:** Created `OrderHistoryPage` calling `GET /api/v1/orders/my`. Shows order number, order date, status badge, payment status, and order total. Includes loading skeleton, empty state, and error handling with retry capability.
- [x] **S7-02 Order detail:** Created `OrderDetailView` calling `GET /api/v1/orders/:id`. Displays order metadata, status badge, payment status, and line items table with product name, category, quantity, unit price, and subtotal.
- [x] **S7-03 Status display:** Mapped real backend order states (`PENDING`, `CONFIRMED`, `PREPARING`, `READY`, `ACCEPTED`, `COMPLETED`, `CANCELLED`) to user-friendly status labels and color-coded badges.
- [x] **S7-04 Delivery workflow analysis:** Documented role and schema requirements. Identified that adding `DELIVERY_WORKER` requires database migration approval, audit log support, and order assignment state tracking.
- [ ] **S7-05 Approved delivery implementation:** **BLOCKED** — Awaiting formal stakeholder/faculty approval for database migration and role model design.
- [x] **S7-06 Tests/docs:** Vitest unit test suites created for `OrderHistoryPage`, `OrderDetailView`, and routing integration in `App.test.tsx`.

### Acceptance criteria
- [x] Buyers can view their own real order history and details.
- [x] Status labels match backend states.
- [x] Unauthorized users cannot access another buyer's orders (route guard in frontend + backend JWT ownership checks).
- [x] Loading, empty, and failure states work.
- [x] Delivery role/schema changes are not made without approval (strict compliance).
- [ ] If implemented, delivery assignment respects campus/dorm-area rules and server permissions (BLOCKED pending approval).
- [x] Tests and build results are recorded honestly.

### Verification Outcome
- **Frontend Test Suite:** 75 tests passing across 14 test suites (`npm run test` / `vitest run`).
- **Type Checking:** Passed (`npm run typecheck` / `tsc --noEmit` with 0 errors).
- **Production Build:** Succeeded (`npm run build` / `vite build`).
- **Backend Unit Tests:** 9/9 passed (`npm test -- tests/unit`).

### Out of scope
Real-time GPS/maps, worker payouts, broad role redesign, and rewriting mobile order flows.

### Definition of done
Order history/detail works; delivery is implemented against an approved design or explicitly blocked with a concrete decision needed.

### Suggested separate commits
- `feat(web-orders): add order history and detail views`
- `feat(delivery): add approved delivery workflow support` (only if approved - BLOCKED)
- `test(web-orders): cover ownership and status handling`
- `docs(sprint): record Sprint 7 decisions and results`
