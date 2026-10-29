# AAU Campus Market — Sprint 8 Plan
## Essential Admin Operations, Inventory Coordination, and Marketplace Rules

**Status:** Planned; depends on an audit of existing admin APIs and UI  
**Goal:** Ensure the MVP's essential administrative tasks work without duplicating existing features or creating conflicting stock sources.

### Preconditions
Inspect the existing admin routes, Flutter admin screens, DB schema, tests, backlog, and any web admin functionality. Classify features as implemented, partial, missing, blocked, or outside MVP before coding.

### Tasks
- **S8-01 Capability audit:** Review product/stock visibility, stock correction, order oversight, seller/worker verification, complaints, discounts, special requests, delivery fee, and delivery coordination.
- **S8-02 Essential admin UI:** Implement only missing MVP-critical actions, using existing APIs and server-side authorization.
- **S8-03 Inventory coordination:** Keep admin-managed physical inventory authoritative. Sellers may report discrepancies but must not silently overwrite authoritative stock. Prevent negative stock and follow existing cancellation/completion rules.
- **S8-04 Discounts:** Verify date/discount model and ensure frontend display matches backend pricing. Support only approved admin-managed holiday/exam discounts.
- **S8-05 Special requests:** Verify the documented schedule (Monday, Wednesday, Saturday; 6:00 AM–3:00 PM) and local-time behavior. Verify deposit/commitment and balance rules. If unspecified, document the decision needed; do not invent an amount or collect payment.
- **S8-06 Complaints/verification:** Reuse existing workflows; restrict approval actions to admins and use audit logging where supported.
- **S8-07 Tests/docs:** Test authorization, stock boundaries, discount dates, and admin actions. Update backlog only with evidence-based statuses.

### Acceptance criteria
- [ ] Existing capabilities were audited before coding.
- [ ] Only missing MVP-critical admin functionality is added.
- [ ] Admin actions are server-authorized.
- [ ] Admin-controlled stock remains authoritative; seller reports do not overwrite it.
- [ ] Price/discount/order rules agree with backend behavior.
- [ ] Special-request timing and deposit rules are not guessed.
- [ ] Relevant tests and build results are recorded.
- [ ] Existing Flutter/admin behavior is preserved.

### Out of scope
Full admin redesign, payroll/accounting, automated payouts, new payment gateways, and unapproved schema/business-rule changes.

### Definition of done
MVP-critical missing admin tasks work and are tested, or blockers/decisions are clearly documented.

### Suggested separate commits
- `feat(admin): add missing MVP operations`
- `feat(inventory): enforce approved stock coordination rules`
- `test(admin): cover authorization and inventory boundaries`
- `docs(sprint): record Sprint 8 audit and results`
