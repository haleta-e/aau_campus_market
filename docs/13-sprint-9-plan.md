# AAU Campus Market — Sprint 9 Plan
## End-to-End Verification, Security, Deployment Readiness, and MVP Release

**Status:** Planned — final MVP release gate  
**Goal:** Verify the complete first-version journey across clients/backend, fix release blockers, and document reproducible setup and known limitations. This is not a feature-expansion sprint.

### Preconditions
Review Sprints 3–8 and the project requirements/backlog. Resolve or explicitly exclude role, delivery, payment, and business-rule items that are not part of the MVP. Use synthetic/de-identified test data.

### Tasks
- **S9-01 Scope audit:** Map every MVP requirement to code/test evidence. Identify mock data, placeholders, broken controls, hardcoded fallback IDs, and unimplemented flows.
- **S9-02 Buyer E2E:** Test login, catalogue/search, details, cart, checkout, real backend order ID, order history/status, stock, and totals. Include empty cart, out-of-stock, network failure, expired session, and duplicate-submit cases.
- **S9-03 Admin/operations E2E:** Test admin access, stock operations, order oversight, and any seller/worker/complaint/special-request workflows included in MVP.
- **S9-04 Automated checks:** Run configured backend tests; frontend lint/typecheck/tests/build; Flutter analyze/tests; and integration tests where configured. Fix release blockers; don't suppress failures.
- **S9-05 Security/privacy:** Verify server-side authorization, secret handling, password hashing, safe errors, production CORS/configuration, and least-privilege access to personal data. Do not claim a formal security certification.
- **S9-06 Reliability/UX:** Check loading/empty/error/retry states, responsive web behavior, missing images/data, session failures, and accurate order results.
- **S9-07 Setup/release docs:** Document tool versions, environment variable names (never secret values), database/backend startup, Flutter/web startup, tests, known limitations, and recovery steps.
- **S9-08 Release decision:** Update backlog statuses from evidence. Record READY or NOT READY with test results and known limitations.

### Acceptance criteria
- [ ] Every MVP requirement has an evidence-based status.
- [ ] Core buyer journey passes end to end against the real backend.
- [ ] Included admin/operational flows are tested.
- [ ] Configured automated checks pass or exceptions are explicitly accepted and documented.
- [ ] No known critical/high-severity release blockers remain.
- [ ] Authorization and sensitive-data handling are reviewed.
- [ ] Setup instructions are reproducible.
- [ ] Known limitations and excluded features are documented.
- [ ] Release decision is recorded as READY or NOT READY.

### Release gate
A successful build alone does not mean production-ready. If a critical order, stock, authorization, or deployment check fails, mark NOT READY and create focused fixes.

### Out of scope
Major redesign, nonessential features, unapproved schema changes, and unsupported claims of security certification.

### Definition of done
The release checklist has been executed; results and limitations are documented; the MVP release decision is evidence-based.

### Suggested separate commits
- `test(mvp): add end-to-end release verification`
- `fix(mvp): resolve release-blocking defects`
- `docs(release): document setup and MVP limitations`
- `docs(backlog): record evidence-based MVP completion status`
