# AAU Campus Market — Sprint 5 Plan
## Web Authentication, Sessions, and Role-Aware Navigation

**Status:** Planned; depends on verified Sprints 3 and 4  
**Goal:** Connect the React web app's login/session experience to the existing backend without replacing or weakening its authentication rules.

### Preconditions
- Sprint 3 catalogue and Sprint 4 cart are verified.
- Inspect the actual auth routes, request/response schemas, token/session design, roles, and tests before coding.
- Protect existing Flutter and backend behavior.

### Tasks
- **S5-01 Contract audit:** Inspect backend auth controllers, validation, middleware, logout/refresh behavior, and role permissions. Record actual contracts; do not guess endpoints or fields.
- **S5-02 Login UI:** Add an accessible login form, client-side required-field feedback, and useful invalid-credential/network/server errors.
- **S5-03 Session management:** Implement the session approach the backend actually supports. Do not expose credentials in logs or invent refresh behavior. Handle expired sessions safely.
- **S5-04 Protected routes:** Add authenticated route handling and role-aware navigation. UI hiding is not a substitute for server-side authorization.
- **S5-05 Cart/session behavior:** Define what happens to a guest cart at login/logout; preserve safe cart contents without inventing server-side cart sync.
- **S5-06 Tests/docs:** Test success/failure, session restore, logout, protected routes, and expired sessions where practical; record evidence.

### Acceptance criteria
- [ ] Login uses the real backend contract.
- [ ] Invalid credentials and network failures show useful messages.
- [ ] Session storage/refresh/logout matches the actual backend design.
- [ ] Protected routes handle unauthenticated users and access denial.
- [ ] Backend authorization remains authoritative.
- [ ] No credentials or secrets are committed.
- [ ] Applicable tests and production build pass, with results recorded.
- [ ] Existing mobile/backend behavior remains intact.

### Out of scope
Backend-auth rewrite, social login, new role architecture, and delivery-worker approval unless separately approved.

### Risks / decisions
A prior audit reported that `DELIVERY_WORKER` was absent from the DB role enum and that multiple roles per student need an architecture decision. Verify current code; do not change schema by assumption.

### Definition of done
All acceptance criteria have evidence or are explicitly marked blocked/not tested.

### Suggested separate commits
- `feat(web-auth): add backend-connected login flow`
- `feat(web-auth): add session handling and protected routes`
- `test(web-auth): cover authentication and route access`
- `docs(sprint): record Sprint 5 results`
