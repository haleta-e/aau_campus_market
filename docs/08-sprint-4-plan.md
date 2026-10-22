# AAU Campus Market — Sprint 4 Plan

**Sprint:** Sprint 4  
**Sprint Name:** Product Details and Shopping Cart  
**Status:** Planned — Sprint 3 In Progress  
**Project:** AAU Campus Market

## 1. Sprint Goal

Extend the React web application with product details and shopping cart functionality, allowing students to inspect products and prepare an order while preserving the existing Flutter application and backend.

Sprint 4 must build on the actual implementation delivered in Sprint 3. If a required Sprint 3 dependency is incomplete, identify it before beginning dependent work.

## 2. Sprint Objectives

1. Implement a product details view.
2. Allow users to select product quantities within available stock limits.
3. Add products to a persistent shopping cart.
4. Allow users to update quantities and remove products.
5. Display accurate product prices and cart totals.
6. Handle unavailable products and stock changes appropriately.
7. Test the shopping experience and document the results.

## 3. Sprint Backlog

| ID | Task | Description | Priority |
|---|---|---|---|
| S4-01 | Review Sprint 3 deliverables | Verify the catalogue, API integration, and existing web architecture. | High |
| S4-02 | Product details view | Display available product information when a user selects a product. | High |
| S4-03 | Quantity selection | Allow valid quantity selection based on available stock. | High |
| S4-04 | Add to cart | Add selected products to the shopping cart. | High |
| S4-05 | Cart management | Update quantities and remove products. | High |
| S4-06 | Cart persistence | Preserve cart contents across page refreshes using an appropriate storage strategy. | High |
| S4-07 | Cart totals | Calculate subtotal and display relevant price information. | High |
| S4-08 | Testing and documentation | Verify functionality and update project records. | High |

## 4. Functional Requirements

### S4-01: Review Sprint 3 Deliverables

Inspect the actual React implementation, product API service, backend contract, and test results.

**Acceptance criteria:**
- The Sprint 3 implementation is assessed.
- Existing functionality is preserved.
- Dependencies and outstanding blockers are identified.

### S4-02: Product Details View

Allow users to open a product from the catalogue and view its available information.

Display applicable fields such as:
- Product name.
- Description.
- Price.
- Product image.
- Category.
- Campus availability.
- Stock availability.
- Seller information, if supported and appropriate.

Use the actual backend response and existing requirements. Do not invent product data.

**Acceptance criteria:**
- Users can open and close or navigate away from the details view.
- Product information matches the backend.
- Missing optional fields are handled gracefully.
- The view works on desktop and mobile browsers.

### S4-03: Quantity Selection

Allow users to select a product quantity before adding it to the cart.

**Acceptance criteria:**
- Quantities must be valid positive integers.
- Users cannot select more than the available stock.
- Out-of-stock products cannot be added.
- Invalid quantities are rejected with understandable feedback.

### S4-04: Add Products to Cart

Allow users to add available products to their cart.

**Acceptance criteria:**
- Selected products appear in the cart.
- Adding an existing product updates its quantity according to the agreed cart behavior.
- Cart quantities respect the latest known stock limits.
- Failed operations do not falsely indicate success.

### S4-05: Cart Management

Implement a cart page or panel that displays selected products.

Users should be able to:
- Review products.
- Change quantities.
- Remove products.
- See updated subtotals.

**Acceptance criteria:**
- Cart updates are reflected immediately.
- Invalid quantities are rejected.
- Removing a product updates the cart.
- Empty carts display a suitable message.
- Product prices and stock are handled consistently.

### S4-06: Cart Persistence

Preserve cart contents across browser refreshes.

Inspect the existing architecture before choosing storage.

For a guest cart, browser storage may be appropriate. If authenticated server-side carts already exist, evaluate whether they should be used instead.

Do not store authentication secrets or sensitive information in ordinary browser storage.

**Acceptance criteria:**
- The cart survives a page refresh.
- Invalid stored data does not crash the application.
- Storage behavior is documented.
- The design does not prevent future authenticated-cart support.

### S4-07: Cart Totals

Calculate the cart subtotal using valid quantities and product prices.

**Acceptance criteria:**
- Subtotals update when quantities change.
- Removing products updates the total.
- Currency formatting is consistent with the existing marketplace.
- Delivery fees, discounts, and final checkout totals are not misrepresented as finalized when they have not yet been calculated by the appropriate business logic.

The backend must remain authoritative for final prices, stock validation, and order totals during checkout.

### S4-08: Testing and Documentation

Add appropriate tests for:
- Product details.
- Quantity validation.
- Adding and removing products.
- Updating cart quantities.
- Cart persistence.
- Subtotal calculation.
- Out-of-stock behavior.

Run the available frontend checks and production build.

Document actual test results and unresolved issues.

## 5. Dependencies

Sprint 4 depends on:
- A functioning React application.
- Product data retrieved from the existing backend.
- A working product catalogue.
- Reliable product identifiers and price information.
- Existing project requirements governing stock and pricing.

If these dependencies are not satisfied at the start of Sprint 4, revise the scope before implementing dependent features.

## 6. Definition of Done

Sprint 4 is complete when:

- [ ] Product details can be opened from the catalogue.
- [ ] Valid quantities can be selected.
- [ ] Available products can be added to the cart.
- [ ] Cart quantities can be updated.
- [ ] Products can be removed.
- [ ] Cart contents persist across refreshes.
- [ ] Subtotals are accurate.
- [ ] Stock limits are respected.
- [ ] Appropriate tests pass.
- [ ] The production build succeeds.
- [ ] Existing mobile and backend functionality remains intact.
- [ ] Documentation reflects the actual implementation.
- [ ] Changes are reviewed and committed separately by logical unit.

## 7. Scope Boundaries

This sprint focuses on product details and shopping cart functionality.

Unless necessary to complete an existing dependency, it does not include:
- Complete checkout implementation.
- Payment processing.
- Delivery-worker assignment.
- Seller administration.
- Administrator dashboard redevelopment.
- Replacement of the existing backend.
- Rewriting the Flutter application.

These remain part of the broader Product Backlog.

## 8. Sprint Review

Demonstrate:
1. Opening a product from the catalogue.
2. Viewing product details.
3. Selecting a valid quantity.
4. Adding a product to the cart.
5. Updating and removing products.
6. Refreshing the page and confirming cart persistence.
7. Verifying subtotals.
8. Handling unavailable products and invalid quantities.

## 9. Next Sprint Direction

After Sprint 4, review the actual implementation and Product Backlog to select the next sprint.

Potential candidates include:
- Web authentication.
- Checkout and order creation.
- Campus-aware fulfillment selection.
- Integration with existing order management.

The next sprint must follow the project's documented dependencies and business rules.