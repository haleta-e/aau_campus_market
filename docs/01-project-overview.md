# AAU Campus Market

## Project Overview and Problem Analysis

**Version:** 1.0 — Draft for Review
**Date:** October 17, 2026
**Repository:** `haleta-e/aau_campus_market`
**Project Status:** Existing application undergoing improvement and extension

---

## 1. Introduction

AAU Campus Market is a digital marketplace project intended to help Addis Ababa University (AAU) undergraduate students discover and order everyday products across supported university campuses.

The project builds on an existing Flutter mobile application and backend. The intention is to preserve existing functionality while improving marketplace operations and adding a React-based web application.

The platform is expected to connect student buyers with available products and coordinate order fulfilment through authorized sellers, delivery workers, and administrators. It will also support special product requests, promotional discounts, payment records, complaints, and operational monitoring.

The campus shop will continue to operate independently. Coordination between the administrator and the campus shop will happen manually rather than through a separate campus-shop account in the application.

## 2. The Five Ps

### 2.1 Problem

Students may experience difficulty finding everyday products when nearby shops are far away, closed, or out of stock. Product availability may be difficult to determine without contacting different providers or travelling between locations.

This project aims to improve product discovery, order coordination, and access to pickup or permitted campus delivery.

The extent of the problem and its measurable impact must be validated through student research.

### 2.2 People

The main stakeholders are:

* **Student buyers:** Undergraduate students who browse products and place orders.
* **Student sellers:** Approved students who prepare assigned orders.
* **Delivery workers:** Approved students who fulfil eligible delivery assignments.
* **Administrators:** Users who manage inventory, roles, orders, assignments, discounts, special requests, payment records, and complaints.
* **Campus shop:** An independent physical provider coordinated with manually by the administrator.
* **External suppliers:** Providers who may supply products requested through the special-request workflow.
* **Project team:** Developers responsible for maintaining the existing system and implementing approved improvements.

### 2.3 Product

The product consists of:

1. The existing Flutter mobile application.
2. The existing Node.js, Express, and TypeScript backend.
3. The existing PostgreSQL database and Drizzle ORM configuration.
4. A planned React and TypeScript web application.
5. Figma designs and prototypes for the web application's user experience.

The product will support product browsing, search, cart management, checkout, pickup and delivery, order tracking, special requests, discounts, payment records, reviews, complaints, and administrative operations.

### 2.4 Process

The development process will include:

1. Documenting and validating requirements.
2. Inspecting the existing application and database schema.
3. Designing user workflows and interfaces in Figma.
4. Preparing and prioritizing the product backlog.
5. Implementing improvements incrementally.
6. Testing existing and new functionality.
7. Reviewing results and updating project documentation.

The existing application must be inspected before implementation tasks are estimated.

### 2.5 Project

AAU Campus Market is an ongoing project, not a new system being built from scratch.

The project objective is to improve the existing application, preserve useful functionality, and extend it with approved requirements. Changes must not unnecessarily replace or remove existing features.

## 3. Problem Analysis

### 3.1 Problem Context

Undergraduate students may spend additional time locating products, checking availability, travelling to shops, and coordinating purchases or handovers.

A coordinated digital marketplace could reduce these difficulties by providing product information, stock visibility, ordering, and order-status information through a common system.

This is a preliminary problem hypothesis. Interviews, surveys, or other research are needed before claiming that the problem has a particular frequency or measurable impact.

### 3.2 Preliminary Five Whys

**Why 1: Why might students have difficulty obtaining everyday products?**

Students may not know where a product is available or whether it is currently in stock.

**Why 2: Why might product availability be difficult to determine?**

Information about products and availability may be spread across different providers and communication channels.

**Why 3: Why might this create inconvenience?**

Students may need to contact providers individually or travel to check availability.

**Why 4: Why might ordering and fulfilment remain inconvenient?**

Product discovery, seller coordination, order tracking, pickup, and delivery may be handled separately.

**Why 5: What underlying problem could explain these difficulties?**

There may be no coordinated workflow connecting product availability, ordering, fulfilment, and operational responsibility.

**Important:** These are preliminary hypotheses and must be validated through user research.

### 3.3 Evidence Collection Plan

To validate the problem, the project team should:

* Survey undergraduate students from the supported campuses.
* Ask how frequently students have difficulty finding everyday products.
* Investigate the time and effort required to locate products.
* Identify common stockout and product-discovery problems.
* Ask about preferences for delivery versus in-person pickup.
* Interview sellers and delivery workers about order fulfilment.
* Discuss the campus shop's manual coordination process with the project owner.
* Document the number of participants, questions, findings, and limitations.

No quantitative impact claims should be made until evidence has been collected.

### 3.4 Unified Problem Statement

AAU undergraduate students who need everyday products may spend additional time locating items and coordinating purchases when product availability and fulfilment information is fragmented. A coordinated marketplace is needed to centralize product discovery and order information, support pickup or permitted campus delivery, and provide authorized administrators with visibility into inventory, assignments, special requests, discounts, and issue resolution. The frequency and measurable impact of these difficulties must be validated through student and provider research.

## 4. Project Scope

### 4.1 Included in the Project

* Undergraduate registration and authentication.
* Campus selection.
* Product browsing, search, and filtering.
* Product details and inventory visibility.
* Persistent shopping cart.
* Checkout and order creation.
* Pickup and permitted campus delivery.
* Order tracking and fulfilment checkpoints.
* Seller and delivery-worker workspaces.
* Assignment eligibility and matching.
* Special product requests.
* Administrator-managed promotional discounts.
* Cash, CBE Birr, and Telebirr payment records.
* Reviews and complaints.
* Administrative inventory and user management.
* Responsive React web application.
* Figma-based interface design.
* Security, testing, and documentation improvements.

### 4.2 Outside the Initial Scope

* Direct integration with AAU's official student database.
* Direct payment-processing integration with CBE Birr or Telebirr.
* A separate software account for the campus shop.
* Automated integration with external suppliers.
* A claim that sample student records provide authoritative university identity verification.

## 5. Supported Campuses

The application will support the following campus options:

1. 4 Kilo
2. 5 Kilo
3. 6 Kilo
4. Ledeta
5. Mexico
6. Sefer Selam

## 6. Key Operational Rules

### 6.1 Student Eligibility

The first version is intended for undergraduate students represented in a sample student database. Registration should validate the submitted student information against that dataset.

This does not constitute live verification against AAU's official student records.

### 6.2 Roles and Permissions

The system will provide role-specific experiences for:

* Buyer
* Seller
* Delivery worker
* Administrator

The backend must determine actual permissions. A role suffix or role selected in the interface must not independently grant privileges.

Seller and delivery-worker operational access requires administrator approval.

### 6.3 Inventory

The administrator is the authoritative controller of physical product inventory.

Stock should update automatically according to the approved order-processing rules. Sellers may report suspected stock errors or request corrections, but they do not need to maintain the authoritative inventory themselves.

### 6.4 Delivery Access Restrictions

Delivery assignments must respect applicable university access rules.

A male delivery worker must not be assigned to a female dormitory where the applicable rules prohibit access. If necessary, the system should use an approved handover point or leave the assignment pending for administrator review.

Any sensitive personal data used to enforce these restrictions must be necessary, protected, and accessible only to authorized users.

### 6.5 Special Requests

Special requests are scheduled for:

* Monday
* Wednesday
* Saturday

**Operating hours:** 6:00 a.m.–3:00 p.m. local time.

The administrator reviews requests, and the buyer must approve the final product specifications and price before the purchase proceeds.

The commitment amount, cancellation rules, and refund policy remain to be finalized.

### 6.6 Payments

The planned external payment methods are:

* Cash
* CBE Birr
* Telebirr

The first version will record payment information without directly processing transfers through payment-provider APIs.

The application must distinguish a payment recorded by a user from a payment independently verified through an approved verification process.

### 6.7 Discounts

The administrator will manage discounts for holidays, examination periods, and other approved promotional periods.

Discounts should have a defined scope, value, start time, end time, and status.

Expired discounts must not apply to new orders.

## 7. Existing Functionality to Preserve

The existing feature inventory includes:

* Authentication and campus selection.
* Home screen and featured products.
* Product catalog, search, and filtering.
* Product details and stock information.
* Persistent shopping cart.
* Checkout and price breakdown.
* Order history and order details.
* Receipt confirmation.
* Seller ratings and complaints.
* Seller profiles and product listings.
* Profile and account settings.
* Administrative dashboard and product management.

These features must be checked against the current codebase before planning implementation work. Existing functionality should not be rebuilt merely because it appears in a requirements document.

## 8. Main Risks and Responses

| Risk                                                 | Proposed response                                                              |
| ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| Existing implementation differs from documentation   | Inspect the application, backend, and database schema before estimating tasks. |
| No suitable seller or delivery worker is available   | Record a pending assignment and notify the administrator.                      |
| Stock changes during checkout                        | Validate and update stock safely on the backend.                               |
| Payment is recorded but not verified                 | Clearly distinguish recorded payment from verified payment.                    |
| Sensitive location or contact information is exposed | Minimize data collection and restrict access by role.                          |
| Web development breaks the mobile application        | Reuse the backend carefully and run regression tests.                          |
| Problem impact has not been measured                 | Conduct student and provider research before making numerical claims.          |

## 9. Open Decisions

The following decisions remain unresolved:

1. Whether Pay on Delivery remains a distinct option or represents payment timing for the supported payment methods.
2. When inventory is reserved or deducted and how stock is restored after cancellation.
3. The special-request commitment amount and refund policy.
4. The detailed matching algorithm and reassignment rules.
5. Regular delivery operating days and exceptions to the 2:00 p.m. cutoff.
6. Confirmed campus access rules and approved handover points.
7. Whether discounts can be combined and how rounding and exclusions work.
8. Notification channels and operational escalation times.
9. Payment reconciliation and refund-approval procedures.

These questions should be resolved before the related workflows are finalized.

## 10. Relationship to Other Project Documents

* **Project Overview:** Explains the problem, people, product, process, and project scope.
* **Software Requirements Specification:** Defines detailed, testable requirements.
* **Use Case Model:** Describes actors, system interactions, and workflows.
* **Product Backlog and Roadmap:** Converts approved requirements into prioritized implementation tasks after inspecting the existing codebase.
