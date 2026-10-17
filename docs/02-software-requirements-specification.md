# AAU Campus Market

## Software Requirements Specification (SRS)

**Version:** 1.0 — Draft for Review
**Date:** October 17, 2026
**Project:** `haleta-e/aau_campus_market`
**Platforms:** Existing Flutter mobile application and planned React web application
**Status:** Requirements draft; code and database verification pending

---

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements for AAU Campus Market.

It provides a common reference for implementation, testing, and project planning. Each requirement has a unique identifier so it can later be linked to backlog tasks and test cases.

This document describes expected behaviour. It does not claim that every feature is already implemented.

### 1.2 Scope

The system will support undergraduate buyers, approved sellers, approved delivery workers, and administrators across the six supported campus options.

The project retains the existing Flutter application and backend while adding approved improvements and a planned React/TypeScript web application.

### 1.3 Technology Context

The current project is described as using:

* Flutter and Dart for the mobile application.
* Node.js, Express, and TypeScript for the backend.
* PostgreSQL for data storage.
* Drizzle ORM for database access and migrations.
* React and TypeScript for the planned web application.
* Figma for interface design and prototyping.

The exact implementation must be confirmed by inspecting the repository.

### 1.4 Requirement Priorities

* **Must:** Required for the agreed initial release.
* **Should:** Important but may be scheduled after essential workflows.
* **TBD:** A policy or design decision must be approved before the requirement can be finalized.

## 2. Users and Permissions

### 2.1 Buyer

A buyer can:

* Register and authenticate.
* Browse and search products.
* Filter by campus and category.
* Manage a shopping cart.
* Place orders.
* Select pickup or delivery.
* Track order status.
* Submit special requests.
* Review eligible sellers.
* Submit complaints.
* View their own relevant payment records.

### 2.2 Seller

An approved seller can:

* View assigned orders.
* View the item, quantity, and fulfilment information needed for preparation.
* Update authorized preparation checkpoints.
* Set availability.
* Report inventory discrepancies.

Sellers do not control the authoritative stock maintained by the administrator.

### 2.3 Delivery Worker

An approved delivery worker can:

* View assigned deliveries.
* View the pickup and destination information needed for fulfilment.
* Update authorized delivery checkpoints.
* Manage availability.
* View relevant assignment history.

### 2.4 Administrator

An administrator can:

* Approve, reject, activate, deactivate, or suspend seller and delivery-worker roles.
* Manage product listings and authoritative inventory.
* View orders across campuses.
* Monitor assignments and availability.
* Manage promotional discounts.
* Review special requests.
* Monitor payment records and balances.
* Review and resolve complaints.
* View operational reports and audit history.

### 2.5 Authorization Rule

The backend must enforce role-based permissions. Selecting a role in the interface or using a role-specific identifier must not independently grant privileges.

## 3. Functional Requirements

### 3.1 Authentication and Registration

| ID         | Requirement                                                                                                                                      | Priority | Acceptance condition                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | -------------------------------------------------------------------------------- |
| FR-AUTH-01 | Registration collects required student identity, campus, department, year-of-study, contact, and requested-role information.                     | Must     | Required fields and formats are validated.                                       |
| FR-AUTH-02 | Student information is checked against the sample undergraduate dataset.                                                                         | Must     | Invalid or mismatched records cannot register as eligible students.              |
| FR-AUTH-03 | Department and year-of-study consistency is checked against configured programme rules.                                                          | Must     | Inconsistent information is rejected or handled through an approved review path. |
| FR-AUTH-04 | The system provides role-specific entry points for buyers, sellers, delivery workers, and administrators.                                        | Must     | Access depends on backend-confirmed roles.                                       |
| FR-AUTH-05 | Backend endpoints enforce authentication and authorization.                                                                                      | Must     | Unauthorized requests are denied.                                                |
| FR-AUTH-06 | Seller and delivery-worker operational access requires administrator approval.                                                                   | Must     | Pending applicants cannot receive assignments.                                   |
| FR-AUTH-07 | Existing supported authentication, campus selection, session persistence, and routing are preserved where compatible with secure authentication. | Must     | Existing supported login workflows pass regression tests.                        |
| FR-AUTH-08 | Logout and session clearing continue to work correctly.                                                                                          | Must     | Logged-out users cannot access protected resources.                              |
| FR-AUTH-09 | Ordinary registration cannot grant administrator privileges.                                                                                     | Must     | Administrator access requires authorized role assignment.                        |
| FR-AUTH-10 | A secure password-change and recovery flow is provided.                                                                                          | Should   | Credentials are not exposed in logs or responses.                                |

### 3.2 Home and Product Catalog

| ID         | Requirement                                                                                                                 | Priority | Acceptance condition                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------- |
| FR-HOME-01 | Preserve the personalized greeting, campus indicator, category shortcuts, featured products, and search entry.              | Must     | The home screen displays available account and catalog information.   |
| FR-HOME-02 | Show the discount banner only when an applicable active campaign exists.                                                    | Must     | Expired campaigns are not shown as active promotions.                 |
| FR-HOME-03 | Preserve pull-to-refresh and provide feedback when refreshing fails.                                                        | Should   | Refresh reloads available data without crashing the screen.           |
| FR-CAT-01  | Display the product catalog, including existing local seed and live data sources where still required.                      | Must     | Duplicate products and source failures are handled appropriately.     |
| FR-CAT-02  | Support campus filtering, a default own-campus view, and an explicit all-campus option.                                     | Must     | Results reflect the selected scope.                                   |
| FR-CAT-03  | Support category filters and text search.                                                                                   | Must     | Results match the selected filters and query.                         |
| FR-CAT-04  | Display product details, images or fallbacks, price, stock status, campus availability, and relevant provider information.  | Must     | Missing optional data does not break the page.                        |
| FR-CAT-05  | Prevent purchases of out-of-stock products or quantities exceeding available stock.                                         | Must     | The server rejects invalid purchase quantities.                       |
| FR-CAT-06  | Allow administrators to create, edit, and remove product listings.                                                          | Must     | Only authorized administrators can make changes.                      |
| FR-CAT-07  | Maintain authoritative inventory under administrator control and update stock according to approved order-processing rules. | Must     | Inventory remains consistent with orders and cannot be oversold.      |
| FR-CAT-08  | Allow sellers to report suspected stock errors for administrator review.                                                    | Should   | A correction request records the product, reason, reporter, and time. |

### 3.3 Cart and Checkout

| ID          | Requirement                                                                                                               | Priority | Acceptance condition                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------ |
| FR-CART-01  | Support adding items, removing items, changing quantities, clearing the cart, and retaining seller notes where supported. | Must     | Cart totals and notes update correctly.                                        |
| FR-CART-02  | Preserve the existing mobile cart persistence behaviour using Hive unless an approved design change is required.          | Must     | The cart survives app restart and is isolated between users.                   |
| FR-CART-03  | Revalidate stock, prices, and discounts on the server during checkout.                                                    | Must     | A stale cart cannot bypass current prices or stock limits.                     |
| FR-CART-04  | Show subtotal, discount, fulfilment fee, and final total.                                                                 | Must     | Displayed totals match the server calculation.                                 |
| FR-ORDER-01 | Support delivery and in-person pickup/handover. The currently described fee is 20 ETB for delivery and free pickup.       | Must     | The selected fulfilment option and fee are recorded.                           |
| FR-ORDER-02 | Collect the campus and required building, block, location, or approved handover point.                                    | Must     | Required location information is present before submission.                    |
| FR-ORDER-03 | Save order items, quantities, prices, discounts, fulfilment choice, location, payment arrangement, and timestamps.        | Must     | The order can be retrieved with consistent totals.                             |
| FR-ORDER-04 | Prevent duplicate order creation and duplicate stock deductions on repeated submissions.                                  | Must     | Retrying the same submission does not create another order.                    |
| FR-ORDER-05 | Display the buyer's order history and order details.                                                                      | Must     | Buyers cannot view another buyer's private orders.                             |
| FR-ORDER-06 | Record authorized order-status transitions with actor and timestamp.                                                      | Must     | Invalid transitions are rejected and valid transitions are traceable.          |
| FR-ORDER-07 | Support delivery checkpoints appropriate to the workflow.                                                                 | Must     | The applicable timeline is visible and chronological.                          |
| FR-ORDER-08 | Support pickup checkpoints without requiring a delivery worker when one is not needed.                                    | Must     | Pickup follows its own valid workflow.                                         |
| FR-ORDER-09 | Preserve the existing delivery receipt-confirmation feature.                                                              | Must     | Only the authorized buyer can confirm receipt.                                 |
| FR-ORDER-10 | Flag overdue or missing fulfilment checkpoints for administrator attention.                                               | Should   | The flag identifies the overdue stage without silently completing the order.   |
| FR-ORDER-11 | Implement cancellation only after stock restoration and payment/refund rules are approved.                                | TBD      | Cancellation preserves order history and reconciles stock and payment records. |

### 3.4 Seller and Delivery-Worker Workspaces

| ID         | Requirement                                                                                                           | Priority | Acceptance condition                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| FR-ROLE-01 | Sellers can view assigned orders and the item, quantity, location, and assignment information needed for fulfilment.  | Must     | Sellers cannot access unrelated private orders.                                                  |
| FR-ROLE-02 | Sellers can update authorized preparation checkpoints and set availability.                                           | Must     | Unavailable sellers are excluded from new assignments while existing assignments remain visible. |
| FR-ROLE-03 | Delivery workers can view assigned deliveries and necessary pickup, destination, contact, and checkpoint information. | Must     | Workers only access authorized delivery information.                                             |
| FR-ROLE-04 | Delivery workers can update authorized delivery checkpoints and availability.                                         | Must     | Unavailable workers are excluded from new assignments.                                           |
| FR-ROLE-05 | Administrators can approve, reject, activate, deactivate, or suspend seller and delivery-worker roles.                | Must     | Role changes immediately affect access and assignment eligibility.                               |

### 3.5 Assignment and Matching

| ID          | Requirement                                                                                                                                  | Priority | Acceptance condition                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| FR-MATCH-01 | Seller candidates must be approved, active, and eligible for the product, stock, campus, and location.                                       | Must     | Ineligible sellers are never assigned.                                                      |
| FR-MATCH-02 | Delivery candidates must be approved, active, available, and eligible for the pickup, destination, workload, and other approved constraints. | Must     | Ineligible workers are never assigned.                                                      |
| FR-MATCH-03 | Matching must respect applicable campus and dormitory access rules.                                                                          | Must     | A worker prohibited from entering a relevant dormitory is not assigned to that destination. |
| FR-MATCH-04 | If no eligible assignment exists, the system records a pending/no-match result and exposes it to the administrator.                          | Must     | No invalid assignment is fabricated.                                                        |
| FR-MATCH-05 | Support reassignment with a reason and retained history.                                                                                     | Should   | Previous and new assignments are traceable.                                                 |
| FR-MATCH-06 | Define the detailed ranking, scoring, tie-breaking, retry, and reassignment algorithm.                                                       | TBD      | An approved algorithm specification exists before final matching logic is implemented.      |

### 3.6 Payments

| ID        | Requirement                                                                                                               | Priority | Acceptance condition                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| FR-PAY-01 | Support Cash, CBE Birr, and Telebirr as payment methods without direct payment-provider API processing.                   | Must     | The selected method is stored accurately.                                                   |
| FR-PAY-02 | Record the expected amount, amount recorded paid, balance, method, recipient, timestamp, and relevant reference or notes. | Must     | Payment values reconcile with the order/request total.                                      |
| FR-PAY-03 | Distinguish recorded payments from independently verified payments.                                                       | Must     | The system does not claim a transfer was verified without an approved verification process. |
| FR-PAY-04 | Support unpaid, partially paid, paid, disputed, and appropriate refund states.                                            | Must     | Status changes are authorized and retain history.                                           |
| FR-PAY-05 | Allow administrators to monitor payment records, balances, disputes, and refunds.                                         | Must     | Authorized administrators can filter and review records.                                    |
| FR-PAY-06 | Decide whether Pay on Delivery remains a distinct option or represents payment timing for the supported methods.          | TBD      | Checkout wording and tests follow the approved decision.                                    |

### 3.7 Discounts

| ID         | Requirement                                                                                                                                              | Priority | Acceptance condition                                             |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------- |
| FR-DISC-01 | Administrators can create, edit, schedule, activate, and deactivate discount campaigns for holidays, examination periods, and other approved promotions. | Must     | Each campaign records scope, value, start/end times, and status. |
| FR-DISC-02 | Apply discounts only when the campaign is active, in-date, and applicable to the product/order.                                                          | Must     | Expired campaigns do not apply to new orders.                    |
| FR-DISC-03 | Display the discount and final total before order confirmation.                                                                                          | Must     | The calculation matches the server.                              |
| FR-DISC-04 | Define discount stacking, rounding, exclusions, limits, and delivery-fee applicability.                                                                  | TBD      | Approved rules have corresponding tests.                         |

### 3.8 Special Requests

| ID            | Requirement                                                                                                                                 | Priority | Acceptance condition                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------- |
| FR-SPECIAL-01 | Buyers can submit a special request with description, category, quantity, specifications, campus, location, contact information, and notes. | Must     | Each request receives an identifier, owner, timestamp, and status.                 |
| FR-SPECIAL-02 | Support optional reference images/links, brand/model, size/colour, budget, and deadline.                                                    | Should   | Optional fields do not prevent a valid request.                                    |
| FR-SPECIAL-03 | Administrators can review requests and approve, reject, or request clarification.                                                           | Must     | Decisions record actor, time, and relevant notes.                                  |
| FR-SPECIAL-04 | The buyer must approve the final item specifications and price before purchase.                                                             | Must     | The system prevents purchase progression without approval.                         |
| FR-SPECIAL-05 | Record agreed price, actual purchase cost, commitment amount, remaining amount, delivery cost, and payment state.                           | Must     | Amounts reconcile and changes are traceable.                                       |
| FR-SPECIAL-06 | Support the schedule of Monday, Wednesday, and Saturday, 6:00 a.m.–3:00 p.m. local time.                                                    | Must     | Requests outside the window are queued or handled according to an approved policy. |
| FR-SPECIAL-07 | Support request review, assignment, price approval, commitment, purchase, final payment, handover, and completion states.                   | Must     | Only authorized and valid state transitions occur.                                 |
| FR-SPECIAL-08 | Define commitment amount, cancellation/refund rules, unavailable-item handling, and unspent-funds rules.                                    | TBD      | An approved policy exists before the corresponding payment workflow is finalized.  |

### 3.9 Reviews and Complaints

| ID         | Requirement                                                                                                                           | Priority | Acceptance condition                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------ |
| FR-REV-01  | Allow eligible buyers to submit seller ratings and text reviews.                                                                      | Should   | Only eligible buyers can review and duplicate rules are enforced.  |
| FR-COMP-01 | Allow buyers to submit complaints linked to relevant orders or special requests.                                                      | Must     | Each complaint has an identifier, category, status, and timestamp. |
| FR-COMP-02 | Support categories such as non-delivery, wrong/missing/damaged item, no-show, payment disagreement, inappropriate conduct, and other. | Must     | Category and description are stored.                               |
| FR-COMP-03 | Administrators can review, resolve, or escalate complaints.                                                                           | Must     | Resolution history includes actor, time, outcome, and notes.       |

### 3.10 Administration and Web Application

| ID          | Requirement                                                                                                                    | Priority | Acceptance condition                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------- |
| FR-ADMIN-01 | Preserve the existing dashboard statistics for users, products, orders, and revenue where the underlying data supports them.   | Must     | Metric calculations match source records.                             |
| FR-ADMIN-02 | Administrators can view orders across supported campuses.                                                                      | Must     | Authorized filters return the expected records.                       |
| FR-ADMIN-03 | Administrators manage product listings and authoritative inventory.                                                            | Must     | Changes are permission-checked and reflected in clients.              |
| FR-ADMIN-04 | Administrators manage role approvals, assignments, special requests, complaints, discounts, and payment records.               | Must     | Consequential actions are recorded.                                   |
| FR-ADMIN-05 | Provide operational reports for campus activity, orders, stockouts, fulfilment, special requests, balances, and complaints.    | Should   | Reports define the period and metrics shown.                          |
| FR-ADMIN-06 | Maintain audit history for privileged changes and material order, assignment, payment, and complaint transitions.              | Must     | Authorized reviewers can identify the actor, time, and action.        |
| FR-NOTIF-01 | Notify relevant users about assignments and important status changes through an agreed channel.                                | Should   | Updates reach the correct recipients; channel selection remains open. |
| FR-WEB-01   | Provide responsive React/TypeScript web workflows for prioritized buyer, seller, delivery-worker, and administrator functions. | Must     | Core workflows work at agreed desktop and mobile-browser widths.      |
| FR-WEB-02   | Use the shared backend and the same authorization/business rules as the mobile application.                                    | Must     | Unauthorized API requests are denied regardless of client.            |
| FR-WEB-03   | Implement approved Figma workflows, reusable components, and design tokens.                                                    | Should   | Screens match approved designs or documented deviations.              |

## 4. Business Rules

| ID    | Rule                                                                                                                 |
| ----- | -------------------------------------------------------------------------------------------------------------------- |
| BR-01 | The first release targets undergraduates represented in the sample student dataset.                                  |
| BR-02 | A role suffix or client-side role choice never independently grants privileges.                                      |
| BR-03 | Seller and delivery-worker operational access requires administrator approval.                                       |
| BR-04 | The administrator controls authoritative inventory; stock changes according to the approved order-processing policy. |
| BR-05 | The backend revalidates stock, price, and discounts during checkout.                                                 |
| BR-06 | Pickup is currently described as free; delivery is currently described as 20 ETB.                                    |
| BR-07 | Matching must not violate applicable campus or dormitory access restrictions.                                        |
| BR-08 | Sensitive access-rule data must be necessary, protected, and access-limited.                                         |
| BR-09 | The application does not claim external payment verification without an approved verification process.               |
| BR-10 | The buyer must approve the final special-request item and price before purchase.                                     |
| BR-11 | Special requests are scheduled Monday, Wednesday, and Saturday, 6:00 a.m.–3:00 p.m. local time.                      |
| BR-12 | Discounts apply only within their active period and eligible scope.                                                  |
| BR-13 | The campus shop operates independently and is coordinated with manually.                                             |
| BR-14 | Matching must respect approval, availability, stock, location, and access constraints.                               |

## 5. Non-Functional Requirements

| ID           | Area            | Requirement                                                                                                                          |
| ------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| NFR-SEC-01   | Security        | Authenticate protected API requests and authorize each action using current roles and account status.                                |
| NFR-SEC-02   | Security        | Store passwords using an appropriate modern password-hashing mechanism.                                                              |
| NFR-SEC-03   | Security        | Do not expose passwords, secrets, or tokens in logs, responses, or client bundles.                                                   |
| NFR-PRIV-01  | Privacy         | Minimize personal data and restrict contact/location visibility to authorized users with a legitimate need.                          |
| NFR-AUD-01   | Auditability    | Record actor, timestamp, action, and relevant reference for privileged and material workflow changes.                                |
| NFR-REL-01   | Reliability     | Use transaction-safe inventory handling to prevent overselling during concurrent checkout.                                           |
| NFR-REL-02   | Reliability     | Prevent duplicate orders and duplicate stock deductions when requests are retried.                                                   |
| NFR-REL-03   | Reliability     | Failures in images, notifications, or optional catalog sources must not crash core workflows.                                        |
| NFR-PERF-01  | Performance     | Target common catalog, order-history, and dashboard views under three seconds on an agreed test dataset; validate by measurement.    |
| NFR-UX-01    | Usability       | Provide clear labels, validation, useful error messages, and recoverable form handling.                                              |
| NFR-A11Y-01  | Accessibility   | The web application should support keyboard navigation, visible focus, readable contrast, meaningful labels, and responsive layouts. |
| NFR-COMP-01  | Compatibility   | Web development must not break supported Flutter workflows or shared API contracts without a documented migration.                   |
| NFR-MAINT-01 | Maintainability | Enforce core business rules in the backend rather than relying only on client-side validation.                                       |
| NFR-MAINT-02 | Maintainability | Inspect existing schema and migrations before introducing database changes.                                                          |
| NFR-TEST-01  | Testability     | Test authorization, checkout, inventory concurrency, matching, discounts, special-request approval, and payment reconciliation.      |
| NFR-REC-01   | Recoverability  | Document and test database backup and restoration before production use.                                                             |
| NFR-OBS-01   | Observability   | Log useful operational failures without logging secrets or unnecessary sensitive information.                                        |

## 6. Logical Data Requirements

The following are conceptual entities, not claims about the current database schema.

| Entity                  | Purpose                                                               |
| ----------------------- | --------------------------------------------------------------------- |
| SampleStudent           | Sample undergraduate identity and eligibility information.            |
| User / UserRole         | Account identity, credential reference, role grants, and role status. |
| Campus / Location       | Campus, building/block, handover points, and access restrictions.     |
| Product / Inventory     | Product details, provider, campus, price, quantity, and status.       |
| DiscountCampaign        | Promotional scope, value, start/end time, and status.                 |
| Cart / CartItem         | User cart, products, quantities, and seller notes.                    |
| Order / OrderItem       | Buyer, product snapshots, quantity, totals, fulfilment, and location. |
| Assignment / OrderEvent | Assignments, status transitions, actors, and timestamps.              |
| Availability            | Role-holder availability state and history.                           |
| SpecialRequest          | Specifications, buyer approval, assignments, costs, and status.       |
| PaymentRecord           | Expected amount, paid amount, balance, method, recipient, and status. |
| Review / Complaint      | Ratings, review text, complaint details, and resolution.              |
| Notification / AuditLog | User notifications and privileged action history.                     |

## 7. Interfaces

### 7.1 Mobile Application

The existing Flutter application should retain its supported home, catalog, cart, checkout, order, seller, profile, and administration workflows.

### 7.2 Web Application

The planned React application will provide responsive role-specific interfaces and use the shared backend.

### 7.3 External Payment Methods

Cash, CBE Birr, and Telebirr transfers occur outside the application in the initial release. The system records operational payment information but does not directly process these transfers.

### 7.4 Student Validation

Registration uses a sample undergraduate dataset. The interface must not imply that it verifies students against live AAU records.

## 8. Acceptance Criteria for the Initial Release

The release should not be considered ready until:

1. Existing supported Flutter workflows pass regression tests.
2. Buyers can complete a valid regular order.
3. Invalid quantities and stale stock cannot bypass backend validation.
4. Repeated checkout requests do not create duplicate orders.
5. Role permissions are enforced by the backend.
6. Assignment logic respects availability and campus access restrictions.
7. No-match situations remain visible and can be handled by an administrator.
8. Special-request purchases require buyer approval of the final price and specifications.
9. Discount campaigns apply only according to their approved dates and eligibility rules.
10. Payment records reconcile with order totals and clearly distinguish recorded from verified payment.
11. Complaints can be reviewed and resolved without deleting transaction history.
12. The web application uses the same backend security and business rules as mobile.

## 9. Open Decisions

The following remain unresolved:

* Whether Pay on Delivery is a separate option or payment timing.
* Stock reservation, deduction, expiry, and restoration rules.
* Regular-order cancellation and refund policy.
* Special-request commitment amount and refund policy.
* Discount stacking, rounding, exclusions, and delivery-fee rules.
* Whether the delivery fee is configurable and whether it is per order.
* Regular delivery operating days and exceptions to the 2:00 p.m. cutoff.
* Matching ranking, workload weighting, retry, and reassignment rules.
* Confirmed campus access rules and approved handover points.
* Payment recording authority, evidence, reconciliation, and refund approval.
* Notification channels, performance targets, deployment, backup, and retention policies.
* Exact sample-dataset registration and duplicate-identity rules.

## 10. Change Control

Changes affecting permissions, payments, matching, existing mobile behaviour, or the database should record the requirement ID, reason, impact, and approval.

The product backlog should link implementation tasks and tests to the relevant requirement IDs.
