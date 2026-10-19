# AAU Campus Market — Product Backlog and Development Roadmap

**Version:** 1.0
**Date:** October 17, 2026
**Status:** Draft — Requirements and priorities defined; implementation status requires code verification
**Project:** AAU Campus Market

---

## 1. Purpose

This document defines the Product Backlog for AAU Campus Market.

It identifies the product capabilities, user stories, priorities, acceptance criteria, dependencies, and outstanding decisions needed to develop and improve the system.

The project already has a Flutter mobile application and a backend. Therefore, the backlog must account for existing functionality rather than assume the entire system needs to be developed from scratch.

The planned React web application will be added alongside the Flutter application.

### 1.1 Backlog objectives

The backlog aims to:

1. Verify and improve existing functionality.
2. Provide reliable student authentication and role-based access.
3. Support product discovery, shopping, and order management.
4. Manage inventory and product availability.
5. Support campus pickup and delivery.
6. Coordinate special product requests.
7. Record payments and outstanding balances.
8. Support promotions, reviews, and complaints.
9. Provide administrative control and accountability.
10. Introduce a React web interface without replacing Flutter.
11. Improve security, usability, reliability, and maintainability.

---

## 2. Priority Definitions

| Priority      | Meaning                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------- |
| P0 — Critical | Required for a safe, functional initial release or to resolve a release-blocking problem. |
| P1 — High     | Important for the initial release or a core user workflow.                                |
| P2 — Medium   | Valuable functionality that can follow the essential workflows.                           |
| P3 — Low      | Enhancements that can be scheduled after higher-priority requirements.                    |

Priority indicates business importance. It does not automatically determine implementation order because dependencies and existing code may affect sequencing.

## 3. Implementation Status Definitions

| Status                | Meaning                                                                       |
| --------------------- | ----------------------------------------------------------------------------- |
| Implemented           | Verified to work in the existing application.                                 |
| Partially Implemented | Some required behavior exists, but acceptance criteria remain unmet.          |
| Missing               | Confirmed not to exist.                                                       |
| Needs Verification    | The current implementation has not yet been inspected or tested sufficiently. |
| Blocked by Decision   | Implementation depends on an unresolved business rule.                        |

**Important:** Initial backlog items are marked Needs Verification unless their current implementation has been confirmed. Existing features must not be rebuilt without checking the repository first.

---

# 4. Product Backlog

## EPIC 1 — Repository Assessment and Project Foundation

**Goal:** Establish the actual state of the existing system before making significant changes.

### PB-001: Audit the existing application

**Priority:** P0
**Status:** Needs Verification

**User story**

As a developer, I want to understand which features already exist so that I can improve the application without duplicating working functionality.

**Acceptance criteria**

* [ ] The Flutter application structure has been inspected.
* [ ] Backend routes, controllers, services, and middleware have been inspected.
* [ ] The database schema and Drizzle configuration have been inspected.
* [ ] Existing authentication and authorization behavior has been verified.
* [ ] Existing shopping, checkout, and order workflows have been traced.
* [ ] Existing inventory and payment-related behavior has been inspected.
* [ ] Features are classified as Implemented, Partially Implemented, Missing, or Needs Verification.
* [ ] Existing defects and technical risks are documented.
* [ ] No working feature is replaced without a justified reason.

### PB-002: Verify the development environment

**Priority:** P0
**Status:** Needs Verification

**User story**

As a developer, I want the project to run consistently so that development and testing can proceed reliably.

**Acceptance criteria**

* [ ] Required environment variables are documented.
* [ ] The backend can start using the documented procedure.
* [ ] The database connection can be verified.
* [ ] Database migrations can be applied consistently.
* [ ] The Flutter application can be launched.
* [ ] Existing Docker configuration is checked before changes are made.
* [ ] Setup instructions reflect the actual repository structure.

### PB-003: Establish project quality checks

**Priority:** P1
**Status:** Implemented

**User story**

As a developer, I want repeatable quality checks so that changes do not silently break existing functionality.

**Acceptance criteria**

* [ ] Available linting and formatting commands are documented.
* [ ] Available Flutter and backend tests are identified.
* [ ] Critical API workflows have test coverage or documented manual tests.
* [ ] Important regression tests are added where necessary.
* [ ] Build and test failures are documented and addressed according to priority.

---

## EPIC 2 — Authentication and Role Management

**Goal:** Ensure that users can authenticate and access only the functionality permitted for their roles.

### PB-004: Student registration and authentication

**Priority:** P0
**Status:** Needs Verification

**User story**

As an eligible AAU student, I want to register and sign in so that I can use the marketplace.

**Acceptance criteria**

* [ ] Registration validates required fields.
* [ ] Eligibility is checked against the approved initial student dataset.
* [ ] Duplicate accounts are rejected appropriately.
* [ ] Passwords are stored using an appropriate secure password-hashing mechanism.
* [ ] Login rejects invalid credentials.
* [ ] Authentication failures do not expose sensitive information.
* [ ] Authenticated users can access permitted protected endpoints.
* [ ] Registration and login behavior is tested.

**Dependency:** The approved student eligibility and verification rules.

### PB-005: Role-based authorization

**Priority:** P0
**Status:** Needs Verification

**User story**

As a system administrator, I want permissions enforced by the backend so that users cannot gain unauthorized access by changing client-side settings.

**Acceptance criteria**

* [ ] Buyer, seller, delivery worker, and administrator permissions are documented.
* [ ] Protected backend endpoints enforce authorization.
* [ ] Changing a role label in the client does not grant additional privileges.
* [ ] Administrative endpoints are restricted to authorized administrators.
* [ ] Seller and delivery-worker operational access follows the approval rules.
* [ ] Unauthorized requests are rejected.
* [ ] Permission checks are tested.

### PB-006: Seller and delivery-worker approval

**Priority:** P1
**Status:** Needs Verification

**User story**

As an administrator, I want to approve operational roles so that only authorized users can perform seller or delivery-worker activities.

**Acceptance criteria**

* [ ] Operational role requests can be reviewed.
* [ ] An administrator can approve or reject a request.
* [ ] Pending users cannot perform restricted operational activities.
* [ ] Approval status is stored and checked by the backend.
* [ ] Relevant status changes are recorded.

### PB-007: Multiple roles for one student

**Priority:** P1
**Status:** Blocked by Decision

**User story**

As a student who is also a seller or delivery worker, I want to purchase products using buyer functionality without losing my operational permissions.

**Acceptance criteria**

* [ ] A student can access the buyer functionality permitted to their account.
* [ ] Seller or delivery-worker permissions remain subject to authorization rules.
* [ ] Switching between permitted interfaces does not change server-side privileges.
* [ ] Role relationships are represented consistently in the data model.

**Decision required:** Confirm whether the system will use multiple roles per account or a separate role-membership structure.

---

## EPIC 3 — Product Catalogue and Discovery

**Goal:** Enable buyers to discover products that are available through the marketplace.

### PB-008: Browse products

**Priority:** P0
**Status:** Needs Verification

**User story**

As a buyer, I want to browse available products so that I can find items to purchase.

**Acceptance criteria**

* [ ] Product listings display relevant product information.
* [ ] Product details include price and availability.
* [ ] Unavailable products are clearly identified.
* [ ] Only valid and permitted product records are displayed.
* [ ] Product data comes from the appropriate backend source.

### PB-009: Search and filter products

**Priority:** P1
**Status:** Needs Verification

**User story**

As a buyer, I want to search and filter products so that I can find relevant items quickly.

**Acceptance criteria**

* [ ] Buyers can search by supported product information.
* [ ] Available category and location filters work as specified.
* [ ] Empty search results are handled clearly.
* [ ] Invalid filter values are handled safely.
* [ ] Search results reflect current product availability.

### PB-010: Product details and images

**Priority:** P1
**Status:** Needs Verification

**User story**

As a buyer, I want to view detailed product information so that I can make an informed purchase.

**Acceptance criteria**

* [ ] Product details include the information required for purchasing.
* [ ] Product images are displayed when available.
* [ ] Missing or invalid images are handled gracefully.
* [ ] Price and availability are validated again by the backend during ordering.

---

## EPIC 4 — Cart and Checkout

**Goal:** Allow buyers to select products and submit valid orders.

### PB-011: Manage the shopping cart

**Priority:** P0
**Status:** Needs Verification

**User story**

As a buyer, I want to add, remove, and update products in my cart so that I can prepare an order.

**Acceptance criteria**

* [ ] Buyers can add eligible products to the cart.
* [ ] Buyers can update quantities.
* [ ] Buyers can remove products.
* [ ] Invalid quantities are rejected.
* [ ] Cart totals update when cart contents change.
* [ ] Existing Hive-based cart persistence is preserved if it is part of the current implementation.
* [ ] Cart behavior is tested across the supported application lifecycle.

### PB-012: Validate checkout

**Priority:** P0
**Status:** Implemented

**User story**

As a buyer, I want the system to validate my order before submission so that I do not submit an invalid purchase.

**Acceptance criteria**

* [ ] The backend validates product identifiers and quantities.
* [ ] Prices are obtained from trusted server-side product data.
* [ ] Stock availability is checked before order acceptance.
* [ ] Invalid or unavailable items are handled clearly.
* [ ] The order total is calculated by trusted application logic.
* [ ] The buyer can review the order before confirming it.

### PB-013: Prevent duplicate order submissions

**Priority:** P0
**Status:** Needs Verification

**User story**

As a buyer, I want an order submission to be processed safely so that an accidental repeated request does not create duplicate orders.

**Acceptance criteria**

* [ ] Repeated submissions cannot silently create unintended duplicate orders.
* [ ] Appropriate request identifiers or equivalent safeguards are used where necessary.
* [ ] Stock and order updates are handled consistently.
* [ ] The buyer receives a clear success or failure result.

### PB-014: Clear the cart after a successful order

**Priority:** P1
**Status:** Needs Verification

**User story**

As a buyer, I want my cart to be updated after a successful order so that already-submitted items are not left in my active cart unnecessarily.

**Acceptance criteria**

* [ ] Cart clearing occurs only after the order is successfully accepted.
* [ ] Failed order submissions do not incorrectly discard the cart.
* [ ] The cart and order state remain consistent.

---

## EPIC 5 — Order Management

**Goal:** Track orders from submission through fulfillment.

### PB-015: Create and view orders

**Priority:** P0
**Status:** Needs Verification

**User story**

As a buyer, I want to submit an order and view its status so that I know what is happening with my purchase.

**Acceptance criteria**

* [ ] Successful checkout creates a valid order.
* [ ] Orders are associated with the correct buyer.
* [ ] Order items, quantities, prices, and totals are recorded.
* [ ] Buyers can view their own orders.
* [ ] Buyers cannot access another user's private order information.
* [ ] Order status changes follow defined business rules.

### PB-016: Process order status transitions

**Priority:** P0
**Status:** Needs Verification

**User story**

As an administrator, I want orders to follow defined status transitions so that fulfillment can be monitored reliably.

**Acceptance criteria**

* [ ] Valid order statuses are documented.
* [ ] Permitted transitions are defined.
* [ ] Invalid transitions are rejected.
* [ ] Status updates are associated with the responsible actor where appropriate.
* [ ] The buyer can view the current order status.
* [ ] Order history is preserved where required.

**Decision required:** Confirm the final order-status lifecycle and which roles may perform each transition.

### PB-017: Order cancellation and failed fulfillment

**Priority:** P1
**Status:** Blocked by Decision

**User story**

As a buyer or authorized administrator, I want cancellations to follow clear rules so that cancelled orders are handled consistently.

**Acceptance criteria**

* [ ] Cancellation eligibility is defined by order status.
* [ ] Authorized actors can request or perform permitted cancellations.
* [ ] Stock restoration rules are defined and tested.
* [ ] Payment and refund implications are recorded.
* [ ] Cancellation reasons can be recorded where required.
* [ ] The buyer is informed of the outcome.

**Decision required:** Confirm cancellation windows, refund rules, and which actors can cancel each order type.

---

## EPIC 6 — Inventory and Product Administration

**Goal:** Maintain accurate product information and authoritative stock records.

### PB-018: Administrator product management

**Priority:** P0
**Status:** Needs Verification

**User story**

As an administrator, I want to create, update, and deactivate products so that the marketplace catalogue remains accurate.

**Acceptance criteria**

* [ ] Authorized administrators can create products.
* [ ] Product information can be updated.
* [ ] Invalid product data is rejected.
* [ ] Products can be deactivated when necessary.
* [ ] Product-management operations are restricted by backend authorization.
* [ ] Relevant changes are traceable.

### PB-019: Authoritative stock management

**Priority:** P0
**Status:** Needs Verification

**User story**

As an administrator, I want the system to maintain authoritative inventory so that buyers cannot order more stock than is available.

**Acceptance criteria**

* [ ] Each inventory-managed product has a defined stock quantity.
* [ ] Stock is checked before an order is accepted.
* [ ] Stock changes are applied consistently when orders progress through the agreed lifecycle.
* [ ] Concurrent order submissions cannot cause uncontrolled overselling.
* [ ] Stock changes are traceable.
* [ ] Buyers see availability consistent with the latest accepted inventory state.

### PB-020: Seller stock-discrepancy reporting

**Priority:** P1
**Status:** Needs Verification

**User story**

As an authorized seller, I want to report a stock discrepancy so that an administrator can investigate and correct inventory.

**Acceptance criteria**

* [ ] Authorized sellers can submit discrepancy reports.
* [ ] Reports identify the affected product and the reported issue.
* [ ] An administrator can review the report.
* [ ] Only authorized inventory-management operations can change authoritative stock.
* [ ] The outcome of the report is recorded.

---

## EPIC 7 — Campus Pickup and Delivery

**Goal:** Support the agreed pickup and delivery workflows.

### PB-021: Select pickup or delivery

**Priority:** P0
**Status:** Needs Verification

**User story**

As a buyer, I want to choose pickup or delivery so that I can select an available fulfillment method.

**Acceptance criteria**

* [ ] Eligible orders support the permitted fulfillment choices.
* [ ] Pickup does not incur the standard delivery fee.
* [ ] Standard delivery uses the documented 20 ETB fee unless an approved rule changes it.
* [ ] Fulfillment details are associated with the order.
* [ ] The buyer can review the fulfillment method and applicable charge before confirming.

### PB-022: Campus and location selection

**Priority:** P1
**Status:** Needs Verification

**User story**

As a buyer, I want to select my applicable campus and delivery or pickup location so that my order can be fulfilled correctly.

**Acceptance criteria**

* [ ] Supported campus choices include 4 Kilo, 5 Kilo, 6 Kilo, Ledeta, Mexico, and Sefer Selam.
* [ ] Location values are validated.
* [ ] The selected location is stored with the appropriate order or fulfillment record.
* [ ] The interface does not present unsupported locations as confirmed service areas.
* [ ] Location information is available to authorized fulfillment personnel.

### PB-023: Assign a delivery worker

**Priority:** P0
**Status:** Needs Verification

**User story**

As an administrator, I want eligible delivery workers to be assigned to suitable orders so that deliveries can be completed reliably.

**Acceptance criteria**

* [ ] Only approved and eligible delivery workers can receive assignments.
* [ ] The assignment considers the relevant order location and worker availability.
* [ ] Existing workload and applicable access constraints are considered.
* [ ] The assignment and its status are recorded.
* [ ] Assignment failures can be escalated to an administrator.
* [ ] The buyer can see the appropriate fulfillment status.

**Decision required:** Finalize the matching and ranking algorithm before implementing automatic assignment.

### PB-024: Apply delivery-access restrictions

**Priority:** P0
**Status:** Blocked by Decision

**User story**

As a buyer, I want deliveries to follow applicable university access rules so that fulfillment respects campus restrictions.

**Acceptance criteria**

* [ ] Applicable access restrictions are documented with the responsible authority.
* [ ] The assignment process checks relevant restrictions where legally and operationally appropriate.
* [ ] Restricted assignments are prevented.
* [ ] Approved alternative handover points can be used where available.
* [ ] Unresolved cases remain pending or are escalated rather than silently assigned.
* [ ] Sensitive information is collected and exposed only when necessary.

**Decision required:** Confirm the applicable rules, approved handover points, and minimum information required to enforce them.

### PB-025: Delivery-worker order workflow

**Priority:** P1
**Status:** Needs Verification

**User story**

As an approved delivery worker, I want to view and update my assigned deliveries so that I can complete them and report their outcomes.

**Acceptance criteria**

* [ ] Workers can view only the assignments permitted to them.
* [ ] Assignment details include the necessary fulfillment information.
* [ ] Workers can update permitted delivery statuses.
* [ ] Completion or failure is recorded.
* [ ] Unauthorized status transitions are rejected.
* [ ] The buyer and administrator receive the appropriate status information.

### PB-026: Standard delivery operating hours

**Priority:** P2
**Status:** Blocked by Decision

**User story**

As a buyer, I want delivery availability to reflect the actual operating schedule so that I can select a realistic fulfillment option.

**Acceptance criteria**

* [ ] The agreed operating days and hours are documented.
* [ ] Orders and assignments follow the approved schedule.
* [ ] Orders outside the service window are handled according to the agreed policy.
* [ ] The interface displays accurate availability.

**Existing requirement to confirm:** Standard campus deliveries operate during the week until 2:00 p.m. The exact days and exception rules need confirmation.

---

## EPIC 8 — Special Product Requests

**Goal:** Allow buyers to request products that are not handled through the ordinary catalogue workflow.

### PB-027: Submit a special request

**Priority:** P1
**Status:** Needs Verification

**User story**

As a buyer, I want to request a special product so that I can ask the marketplace to coordinate an item that is not readily available.

**Acceptance criteria**

* [ ] Buyers can submit a request containing the required product details.
* [ ] The request is associated with the correct buyer.
* [ ] The request receives a trackable status.
* [ ] The buyer can review the submitted request.
* [ ] Requests are handled according to the approved schedule.

### PB-028: Review and assign special requests

**Priority:** P1
**Status:** Needs Verification

**User story**

As an administrator, I want to review special requests and assign approved requests to eligible workers so that procurement can be coordinated.

**Acceptance criteria**

* [ ] Administrators can review submitted requests.
* [ ] Administrators can accept or reject requests.
* [ ] Accepted requests can be assigned to an eligible worker.
* [ ] Assignment information is recorded.
* [ ] Workers can access the information required for the assigned request.
* [ ] The buyer can see relevant request updates.

### PB-029: Confirm the final product and price

**Priority:** P0
**Status:** Needs Verification

**User story**

As a buyer, I want to approve the final product and price before the purchase is completed so that I am not committed to an unapproved item or amount.

**Acceptance criteria**

* [ ] The worker can communicate the available product and proposed price through the agreed process.
* [ ] The final product details and price are recorded.
* [ ] The buyer must explicitly approve the final offer before purchase.
* [ ] A rejected offer does not proceed as an approved purchase.
* [ ] Changes to the agreed offer require renewed approval.
* [ ] The approved offer can be linked to the request and its payment records.

### PB-030: Record special-request deposits and balances

**Priority:** P1
**Status:** Blocked by Decision

**User story**

As an administrator, I want special-request payments and balances recorded so that the buyer's financial commitments can be tracked.

**Acceptance criteria**

* [ ] The approved commitment amount is recorded.
* [ ] The amount already paid is recorded.
* [ ] The remaining balance is calculated consistently.
* [ ] The final purchase cost and applicable delivery charge are recorded.
* [ ] Payment status is visible to authorized users.
* [ ] Unavailable products, cancellations, and refunds follow the approved policy.

**Decision required:** Confirm the deposit amount or calculation, payment deadline, cancellation rules, and refund handling.

### PB-031: Special-request schedule

**Priority:** P2
**Status:** Needs Verification

**User story**

As a buyer, I want to see when special requests can be fulfilled so that I understand the available schedule.

**Acceptance criteria**

* [ ] The approved request schedule is documented.
* [ ] The initial schedule reflects Monday, Wednesday, and Saturday, 6:00 a.m.–3:00 p.m., subject to confirmation.
* [ ] Requests outside the schedule receive the correct explanation or handling.
* [ ] Administrators can manage exceptions through the approved process.

---

## EPIC 9 — Payment Recording and Reconciliation

**Goal:** Record payments accurately without claiming that manual payment records are automatically verified by a payment provider.

### PB-032: Record supported payment methods

**Priority:** P0
**Status:** Needs Verification

**User story**

As an administrator, I want supported payment methods recorded so that order payments can be tracked.

**Acceptance criteria**

* [ ] Cash, CBE Birr, and Telebirr are represented according to the agreed payment workflow.
* [ ] The payment method is associated with the correct order or request.
* [ ] The expected amount is recorded.
* [ ] The amount recorded as paid is stored.
* [ ] Payment status is represented consistently.
* [ ] Manual records are not presented as independently verified transactions unless verification has actually occurred.

### PB-033: Track outstanding balances

**Priority:** P1
**Status:** Needs Verification

**User story**

As an administrator, I want to view outstanding balances so that I can identify orders requiring further payment.

**Acceptance criteria**

* [ ] Expected amounts and recorded payments are available.
* [ ] Outstanding balances are calculated consistently.
* [ ] Authorized users can view relevant payment information.
* [ ] Payment records include appropriate timestamps and responsible actors.
* [ ] Corrections are traceable.

### PB-034: Clarify Pay on Delivery behavior

**Priority:** P1
**Status:** Blocked by Decision

**User story**

As a buyer, I want to understand when payment is due so that I can choose the correct checkout option.

**Acceptance criteria**

* [ ] Pay on Delivery is either retained as a distinct option or mapped to the agreed payment-timing rules.
* [ ] The interface clearly distinguishes payment method from payment timing.
* [ ] Payment expectations are communicated before order confirmation.
* [ ] Order records reflect the agreed behavior.

**Decision required:** Confirm whether Pay on Delivery remains a separate checkout option and how it relates to cash, CBE Birr, and Telebirr.

**Scope note:** Automated payment-provider integration is not part of the initial version unless explicitly approved later.

---

## EPIC 10 — Promotions and Discounts

**Goal:** Allow administrators to run time-limited promotional campaigns.

### PB-035: Create and manage discount campaigns

**Priority:** P2
**Status:** Needs Verification

**User story**

As an administrator, I want to create discount campaigns so that I can offer promotions during holidays, exam periods, and other approved occasions.

**Acceptance criteria**

* [ ] Authorized administrators can create campaigns.
* [ ] A campaign includes its name, discount rule, applicable products or scope, and active period.
* [ ] Invalid campaign dates or discount values are rejected.
* [ ] Administrators can update or deactivate eligible campaigns.
* [ ] Campaign status is recorded.

### PB-036: Apply valid discounts

**Priority:** P2
**Status:** Needs Verification

**User story**

As a buyer, I want eligible discounts applied correctly so that the displayed price matches the applicable promotion.

**Acceptance criteria**

* [ ] Only eligible active campaigns affect new orders.
* [ ] Expired campaigns do not apply to new orders.
* [ ] Discount calculations are performed using trusted application logic.
* [ ] Buyers can see the applicable discount before confirming an order.
* [ ] The final discount and price are recorded with the order.

**Decisions required:** Confirm whether campaigns can be combined, how rounding works, which products are excluded, and whether delivery charges are discounted.

---

## EPIC 11 — Reviews and Complaints

**Goal:** Give users a controlled way to provide feedback and report problems.

### PB-037: Submit product or service reviews

**Priority:** P2
**Status:** Needs Verification

**User story**

As an eligible buyer, I want to submit a review so that I can share feedback about my experience.

**Acceptance criteria**

* [ ] Review submission follows the agreed eligibility rules.
* [ ] Ratings and text are validated.
* [ ] Users cannot edit or delete reviews belonging to other users.
* [ ] Review information is linked to the appropriate product or transaction.
* [ ] The interface handles empty or invalid submissions.

### PB-038: Submit and manage complaints

**Priority:** P1
**Status:** Needs Verification

**User story**

As a user, I want to report a marketplace problem so that the responsible administrator can investigate it.

**Acceptance criteria**

* [ ] Users can submit complaints through the approved workflow.
* [ ] Complaints are associated with the appropriate user and order when applicable.
* [ ] Administrators can review and update complaint status.
* [ ] Complaint information is restricted to authorized users.
* [ ] Resolution outcomes can be recorded.

---

## EPIC 12 — Administrative Oversight and Auditability

**Goal:** Give administrators the information and controls needed to operate the marketplace responsibly.

### PB-039: Administrative dashboard

**Priority:** P1
**Status:** Needs Verification

**User story**

As an administrator, I want a dashboard showing important marketplace information so that I can monitor operations.

**Acceptance criteria**

* [ ] Authorized administrators can access the dashboard.
* [ ] The dashboard displays the agreed operational information.
* [ ] Information is obtained from appropriate backend sources.
* [ ] Loading, empty, and error states are handled.
* [ ] Unauthorized users cannot access administrative data.

### PB-040: Manage users and operational roles

**Priority:** P1
**Status:** Needs Verification

**User story**

As an administrator, I want to review user accounts and operational roles so that marketplace access can be controlled.

**Acceptance criteria**

* [ ] Authorized administrators can review relevant accounts.
* [ ] Operational role approvals can be managed.
* [ ] Account restrictions follow documented rules.
* [ ] Sensitive information is not unnecessarily exposed.
* [ ] Administrative changes are traceable.

### PB-041: Audit important operations

**Priority:** P1
**Status:** Needs Verification

**User story**

As an administrator, I want important operational changes recorded so that issues can be investigated.

**Acceptance criteria**

* [ ] Important inventory changes can be traced.
* [ ] Order status changes can be traced.
* [ ] Role approvals and restrictions can be traced.
* [ ] Payment-record corrections can be traced.
* [ ] Records contain the necessary actor, action, and timestamp information.
* [ ] Audit information is protected against unauthorized access or alteration.

---

## EPIC 13 — React Web Application

**Goal:** Add a web interface without removing or unnecessarily changing the existing Flutter application.

### PB-042: Inspect and plan the web application

**Priority:** P0
**Status:** Needs Verification

**User story**

As a developer, I want to understand the existing backend API and the web application's current state so that the web interface can reuse existing services.

**Acceptance criteria**

* [ ] Existing API routes and authentication behavior are documented.
* [ ] Existing Flutter functionality is mapped to corresponding web workflows.
* [ ] The need for additional backend endpoints is identified.
* [ ] The existing backend remains the source of truth for business rules and data.
* [ ] The web implementation plan identifies reused functionality and genuine gaps.

### PB-043: Establish the React web foundation

**Priority:** P1
**Status:** Needs Verification

**User story**

As a developer, I want a maintainable React web application so that browser-based marketplace features can be developed independently of Flutter.

**Acceptance criteria**

* [ ] The web application uses the agreed React, TypeScript, and Vite stack.
* [ ] The project structure is documented.
* [ ] Environment-specific API configuration is handled appropriately.
* [ ] The web application can run using documented instructions.
* [ ] Existing mobile and backend workflows remain functional.

### PB-044: Integrate web authentication

**Priority:** P1
**Status:** Needs Verification

**User story**

As a buyer, I want to sign in through the web interface so that I can use the marketplace from a browser.

**Acceptance criteria**

* [ ] The web interface uses the established backend authentication flow.
* [ ] Authentication errors are handled clearly.
* [ ] Protected pages require appropriate authentication.
* [ ] Role-specific functionality follows backend permissions.
* [ ] Session or token handling follows the approved security design.

### PB-045: Implement core shopping on the web

**Priority:** P1
**Status:** Needs Verification

**User story**

As a buyer, I want to browse products and place orders through the web interface so that I can use the marketplace without the mobile application.

**Acceptance criteria**

* [ ] Buyers can browse products.
* [ ] Buyers can view product details.
* [ ] Buyers can manage a cart.
* [ ] Buyers can complete the supported checkout workflow.
* [ ] Buyers can view their own orders.
* [ ] Server-side validation and authorization apply equally to web requests.
* [ ] The web application handles loading, errors, and empty states.

**Dependency:** Existing API assessment and web authentication.

### PB-046: Implement role-specific web interfaces

**Priority:** P2
**Status:** Needs Verification

**User story**

As an authorized marketplace participant, I want to access the web tools relevant to my role so that I can perform my permitted activities through a browser.

**Acceptance criteria**

* [ ] The required role-specific pages are identified.
* [ ] Sellers can access their permitted operations.
* [ ] Delivery workers can access their permitted assignments.
* [ ] Administrators can access authorized administrative workflows.
* [ ] Unauthorized actions are rejected by the backend.
* [ ] Existing mobile functionality remains available.

**Scope decision:** Confirm which seller, delivery-worker, and administrative workflows must be available on the web in the initial release.

---

## EPIC 14 — Security, Privacy, and Reliability

**Goal:** Protect marketplace data and ensure that important workflows behave consistently.

### PB-047: Validate and protect API inputs

**Priority:** P0
**Status:** Needs Verification

**User story**

As a system operator, I want API inputs validated so that malformed or unauthorized requests cannot corrupt application data.

**Acceptance criteria**

* [ ] Request data is validated at the backend.
* [ ] Invalid identifiers, quantities, and amounts are rejected.
* [ ] Authorization checks occur on protected operations.
* [ ] Sensitive implementation details are not exposed in error responses.
* [ ] Validation is tested on critical endpoints.

### PB-048: Protect private user and order data

**Priority:** P0
**Status:** Needs Verification

**User story**

As a user, I want my private information and order history protected so that only authorized people can access it.

**Acceptance criteria**

* [ ] Users can access only the data permitted by their roles.
* [ ] Administrative information is protected.
* [ ] Credentials and secrets are not committed to the repository.
* [ ] Sensitive personal information is collected only when needed.
* [ ] Relevant access-control checks are tested.

### PB-049: Handle concurrent operations safely

**Priority:** P0
**Status:** Needs Verification

**User story**

As a buyer, I want simultaneous order requests to be processed consistently so that inventory and order records remain accurate.

**Acceptance criteria**

* [ ] Concurrent stock changes are handled safely.
* [ ] Orders cannot bypass server-side stock validation.
* [ ] Database transactions are used where required.
* [ ] Failed operations do not leave inconsistent partial updates.
* [ ] Critical concurrent workflows have tests.

### PB-050: Improve error handling and observability

**Priority:** P1
**Status:** Needs Verification

**User story**

As a developer, I want meaningful application errors and operational logs so that failures can be investigated.

**Acceptance criteria**

* [ ] Expected errors produce appropriate responses.
* [ ] Unexpected errors are logged without unnecessarily exposing secrets.
* [ ] The client displays understandable error messages.
* [ ] Important backend failures can be diagnosed.
* [ ] Logs do not unnecessarily expose sensitive personal information.

### PB-051: Accessibility and responsive usability

**Priority:** P2
**Status:** Needs Verification

**User story**

As a user, I want the marketplace to be understandable and usable on supported devices so that I can complete important tasks without unnecessary difficulty.

**Acceptance criteria**

* [ ] Web layouts adapt to supported screen sizes.
* [ ] Important controls have understandable labels.
* [ ] Forms communicate validation errors clearly.
* [ ] Navigation is consistent.
* [ ] Essential workflows are tested on the supported target environments.

---

# 5. Proposed Development Roadmap

The phases below are a proposed sequence, not fixed calendar commitments. Existing functionality may reduce the work required in any phase.

## Phase 1 — Assessment and Stabilization

**Primary focus:** Understand and stabilize the existing project.

* PB-001: Audit the existing application.
* PB-002: Verify the development environment.
* PB-003: Establish project quality checks.
* PB-004: Verify student authentication.
* PB-005: Verify role-based authorization.
* PB-012: Verify checkout validation.
* PB-013: Verify duplicate-order protection.
* PB-019: Verify inventory integrity.
* PB-047: Verify API validation.
* PB-048: Verify privacy and access controls.
* PB-049: Verify transaction consistency.

**Exit criteria:** The current application state is documented, release-blocking issues are identified, and essential existing workflows are tested.

## Phase 2 — Core Marketplace Reliability

**Primary focus:** Ensure that shopping and order fulfillment behave correctly.

* PB-008: Browse products.
* PB-009: Search and filter products.
* PB-011: Manage the shopping cart.
* PB-015: Create and view orders.
* PB-016: Process order status transitions.
* PB-018: Administrator product management.
* PB-021: Select pickup or delivery.
* PB-022: Campus and location selection.
* PB-023: Assign a delivery worker.
* PB-032: Record supported payment methods.

**Exit criteria:** Buyers can complete the agreed core workflow, and orders, stock, fulfillment, and payment records remain consistent.

## Phase 3 — Special Requests and Operational Management

**Primary focus:** Support more complex marketplace operations.

* PB-020: Seller stock-discrepancy reporting.
* PB-024: Delivery-access restrictions.
* PB-025: Delivery-worker order workflow.
* PB-027: Submit a special request.
* PB-028: Review and assign special requests.
* PB-029: Confirm the final product and price.
* PB-030: Record deposits and balances.
* PB-033: Track outstanding balances.
* PB-038: Manage complaints.
* PB-039: Administrative dashboard.
* PB-040: Manage users and operational roles.
* PB-041: Audit important operations.

**Exit criteria:** The approved special-request and fulfillment workflows can be tracked and administered according to the confirmed business rules.

## Phase 4 — Web Application

**Primary focus:** Add the React web interface while preserving the existing mobile application.

* PB-042: Inspect and plan the web application.
* PB-043: Establish the React web foundation.
* PB-044: Integrate web authentication.
* PB-045: Implement core shopping on the web.
* PB-046: Implement the approved role-specific web interfaces.

**Exit criteria:** The agreed web workflows function through the existing backend without bypassing server-side business rules or disrupting the mobile application.

## Phase 5 — Enhancements and Release Readiness

**Primary focus:** Improve the overall product and verify readiness for release.

* PB-010: Improve product details and images.
* PB-014: Verify successful cart clearing.
* PB-017: Finalize cancellation and failed-fulfillment handling.
* PB-026: Finalize delivery operating hours.
* PB-031: Finalize the special-request schedule.
* PB-034: Clarify Pay on Delivery behavior.
* PB-035: Manage discount campaigns.
* PB-036: Apply valid discounts.
* PB-037: Submit reviews.
* PB-050: Improve error handling and observability.
* PB-051: Improve accessibility and responsive usability.

**Exit criteria:** Required business decisions are resolved, agreed acceptance criteria are met, and release-critical tests pass.

---

# 6. Outstanding Business Decisions

These decisions must be finalized before the affected workflows can be considered complete.

| ID   | Decision                                                             | Affected backlog items |
| ---- | -------------------------------------------------------------------- | ---------------------- |
| D-01 | Multiple roles per account versus a separate role-membership model   | PB-005, PB-006, PB-007 |
| D-02 | Exact order statuses and permitted transitions                       | PB-015, PB-016, PB-017 |
| D-03 | Cancellation eligibility, refunds, and stock restoration             | PB-017, PB-019, PB-030 |
| D-04 | Delivery-worker matching and reassignment rules                      | PB-023, PB-024, PB-025 |
| D-05 | Applicable delivery-access rules and approved handover points        | PB-024                 |
| D-06 | Standard delivery days, hours, and exceptions                        | PB-026                 |
| D-07 | Special-request deposit amount and calculation                       | PB-030                 |
| D-08 | Special-request cancellation, unavailable-item, and refund handling  | PB-029, PB-030         |
| D-09 | Whether Pay on Delivery remains a distinct checkout option           | PB-032, PB-034         |
| D-10 | Discount stacking, rounding, exclusions, and delivery-fee treatment  | PB-035, PB-036         |
| D-11 | Which role-specific workflows must be available on the web at launch | PB-046                 |

A decision is not considered complete merely because a possible solution is listed in this document. The relevant rule must be confirmed and recorded.

---

# 7. Definition of Done

A backlog item is considered Done only when its applicable conditions are satisfied.

1. Its acceptance criteria have been met.
2. Existing functionality has not been unintentionally broken.
3. Backend validation and authorization are implemented where required.
4. Relevant tests have passed.
5. Error and edge cases have been handled appropriately.
6. Database changes, if any, are documented and migrated correctly.
7. The feature has been tested in its intended environment.
8. Relevant documentation has been updated.
9. The implementation status has been verified rather than assumed.

Items blocked by unresolved business decisions cannot be marked Done if those decisions affect their required behavior.

---

# 8. Backlog Maintenance

This Product Backlog is expected to change as the existing code is inspected and the requirements are confirmed.

During backlog refinement:

* Mark existing working features as Implemented.
* Mark incomplete features as Partially Implemented.
* Mark confirmed missing features as Missing.
* Keep uninspected features as Needs Verification.
* Add confirmed defects as separate backlog items.
* Split large items into smaller tasks when their implementation becomes clearer.
* Reorder priorities when dependencies or business needs change.
* Record estimates only after sufficient technical investigation.
* Move selected items into a Sprint Backlog when the team commits to a specific sprint.

## Current status

**Product Backlog:** Initial draft created.
**Requirements:** Initial requirements documented.
**Implementation verification:** Pending repository inspection.
**Business decisions:** Listed for confirmation.
**Sprint commitments:** Not yet established.

The next step is to compare this backlog with the actual repository and update the implementation status of each item.
# 9. Product Backlog Summary Table

This table provides a consolidated view of the AAU Campus Market Product Backlog. Each item has a unique ID that can be referenced during backlog refinement, sprint planning, implementation, and review.

**Status note:** All implementation statuses must be verified against the current repository. Items marked "Needs Verification" are not necessarily missing.

| ID     | Epic                     | Product Backlog Item                    | User Story Summary                                                                               | Priority | Initial Status      |
| ------ | ------------------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------ | -------- | ------------------- |
| PB-001 | Project Foundation       | Audit Existing Application              | As a developer, I want to understand existing functionality before changing the code.            | P0       | Needs Verification  |
| PB-002 | Project Foundation       | Verify Development Environment          | As a developer, I want a reliable setup for running the application.                             | P0       | Needs Verification  |
| PB-003 | Project Foundation       | Establish Quality Checks                | As a developer, I want repeatable checks to prevent regressions.                                 | P1       | Needs Verification  |
| PB-004 | Authentication           | Student Registration and Authentication | As an eligible student, I want to register and sign in securely.                                 | P0       | Needs Verification  |
| PB-005 | Authentication           | Role-Based Authorization                | As an administrator, I want backend-enforced permissions.                                        | P0       | Needs Verification  |
| PB-006 | Authentication           | Operational Role Approval               | As an administrator, I want to approve sellers and delivery workers.                             | P1       | Needs Verification  |
| PB-007 | Authentication           | Multiple Roles per Student              | As a student with operational responsibilities, I want to use permitted buyer functionality too. | P1       | Blocked by Decision |
| PB-008 | Product Catalogue        | Browse Products                         | As a buyer, I want to browse available products.                                                 | P0       | Needs Verification  |
| PB-009 | Product Catalogue        | Search and Filter                       | As a buyer, I want to find relevant products quickly.                                            | P1       | Needs Verification  |
| PB-010 | Product Catalogue        | Product Details and Images              | As a buyer, I want sufficient information to make a purchase decision.                           | P1       | Needs Verification  |
| PB-011 | Cart and Checkout        | Manage Shopping Cart                    | As a buyer, I want to add, update, and remove cart items.                                        | P0       | Needs Verification  |
| PB-012 | Cart and Checkout        | Validate Checkout                       | As a buyer, I want my order validated before submission.                                         | P0       | Needs Verification  |
| PB-013 | Cart and Checkout        | Prevent Duplicate Orders                | As a buyer, I want repeated requests not to create unintended duplicate orders.                  | P0       | Needs Verification  |
| PB-014 | Cart and Checkout        | Clear Cart After Successful Order       | As a buyer, I want the cart updated after successful checkout.                                   | P1       | Needs Verification  |
| PB-015 | Order Management         | Create and View Orders                  | As a buyer, I want to submit orders and track them.                                              | P0       | Needs Verification  |
| PB-016 | Order Management         | Order Status Transitions                | As an administrator, I want orders to follow defined status rules.                               | P0       | Needs Verification  |
| PB-017 | Order Management         | Cancellation and Failed Fulfillment     | As a buyer or authorized administrator, I want cancellations handled consistently.               | P1       | Blocked by Decision |
| PB-018 | Inventory                | Administrator Product Management        | As an administrator, I want to maintain the product catalogue.                                   | P0       | Needs Verification  |
| PB-019 | Inventory                | Authoritative Stock Management          | As an administrator, I want accurate stock records and safe stock updates.                       | P0       | Needs Verification  |
| PB-020 | Inventory                | Stock-Discrepancy Reporting             | As a seller, I want to report stock problems for administrator review.                           | P1       | Needs Verification  |
| PB-021 | Pickup and Delivery      | Choose Pickup or Delivery               | As a buyer, I want to select an eligible fulfillment method.                                     | P0       | Needs Verification  |
| PB-022 | Pickup and Delivery      | Campus and Location Selection           | As a buyer, I want to specify the relevant campus and location.                                  | P1       | Needs Verification  |
| PB-023 | Pickup and Delivery      | Assign Delivery Workers                 | As an administrator, I want suitable workers assigned to deliveries.                             | P0       | Needs Verification  |
| PB-024 | Pickup and Delivery      | Delivery-Access Restrictions            | As a buyer, I want fulfillment to respect applicable access rules.                               | P0       | Blocked by Decision |
| PB-025 | Pickup and Delivery      | Delivery-Worker Workflow                | As a delivery worker, I want to view and update my assignments.                                  | P1       | Needs Verification  |
| PB-026 | Pickup and Delivery      | Standard Delivery Schedule              | As a buyer, I want to know when delivery is available.                                           | P2       | Blocked by Decision |
| PB-027 | Special Requests         | Submit Special Request                  | As a buyer, I want to request products outside the ordinary catalogue workflow.                  | P1       | Needs Verification  |
| PB-028 | Special Requests         | Review and Assign Requests              | As an administrator, I want to review and assign special requests.                               | P1       | Needs Verification  |
| PB-029 | Special Requests         | Confirm Final Product and Price         | As a buyer, I want to approve the final offer before purchase.                                   | P0       | Needs Verification  |
| PB-030 | Special Requests         | Record Deposits and Balances            | As an administrator, I want special-request payments and balances tracked.                       | P1       | Blocked by Decision |
| PB-031 | Special Requests         | Special-Request Schedule                | As a buyer, I want to know when special requests can be fulfilled.                               | P2       | Needs Verification  |
| PB-032 | Payments                 | Record Supported Payment Methods        | As an administrator, I want payment records associated with the correct orders.                  | P0       | Needs Verification  |
| PB-033 | Payments                 | Track Outstanding Balances              | As an administrator, I want to identify unpaid amounts.                                          | P1       | Needs Verification  |
| PB-034 | Payments                 | Clarify Pay on Delivery                 | As a buyer, I want clear payment-timing options.                                                 | P1       | Blocked by Decision |
| PB-035 | Promotions               | Manage Discount Campaigns               | As an administrator, I want to create and manage promotions.                                     | P2       | Needs Verification  |
| PB-036 | Promotions               | Apply Valid Discounts                   | As a buyer, I want eligible discounts calculated correctly.                                      | P2       | Needs Verification  |
| PB-037 | Reviews and Complaints   | Submit Reviews                          | As a buyer, I want to provide feedback about my experience.                                      | P2       | Needs Verification  |
| PB-038 | Reviews and Complaints   | Manage Complaints                       | As a user, I want to report problems and receive appropriate handling.                           | P1       | Needs Verification  |
| PB-039 | Administration           | Administrative Dashboard                | As an administrator, I want an overview of marketplace operations.                               | P1       | Needs Verification  |
| PB-040 | Administration           | Manage Users and Roles                  | As an administrator, I want to manage authorized accounts and operational roles.                 | P1       | Needs Verification  |
| PB-041 | Administration           | Audit Important Operations              | As an administrator, I want important changes to be traceable.                                   | P1       | Needs Verification  |
| PB-042 | Web Application          | Assess Web Integration                  | As a developer, I want to understand the API before integrating the web application.             | P0       | Needs Verification  |
| PB-043 | Web Application          | Establish React Foundation              | As a developer, I want a maintainable React and TypeScript application.                          | P1       | Needs Verification  |
| PB-044 | Web Application          | Web Authentication                      | As a buyer, I want to sign in through the web interface.                                         | P1       | Needs Verification  |
| PB-045 | Web Application          | Web Shopping Workflow                   | As a buyer, I want to browse, manage a cart, and order through a browser.                        | P1       | Needs Verification  |
| PB-046 | Web Application          | Role-Specific Web Interfaces            | As an authorized participant, I want browser access to my permitted tools.                       | P2       | Needs Verification  |
| PB-047 | Security and Reliability | API Input Validation                    | As an operator, I want invalid requests rejected safely.                                         | P0       | Needs Verification  |
| PB-048 | Security and Reliability | Protect Private Data                    | As a user, I want my personal and order data protected.                                          | P0       | Needs Verification  |
| PB-049 | Security and Reliability | Handle Concurrent Operations            | As a buyer, I want simultaneous orders to preserve inventory consistency.                        | P0       | Needs Verification  |
| PB-050 | Security and Reliability | Error Handling and Observability        | As a developer, I want failures to be understandable and diagnosable.                            | P1       | Needs Verification  |
| PB-051 | Security and Reliability | Accessibility and Responsive Usability  | As a user, I want the application to be usable on supported devices.                             | P2       | Needs Verification  |

## 9.1 How to Use This Table

* **ID:** A permanent reference for the backlog item.
* **Epic:** The broader product capability to which the item belongs.
* **Product Backlog Item:** A concise description of the work.
* **User Story Summary:** The user need the item addresses.
* **Priority:** Its proposed business importance.
* **Initial Status:** Whether implementation has been verified or a business decision is required.

The initial statuses must be updated as the team inspects the code and tests the workflows.

## 9.2 Backlog Refinement

Before selecting an item for a sprint, the team should:

1. Confirm that the item is still needed.
2. Check whether the functionality already exists.
3. Review its dependencies.
4. Clarify its acceptance criteria.
5. Resolve any blocking business decisions.
6. Estimate the work when sufficient information is available.
7. Confirm that the item is small and clear enough to complete in a sprint.

The Product Backlog is an evolving list. New requirements and defects may be added, and priorities may change as the project develops.
