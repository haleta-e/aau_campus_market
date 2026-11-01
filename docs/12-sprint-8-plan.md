# AAU Campus Market — Sprint 8 Plan
## Essential Admin Operations, Inventory Coordination, and Marketplace Rules

**Status:** Completed (with documented backend extensions blocked)  
**Goal:** Ensure the MVP's essential administrative tasks work without duplicating existing features or creating conflicting stock sources.

### Preconditions
Inspect the existing admin routes, Flutter admin screens, DB schema, tests, backlog, and any web admin functionality. Classify features as implemented, partial, missing, blocked, or outside MVP before coding.
- **Audit Findings:**
  - Backend Admin Routes: `GET /api/v1/admin/stats`, `GET /api/v1/admin/users`, `PATCH /api/v1/admin/users/:id/status`, `GET /api/v1/admin/orders`, `GET /api/v1/admin/audit-logs` strictly require `ADMIN` role.
  - Backend Complaint Routes: `GET /api/v1/complaints/admin`, `PATCH /api/v1/complaints/:id/resolve` strictly require `ADMIN` role.
  - Backend Product Routes: `PATCH /api/v1/products/:id`, `DELETE /api/v1/products/:id` permit `ADMIN` role for inventory/price adjustments and deactivations.
  - Database schema has roles: `'ADMIN' | 'SELLER' | 'BUYER'`. `DELIVERY_WORKER` does not exist in the DB enum (Blocked).
  - Discount Management: No discount table or endpoints in DB/backend (Blocked pending schema migration).
  - Special Requests: No special request tables or endpoints exist in DB/backend. Mon/Wed/Sat 6AM-3PM and deposit rules documented as blocked decisions (Blocked pending schema migration).

### Tasks
- [x] **S8-01 Capability audit:** Complete audit of backend routes, DB schema, and admin endpoints.
- [x] **S8-02 Essential admin UI:** Implemented `AdminDashboard.tsx` in `frontend-web` with Overview KPIs, User management, Order monitoring, Complaint management, Inventory coordination, and Audit trail.
- [x] **S8-03 Inventory coordination:** Implemented admin product inventory editor with stock quantity, price, and status modification (`PATCH /api/v1/products/:id`) and deactivation (`DELETE /api/v1/products/:id`). Active products with zero stock flag warning banner and out-of-stock badge.
- [x] **S8-04 Discounts:** Audited backend — discounts table does not exist in schema. Documented blocker notice on dashboard and in sprint report.
- [x] **S8-05 Special requests:** Audited backend — special requests schema does not exist. Documented blocker notice on dashboard and in sprint report without inventing deposit amounts or unbacked workflows.
- [x] **S8-06 Complaints/verification:** Implemented full dispute resolution dialog (`PATCH /api/v1/complaints/:id/resolve`) and user account activation/suspension/deactivation (`PATCH /api/v1/admin/users/:id/status`).
- [x] **S8-07 Tests/docs:** Added `adminService.test.ts` (8 unit tests) and `AdminDashboard.test.tsx` (8 component tests). Verified 16 test files (91 tests) pass in frontend-web, 9 unit tests pass in backend.

### Acceptance criteria
- [x] Existing capabilities were audited before coding.
- [x] Only missing MVP-critical admin functionality is added.
- [x] Admin actions are server-authorized (`requireRole('ADMIN')` enforced on backend and protected route in frontend).
- [x] Admin-controlled stock remains authoritative; seller reports do not overwrite it.
- [x] Price/discount/order rules agree with backend behavior.
- [x] Special-request timing and deposit rules are not guessed; documented as blockers.
- [x] Relevant tests and build results are recorded (91 frontend tests passing, build clean).
- [x] Existing Flutter/admin behavior is preserved.

### Verification Evidence
- `frontend-web/src/types/admin.ts`: Admin types matching backend schemas.
- `frontend-web/src/services/adminService.ts`: Admin API service layer.
- `frontend-web/src/components/AdminDashboard.tsx`: Comprehensive Admin control panel.
- `frontend-web/src/services/adminService.test.ts`: 8/8 tests pass.
- `frontend-web/src/components/AdminDashboard.test.tsx`: 8/8 tests pass.
- Total frontend tests: 91/91 passing across 16 test files.
- Production build: `vite build` completed successfully in 1.48s (dist/assets/index-WFHzwoZR.js 222.86 kB).
- Backend tests: 9/9 passing.

### Out of scope
Full admin redesign, payroll/accounting, automated payouts, new payment gateways, and unapproved schema/business-rule changes.

### Definition of done
MVP-critical missing admin tasks work and are tested; unbacked features (discounts, special requests, delivery worker) are transparently documented as blockers.
