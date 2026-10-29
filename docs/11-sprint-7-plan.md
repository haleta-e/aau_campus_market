# AAU Campus Market — Sprint 7 Plan
## Order History, Status Visibility, and Delivery Workflow Foundation

**Status:** Planned; depends on verified order creation and approved operational rules  
**Goal:** Let buyers view their real orders and statuses, and prepare or implement the minimum delivery workflow only after role/data decisions are confirmed.

### Decision gate
Inspect order APIs, status transitions, current DB schema, campus/seller relationships, authorization, and existing mobile order screens. A previous audit reported that `DELIVERY_WORKER` was not a DB role enum and multi-role student accounts need a design decision. Verify current code. Do not add roles or migrations without approval.

### Tasks
- **S7-01 Order history:** Show authenticated user's real orders with available ID, date, status, total, and fulfillment details. Add loading/empty/error/retry states.
- **S7-02 Order detail:** Show items, quantities, prices, total, payment/fulfillment info, and status when the API provides them.
- **S7-03 Status display:** Map actual backend states to readable labels without inventing transitions. Show only actions the backend permits.
- **S7-04 Delivery workflow analysis:** Document worker verification, assignment, campus/dorm-area restrictions, completion confirmation, and gaps in current APIs/schema.
- **S7-05 Approved delivery implementation:** Only after role/data-model approval, implement the minimum approved assignment/status flow, server-side permissions, and audit events where supported. If blocked, finish order history and clearly mark delivery tasks blocked.
- **S7-06 Tests/docs:** Test order ownership, access restrictions, statuses, errors, and approved delivery transitions.

### Acceptance criteria
- [ ] Buyers can view their own real order history and details.
- [ ] Status labels match backend states.
- [ ] Unauthorized users cannot access another buyer's orders.
- [ ] Loading, empty, and failure states work.
- [ ] Delivery role/schema changes are not made without approval.
- [ ] If implemented, delivery assignment respects campus/dorm-area rules and server permissions.
- [ ] Tests and build results are recorded honestly.

### Out of scope
Real-time GPS/maps, worker payouts, broad role redesign, and rewriting mobile order flows.

### Definition of done
Order history/detail works; delivery is implemented against an approved design or explicitly blocked with a concrete decision needed.

### Suggested separate commits
- `feat(web-orders): add order history and detail views`
- `feat(delivery): add approved delivery workflow support` (only if approved)
- `test(web-orders): cover ownership and status handling`
- `docs(sprint): record Sprint 7 decisions and results`
