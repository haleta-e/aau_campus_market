# AAU Campus Market — Sprint 1 Plan

**Sprint:** Sprint 1
**Proposed Duration:** One week
**Status:** Planned — not yet started
**Sprint Goal:** Establish a verified baseline of the existing AAU Campus Market project and prepare the next development sprint using evidence from the repository.

---

## 1. Sprint Goal

By the end of Sprint 1, the team should understand the current state of the Flutter application, backend, database, and planned web application.

The team should also have verified the development setup, documented the status of critical workflows, identified high-priority defects and risks, and refined the Product Backlog for Sprint 2.

The goal is not to rebuild the existing application. It is to determine what already works and what should be improved next.

## 2. Sprint Backlog

| Sprint Item | Related Backlog Item   | Task                                                               | Priority | Estimated Effort | Deliverable                    |
| ----------- | ---------------------- | ------------------------------------------------------------------ | -------- | ---------------- | ------------------------------ |
| S1-01       | PB-001                 | Inspect repository structure and current branch.                   | P0       | 2 hours          | Repository overview            |
| S1-02       | PB-001                 | Inspect Flutter screens, navigation, and existing features.        | P0       | 3 hours          | Mobile feature inventory       |
| S1-03       | PB-001                 | Inspect backend routes, controllers, services, and middleware.     | P0       | 3 hours          | Backend API inventory          |
| S1-04       | PB-001                 | Inspect database schema, Drizzle configuration, and migrations.    | P0       | 2 hours          | Database assessment            |
| S1-05       | PB-002                 | Verify the development environment and startup instructions.       | P0       | 2 hours          | Verified setup checklist       |
| S1-06       | PB-002                 | Test whether the mobile app and backend can start successfully.    | P0       | 2 hours          | Startup verification results   |
| S1-07       | PB-003                 | Identify available tests, linting, formatting, and build commands. | P1       | 2 hours          | Quality-check checklist        |
| S1-08       | PB-004, PB-005         | Trace authentication and authorization implementation.             | P0       | 3 hours          | Authentication assessment      |
| S1-09       | PB-011, PB-012, PB-013 | Trace cart, checkout validation, and duplicate-order safeguards.   | P0       | 3 hours          | Shopping-workflow assessment   |
| S1-10       | PB-015, PB-016, PB-019 | Trace order processing, status transitions, and inventory updates. | P0       | 3 hours          | Order and inventory assessment |
| S1-11       | PB-042                 | Inspect existing API readiness for React web integration.          | P0       | 2 hours          | Web integration assessment     |
| S1-12       | All relevant items     | Update backlog implementation statuses and list confirmed defects. | P0       | 3 hours          | Refined Product Backlog        |
| S1-13       | Documentation          | Record setup instructions, findings, risks, and next steps.        | P1       | 2 hours          | Updated project documentation  |

**Total estimated effort: 32 hours.**

These estimates are provisional planning estimates. They may change after repository inspection, especially if the project has setup failures, undocumented behavior, or a large amount of existing code.

The 32 hours represent estimated work, not a promise that every task will fit into one calendar week. The sprint scope should be adjusted to the team's actual availability.

---

## 3. Sprint Acceptance Criteria

Sprint 1 is successful when the following outcomes are achieved.

### Repository assessment

* [ ] The current branch and working-tree state are recorded.
* [ ] The repository structure is documented.
* [ ] Existing mobile features are inventoried.
* [ ] Backend routes and services are inventoried.
* [ ] Database schema and migration practices are reviewed.
* [ ] The React web application's current state is established.

### Development environment

* [ ] The backend startup process has been tested.
* [ ] Database connectivity has been checked.
* [ ] The Flutter application startup process has been tested.
* [ ] Existing failures are documented rather than hidden.
* [ ] Setup instructions are updated where necessary.

### Critical workflow assessment

* [ ] Authentication behavior has been inspected.
* [ ] Backend role enforcement has been inspected.
* [ ] Cart and checkout behavior have been inspected.
* [ ] Duplicate-order protection has been inspected.
* [ ] Order status transitions have been inspected.
* [ ] Inventory updates have been inspected.
* [ ] Critical workflow tests have been run where available.

### Backlog refinement

* [ ] Verified features are marked Implemented.
* [ ] Incomplete features are marked Partially Implemented.
* [ ] Confirmed absent features are marked Missing.
* [ ] Unverified features remain marked Needs Verification.
* [ ] Confirmed defects are added to the backlog.
* [ ] Important business decisions are listed.
* [ ] Candidate items for Sprint 2 are selected.

---

## 4. Sprint Schedule

The schedule below is a suggested sequence for a one-week sprint. It can be adapted to the team's actual working days.

| Day   | Main Focus                    | Planned Activities                                                                                                          | Expected Output                             |
| ----- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Day 1 | Project orientation           | Check Git status and branch, inspect the repository structure, verify existing documentation, and review the setup process. | Repository overview and setup checklist     |
| Day 2 | Mobile and backend            | Inspect Flutter screens, backend endpoints, middleware, and authentication.                                                 | Mobile and API inventories                  |
| Day 3 | Database and core workflows   | Inspect schema, migrations, cart, checkout, order processing, and inventory.                                                | Database and workflow assessments           |
| Day 4 | Testing and web readiness     | Run available checks, investigate failures, and assess the backend's suitability for React integration.                     | Test results and web integration assessment |
| Day 5 | Backlog refinement and review | Update statuses, record defects and risks, refine priorities, and select candidate Sprint 2 items.                          | Refined backlog and Sprint Review           |

This is a proposed schedule, not a fixed deadline. Tasks should be reordered if a dependency or serious defect requires earlier attention.

---

## 5. Sprint Deliverables

At the end of the sprint, the team should have:

1. A verified repository and feature inventory.
2. A documented development setup.
3. An assessment of the authentication and authorization workflows.
4. An assessment of cart, checkout, order processing, and inventory.
5. A record of available tests and their results.
6. A web integration assessment.
7. A Product Backlog with more accurate implementation statuses.
8. A prioritized list of confirmed defects and technical risks.
9. A proposed Sprint 2 scope.

These deliverables should reflect actual inspection and testing. An untested feature must not be described as working simply because its code exists.

---

## 6. Definition of Done

A Sprint 1 task is Done when:

* [ ] The required inspection or verification has been performed.
* [ ] Findings are documented clearly.
* [ ] Any relevant test result is recorded.
* [ ] Problems and limitations are reported honestly.
* [ ] The associated backlog status is updated where appropriate.
* [ ] Any necessary documentation changes are complete.

If a feature cannot be verified because the environment is broken or a dependency is unavailable, document the blocker and the evidence gathered. Do not mark the feature Implemented without verification.

---

## 7. Risks and Responses

| Risk                                                 | Possible Impact                                 | Response                                                                       |
| ---------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------ |
| Existing features are undocumented.                  | Duplicate development or incorrect assumptions. | Inspect implementation and trace workflows before planning changes.            |
| Local environment fails to start.                    | Testing is delayed.                             | Record the error, identify the failing dependency, and prioritize the blocker. |
| Database migrations do not match the current schema. | Data integrity or startup problems.             | Review migrations and current schema before changing database state.           |
| The web application requires backend changes.        | Web work may take longer than expected.         | Identify API gaps before committing to web implementation.                     |
| Sprint capacity is overestimated.                    | Tasks remain unfinished.                        | Reduce sprint scope and prioritize the highest-value outcomes.                 |
| Requirements remain unresolved.                      | Incorrect behavior may be implemented.          | Keep affected items blocked until the relevant decision is confirmed.          |

---

## 8. Sprint Review

At the end of Sprint 1, the team should demonstrate the actual results of its assessment.

The review should answer:

1. Which parts of the application currently work?
2. Which features are partially implemented?
3. Which features are confirmed missing?
4. Which bugs prevent core workflows from working?
5. What prevents the React web application from integrating cleanly?
6. Which backlog items should be addressed first in Sprint 2?

The team should use evidence from the repository, application behavior, and test results rather than assumptions.

## 9. Sprint Retrospective

The team should discuss:

* What went well during the assessment?
* What slowed down repository inspection or testing?
* Which documentation was missing or inaccurate?
* Were the effort estimates reasonable?
* What should change in the next sprint?

Record specific improvements for the next sprint.

## 10. Sprint Outcome

**Sprint 1 status:** Planned — work not yet verified as completed.

**Sprint 1 goal:** Establish a reliable understanding of the existing project and prepare a realistic development plan.

**Next step:** Use the verified findings to select and commit to Sprint 2 work. Sprint 2 should focus on the highest-priority confirmed defects or incomplete core workflows rather than automatically rebuilding every P0 item.
