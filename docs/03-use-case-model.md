# AAU Campus Market

## Use Case Model and Workflow Specification

**Version:** 1.0 — Draft for Review
**Date:** October 17, 2026
**Companion Document:** Software Requirements Specification v1.0

---

## 1. System Boundary

The AAU Campus Market system includes:

* Existing Flutter mobile application.
* Planned React web application.
* Shared backend API.
* Application database.
* Authentication and authorization.
* Inventory, order, assignment, discount, special-request, and payment-record workflows.

The campus shop and external suppliers remain outside the software boundary in the initial release. The administrator coordinates with them manually.

Cash, CBE Birr, and Telebirr transfers occur outside the application. The system records payment information but does not directly process those transfers in the initial release.

## 2. Actors

| Actor                    | Description                                            | Main goals                                                                                                   |
| ------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Buyer                    | Eligible undergraduate student.                        | Browse products, order, track fulfilment, request special items, review sellers, and submit complaints.      |
| Seller                   | Approved student role preparing assigned orders.       | View assignments, prepare products, update checkpoints, manage availability, and report stock discrepancies. |
| Delivery worker          | Approved student role fulfilling delivery assignments. | View assignments, update delivery checkpoints, manage availability, and complete permitted handovers.        |
| Administrator            | Privileged operational user.                           | Manage inventory, roles, discounts, assignments, special requests, payment records, complaints, and reports. |
| Sample student dataset   | Registration validation source.                        | Validate submitted undergraduate identity and academic information.                                          |
| Campus shop              | Independent physical provider.                         | Coordinate fulfilment manually with the administrator.                                                       |
| External supplier        | Potential provider for special requests.               | Supply product availability and price information through a manual process.                                  |
| External payment methods | Cash, CBE Birr, and Telebirr.                          | Transfer funds outside the application.                                                                      |

## 3. Use Case Catalogue

| ID    | Use case                        | Primary actor                         | Expected outcome                                                                                |
| ----- | ------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------- |
| UC-01 | Register undergraduate          | Buyer                                 | Student information is validated and an account is created under the approved role policy.      |
| UC-02 | Authenticate and open workspace | All users                             | The user enters an authorized workspace.                                                        |
| UC-03 | Browse and search catalog       | Buyer                                 | The buyer finds products and checks their availability.                                         |
| UC-04 | Manage cart                     | Buyer                                 | Cart items, quantities, notes, and totals are updated.                                          |
| UC-05 | Place regular order             | Buyer                                 | A valid order is created with consistent totals and fulfilment information.                     |
| UC-06 | Prepare assigned order          | Seller                                | An assigned order progresses through preparation checkpoints.                                   |
| UC-07 | Fulfil delivery                 | Delivery worker                       | An assigned delivery progresses through collection and handover checkpoints.                    |
| UC-08 | Complete pickup handover        | Buyer and seller                      | A pickup order is handed over and completed.                                                    |
| UC-09 | Manage availability             | Seller and delivery worker            | Availability changes affect eligibility for new assignments.                                    |
| UC-10 | Match assignment                | System with administrator oversight   | An eligible seller or delivery worker is assigned, or a no-match result is recorded.            |
| UC-11 | Manage catalog and inventory    | Administrator                         | Product listings and authoritative stock are maintained.                                        |
| UC-12 | Manage discount campaign        | Administrator                         | A promotion is configured and applied according to approved rules.                              |
| UC-13 | Process special request         | Buyer, administrator, worker/provider | A requested item is reviewed, priced, approved, purchased, and handed over according to policy. |
| UC-14 | Record payment                  | Authorized participant                | Payment amount, method, recipient, and status are recorded.                                     |
| UC-15 | Review seller                   | Buyer                                 | An eligible buyer submits a rating and review.                                                  |
| UC-16 | File and resolve complaint      | Buyer and administrator               | A complaint is recorded, reviewed, and resolved or escalated.                                   |
| UC-17 | Monitor operations              | Administrator                         | Operational records and reports are reviewed across campuses.                                   |
| UC-18 | Use web application             | All authorized roles                  | Supported workflows are completed through the responsive web interface.                         |

## 4. Detailed Use Case Narratives

### UC-01: Register Undergraduate

**Primary actor:** Buyer
**Precondition:** The person has the information required for registration.

**Main flow:**

1. The person opens registration.
2. The person provides the required student ID, name, campus, department, year of study, contact information, and requested role.
3. The system validates required fields and formats.
4. The system checks the submitted information against the sample undergraduate dataset.
5. The system checks academic-field consistency against configured programme rules.
6. The account is created according to the registration and role-approval rules.
7. If the person requests seller or delivery-worker access, the request remains pending until administrator approval.

**Alternative flow:**

* If information is invalid or inconsistent, registration is rejected or routed to an explicitly approved review process.
* The sample dataset must not be represented as live verification against AAU's official records.

**Postcondition:** The account and its role status are recorded.

### UC-02: Authenticate and Open Workspace

**Primary actors:** Buyer, seller, delivery worker, administrator.

**Main flow:**

1. The user submits authentication credentials.
2. The backend validates the credentials and account status.
3. The system loads the user's authorized roles.
4. The application opens the appropriate workspace.
5. Backend endpoints continue enforcing permissions for each operation.

**Alternative flow:**

* Invalid credentials are rejected.
* Suspended or unauthorized roles cannot access restricted operations.
* A role suffix or client-side role selection does not independently grant privileges.

**Postcondition:** The user can access only authorized functionality.

### UC-03: Browse and Search Catalog

**Primary actor:** Buyer.

**Main flow:**

1. The buyer opens the home screen or product catalog.
2. The system displays available product information.
3. The buyer selects a campus scope or category.
4. The buyer searches by text or opens a product.
5. The system displays details, price, stock status, and relevant provider information.
6. The buyer may add an eligible product to the cart.

**Alternative flow:**

* Out-of-stock products cannot be purchased.
* Missing images or optional data do not crash the interface.
* Data-loading errors are shown clearly.

**Postcondition:** The buyer can identify eligible products and their displayed availability.

### UC-04: Manage Cart

**Primary actor:** Buyer.

**Main flow:**

1. The buyer adds a product.
2. The buyer changes quantities or adds seller notes where supported.
3. The system updates the displayed subtotal, discounts, and total.
4. The buyer may remove items or clear the cart.
5. The mobile cart retains its existing persistence behaviour.

**Alternative flow:**

* Invalid quantities are rejected.
* The server revalidates current stock, price, and discounts during checkout.

**Postcondition:** The cart reflects the buyer's current selections.

### UC-05: Place Regular Order

**Primary actor:** Buyer.

**Preconditions:**

* The buyer is authenticated.
* The cart contains eligible items.
* Required account and location information is available.

**Main flow:**

1. The buyer reviews the cart.
2. The buyer selects delivery or in-person pickup.
3. The buyer provides the required campus and building, block, location, or approved handover point.
4. The server revalidates stock, product prices, discounts, and applicable fees.
5. The system displays the final price breakdown.
6. The buyer confirms the order.
7. The system creates an order with item and price snapshots.
8. Stock is reserved or adjusted according to the approved inventory policy.
9. The order enters the appropriate fulfilment workflow.
10. The system displays the order confirmation and status.

**Alternative flows:**

* If stock or price changes, the buyer must review the corrected information before confirming.
* If no eligible seller or delivery worker is available, the order remains in a visible pending state for administrator attention.
* Repeated submissions must not create duplicate orders.

**Postcondition:** One traceable order exists with consistent totals, location, ownership, and status.

### UC-06: Prepare Assigned Order

**Primary actor:** Seller.

**Preconditions:**

* The seller is approved and active.
* The order is assigned to the seller.

**Main flow:**

1. The seller opens the assigned-order list.
2. The seller views the item, quantity, and relevant fulfilment information.
3. The seller begins preparation.
4. The seller updates the authorized preparation checkpoint.
5. The seller marks the order ready when appropriate.
6. The system records the status change and timestamp.

**Alternative flow:**

* The seller may report an inventory discrepancy.
* If the seller cannot fulfil the order, the issue is escalated through the approved workflow.
* The seller cannot modify an unrelated order.

**Postcondition:** The order status reflects the latest authorized preparation event.

### UC-07: Fulfil Delivery

**Primary actor:** Delivery worker.

**Preconditions:**

* The delivery worker is approved, active, and eligible.
* The assignment complies with applicable campus access rules.

**Main flow:**

1. The worker views the assigned delivery.
2. The worker reviews the pickup and destination information needed for fulfilment.
3. The worker collects the items.
4. The worker records the collection checkpoint.
5. The worker updates the delivery status as permitted.
6. The worker completes the approved handover.
7. The system records the event and timestamp.

**Alternative flow:**

* If no eligible worker exists, the system records a pending/no-match outcome.
* A worker prohibited from entering a relevant dormitory must not be assigned there.
* An approved handover point may be used only when permitted by the applicable policy.
* Problems are escalated rather than silently bypassing access restrictions.

**Postcondition:** The delivery history reflects the recorded fulfilment events.

### UC-08: Complete Pickup Handover

**Primary actors:** Buyer and seller.

**Preconditions:**

* The order is a pickup order.
* The seller has marked it ready.

**Main flow:**

1. The buyer receives the ready-for-pickup information.
2. The buyer and seller complete the agreed handover.
3. The authorized participant records the appropriate checkpoint.
4. The order is marked completed according to the approved workflow.

**Alternative flow:**

* If the buyer or seller does not arrive, the order remains unresolved and may require administrator attention.

**Postcondition:** The pickup outcome is recorded without requiring delivery-worker steps unless the policy changes.

### UC-09: Manage Availability

**Primary actors:** Seller and delivery worker.

**Main flow:**

1. The user opens their workspace.
2. The user selects an allowed availability state.
3. The system records the state and time.
4. The matching workflow considers the new state for future assignments.
5. Existing assignments remain visible and are handled under the approved reassignment rules.

**Alternative flow:**

* A temporarily unavailable user is excluded from new assignments.
* Administrator suspension or deactivation overrides ordinary availability.

**Postcondition:** Availability and its effect on new assignments are recorded.

### UC-10: Match Assignment

**Primary actor:** System, with administrator oversight.

**Preconditions:**

* An order or request requires an assignment.
* Relevant product, stock, campus, location, and role information exists.

**Main flow:**

1. The system identifies potential candidates.
2. It excludes candidates who are not approved or active.
3. It excludes unavailable or otherwise ineligible candidates.
4. It checks product, stock, campus, location, workload, and applicable access constraints.
5. It selects a candidate according to the approved matching algorithm.
6. It records the assignment and relevant history.
7. It makes the assignment available to the appropriate user.

**Alternative flow:**

* If no eligible candidate remains, the system records a no-match result and exposes it to the administrator.
* The system must not assign an ineligible worker to avoid a pending state.
* Reassignment must retain previous assignment history.

**Postcondition:** A valid assignment or traceable no-match result exists.

**Open design decision:** The ranking score, workload weighting, travel-effort method, tie-breaking, retry schedule, and reassignment rules must be finalized separately.

### UC-11: Manage Catalog and Inventory

**Primary actor:** Administrator.

**Main flow:**

1. The administrator opens product management.
2. The administrator creates, edits, or removes a listing as permitted.
3. The administrator sets the product's campus/provider information and authoritative stock.
4. The system validates the changes.
5. The system records the changes and makes them available to authorized clients.
6. Order processing updates stock according to the approved policy.

**Alternative flow:**

* Sellers may report stock discrepancies.
* Invalid stock or price changes are rejected.
* Privileged changes are retained in audit history.

**Postcondition:** Catalog and inventory reflect authorized changes.

### UC-12: Manage Discount Campaign

**Primary actor:** Administrator.

**Main flow:**

1. The administrator creates a campaign.
2. The administrator specifies the campaign name, scope, discount type/value, start/end times, and status.
3. The system validates the campaign.
4. The campaign is scheduled or activated.
5. Eligible product and checkout views display the promotion.
6. The campaign stops applying to new orders when it expires or is deactivated.

**Alternative flow:**

* Invalid dates or discount values are rejected.
* Existing placed-order price snapshots remain unchanged when a campaign expires.

**Postcondition:** The campaign has an auditable configuration and application period.

### UC-13: Process Special Request

**Primary actors:** Buyer, administrator, assigned worker/provider.

**Preconditions:**

* The buyer is authenticated.
* The request contains sufficient information for review.

**Main flow:**

1. The buyer submits a description, specifications, quantity, and location.
2. The system records the request and initial status.
3. The administrator reviews the request.
4. The request is approved, rejected, or returned for clarification.
5. An eligible worker/provider obtains product availability and a price.
6. The final item specifications and price are presented to the buyer.
7. The buyer approves or declines the proposed purchase.
8. The required commitment amount is handled under the approved payment policy.
9. The purchase proceeds only after the required approval conditions are satisfied.
10. The actual cost, remaining balance, delivery cost, and payment records are updated.
11. The item is handed over and the request is completed.

**Alternative flows:**

* If the item is unavailable, the buyer is informed and the request is handled under the approved unavailable-item policy.
* If the price exceeds the buyer's budget or the buyer declines the quote, the purchase does not proceed.
* Payment disagreements, cancellation, and refund cases are escalated according to the approved policy.

**Postcondition:** The request's decisions, approvals, assignments, costs, payment records, and outcome are traceable.

**Open decision:** The commitment amount, refund rules, cancellation conditions, and treatment of unspent funds remain to be finalized.

### UC-14: Record Payment

**Primary actors:** Authorized buyer, seller, delivery worker, or administrator, depending on the approved payment workflow.

**Preconditions:**

* An order or special request has an expected amount.
* The applicable payment arrangement is defined.

**Main flow:**

1. The transfer takes place outside the application.
2. An authorized participant records the method and amount.
3. The recipient, timestamp, and relevant reference or notes are recorded.
4. The system calculates the remaining balance.
5. The payment status is updated.
6. The administrator can review and reconcile the record.

**Alternative flows:**

* A partial payment leaves a remaining balance.
* A disagreement is recorded as a dispute without deleting prior history.
* A refund is recorded as a separate traceable event.
* The system does not claim independent transfer verification unless an approved verification process supports it.

**Postcondition:** Payment records and status history are retained.

### UC-15: Review Seller

**Primary actor:** Buyer.

**Main flow:**

1. The buyer opens an eligible completed order.
2. The buyer submits a rating and optional text review.
3. The system validates eligibility.
4. The review is stored and associated with the seller and relevant order.

**Alternative flow:**

* An ineligible buyer or invalid duplicate review is rejected according to the approved review policy.

**Postcondition:** An eligible review is stored.

### UC-16: File and Resolve Complaint

**Primary actors:** Buyer and administrator.

**Main flow:**

1. The buyer selects the relevant order or request.
2. The buyer selects a complaint category and provides a description.
3. The system creates a linked complaint record.
4. The administrator reviews the issue.
5. The administrator records a resolution, requests more information, or escalates the case.
6. The system preserves the complaint and resolution history.

**Possible complaint categories:**

* Order not received.
* Wrong, missing, or damaged product.
* Seller or delivery worker did not arrive.
* Payment disagreement.
* Inappropriate conduct.
* Other.

**Postcondition:** The complaint can be tracked independently without deleting the underlying order history.

### UC-17: Monitor Operations

**Primary actor:** Administrator.

The administrator can review cross-campus orders, inventory, assignments, availability, special requests, payment records, balances, discounts, and complaints.

Reports should use defined metrics and date ranges. Administrative changes and important decisions should be auditable.

### UC-18: Use Web Application

**Primary actors:** All authorized roles.

The user accesses the React web application through a supported browser and completes the workflows available to their role.

The web client uses the shared backend. The backend applies the same authorization and business rules used for the Flutter application.

## 5. Relationship and Workflow Rules

1. Placing a regular order includes cart review, location capture, checkout validation, and order creation.
2. Delivery orders use seller and delivery-worker checkpoints as applicable.
3. Pickup orders follow a pickup workflow and do not require delivery-worker steps unless the policy changes.
4. Matching depends on approval, availability, stock, location, workload, and applicable access restrictions.
5. Discount campaigns affect eligible new orders but do not retroactively change placed-order price snapshots.
6. Special-request purchases require buyer approval of the final product and price.
7. Payment records may relate to regular orders or special requests.
8. Complaints are linked to relevant orders or requests and do not replace the original transaction history.
9. All privileged actions require backend authorization.
10. Important status, assignment, payment, and administrative changes should be auditable.

## 6. Role Access Summary

| Capability                     | Buyer                | Seller                     | Delivery worker                | Administrator                   |
| ------------------------------ | -------------------- | -------------------------- | ------------------------------ | ------------------------------- |
| Browse catalog                 | Yes                  | As permitted               | As permitted                   | Yes                             |
| Manage own profile             | Yes                  | Yes                        | Yes                            | Yes                             |
| Place regular order            | Yes                  | If also a buyer            | If also a buyer                | According to policy             |
| View private order details     | Own orders           | Assigned/authorized orders | Assigned/authorized deliveries | Authorized operational access   |
| Update preparation checkpoint  | No                   | Assigned orders            | No                             | Oversight/correction with audit |
| Update delivery checkpoint     | No                   | No                         | Assigned deliveries            | Oversight/correction with audit |
| Change authoritative inventory | No                   | Request correction         | No                             | Yes                             |
| Manage discounts               | No                   | No                         | No                             | Yes                             |
| Approve seller/worker roles    | No                   | No                         | No                             | Yes                             |
| Submit a complaint             | Own eligible orders  | If acting as buyer         | If acting as buyer             | Review/resolve                  |
| View payment records           | Own/relevant records | Relevant assigned records  | Relevant assigned records      | Authorized operational records  |
| Change roles and permissions   | No                   | No                         | No                             | Yes, with audit                 |

## 7. Textual System Context Diagram

```text
                    +---------------------+
                    | Undergraduate Buyer |
                    +----------+----------+
                               |
                               v
+---------+         +----------------------+         +-------------------+
| Seller  | ------> | Flutter Mobile App   | ------> |                   |
+---------+         +----------------------+         |                   |
                                                     | Shared Backend    |
+-----------------+  +----------------------+        | API               |
| Delivery Worker |->| React Web App        |------->|                   |
+-----------------+  +----------------------+        +---------+---------+
                                                               |
+-----------------+                                            v
| Administrator   |--------------------------------->+-------------------+
+-----------------+                                  | PostgreSQL        |
                                                     | Database          |
                                                     +-------------------+

Administrator <------ Manual coordination ------> Independent Campus Shop
Administrator / Worker <---- Manual process ----> External Suppliers

Buyer / Seller / Worker <---- External transfer ----> Cash / CBE Birr / Telebirr
```

## 8. Open Decisions

1. Detailed matching score, workload weighting, travel-effort method, tie-breaking, retry timing, and manual override.
2. Stock reservation/deduction timing and restoration after cancellation or failure.
3. Pay on Delivery wording and payment-timing model.
4. Special-request commitment amount, cancellation/refund rules, unavailable-item handling, and unspent funds.
5. Regular delivery operating days and the 2:00 p.m. cutoff.
6. Confirmed campus/dormitory rules and approved handover points.
7. Notification channels, escalation timings, and availability-review rules.
8. Discount stacking, rounding, exclusions, and delivery-fee rules.

## 9. Preparation for the Product Backlog

Before creating implementation estimates:

1. Inspect the current Flutter screens and state management.
2. Inspect existing backend routes, services, authentication, and authorization.
3. Inspect the existing Drizzle schema and migration history.
4. Test current features and classify each as **Implemented**, **Partial**, **Missing**, or **Needs Verification**.
5. Map each backlog task to an SRS requirement and use case.
6. Estimate only the work that is actually needed.

This prevents duplicate implementation and protects existing functionality.
