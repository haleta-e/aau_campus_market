# AAU Campus Market — Sprint 2: Feature Development

Act as a senior software engineer and Scrum technical lead. We have completed Sprint 1 and are now beginning Sprint 2.

## 1. Project Context

AAU Campus Market is a marketplace for Addis Ababa University students.

Our existing project includes:

* Flutter mobile application.
* Node.js/Express backend.
* PostgreSQL database.
* Existing application features and project documentation.
* A planned React + TypeScript + Vite web application.

Our goal is to develop a reliable, usable marketplace while preserving existing functionality.

## 2. First: Review Sprint 1 Results

Before writing code, inspect the current repository and read:

* `docs/04-product-backlog-and-roadmap.md`
* `docs/05-sprint-1-plan.md`
* Any Sprint 1 assessment report created.
* Any updated requirements or technical documentation.

Check the current Git branch and `git status`. Protect all existing changes.

Identify:

1. What Sprint 1 completed.
2. What the existing code already implements.
3. Which problems or blockers remain.
4. Which Product Backlog Item was recommended for Sprint 2.

Do not repeat Sprint 1's entire inspection process.

## 3. Sprint 2 Goal

Implement and test a valuable, user-visible improvement to AAU Campus Market.

Use the Sprint 1 findings and the Product Backlog to select the highest-priority feature that can reasonably be completed within this sprint.

**Prefer completing one feature properly over starting several features and leaving them unfinished.**

If Sprint 1 already identified a recommended feature, use it unless the findings reveal a blocker or a more important dependency.

If no feature was selected, propose the best candidate from the existing backlog and explain why before making substantial changes.

## 4. Implementation Requirements

For the selected Product Backlog Item:

1. Preserve its existing backlog ID.
2. Confirm its requirements and acceptance criteria.
3. Identify the relevant Flutter, backend, database, or web files.
4. Explain the implementation approach briefly.
5. Implement the feature using the existing project architecture.
6. Add or update database migrations only when necessary.
7. Apply appropriate validation and authorization.
8. Handle loading states, errors, and edge cases where applicable.
9. Add or update relevant automated tests.
10. Run the available tests and report their actual results.
11. Update the backlog status based on verified progress.

Do not rebuild existing functionality or introduce unnecessary dependencies.

Do not change unrelated files or discard existing work. Ask for approval before substantial architecture changes, destructive database operations, or changes that could break existing functionality.

## 5. Definition of Done

The selected feature is complete when:

* Its agreed acceptance criteria are satisfied.
* The implementation integrates with the existing application.
* Appropriate validation and authorization are enforced.
* Relevant tests pass, or remaining failures are clearly documented.
* Existing functionality has not been unnecessarily broken.
* Documentation and backlog statuses reflect the actual result.
* The feature can be demonstrated.

If the feature is too large for one sprint, divide it into smaller deliverable tasks and clearly identify what will be completed in Sprint 2.

## 6. How to Work With Me

I am a third-year Computer Science student. Help me understand the code and engineering decisions rather than generating unexplained changes.

Work incrementally:

* Tell me which feature we are implementing.
* Explain which files need changes and why.
* Implement the feature in manageable steps.
* Explain important logic.
* Test the implementation.
* Report the completed work and remaining tasks.

Avoid long explanations unrelated to the current feature.

## Final Deliverables

At the end of Sprint 2, report:

1. The feature implemented.
2. The Product Backlog Item ID.
3. Files created or modified.
4. How the feature works.
5. Tests executed and their actual results.
6. Acceptance criteria satisfied or still incomplete.
7. Any known issues.
8. The recommended next backlog item.

Begin by reviewing the Sprint 1 results and identifying the selected feature. Then proceed with implementation.
