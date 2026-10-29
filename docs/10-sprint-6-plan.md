# AAU Campus Market — Sprint 6 Plan
## Checkout and Backend Order Creation

**Status:** Planned; depends on Sprints 4 and 5  
**Goal:** Let a signed-in buyer review a cart, choose a supported fulfillment/payment option, create an order through the real backend, and receive an accurate confirmation.

### Preconditions
Inspect the real order route, schemas, response IDs, stock/price rules, supported fulfillment types, payment methods, and existing Flutter checkout. Do not assume endpoint fields or response formats.

### Tasks
- **S6-01 API contract:** Verify the actual order creation API, validation, error shape, price calculation, stock checks, and status lifecycle.
- **S6-02 Review:** Display cart items, quantities, subtotals, and total; allow return to cart.
- **S6-03 Fulfillment:** Offer only supported pickup/delivery choices. The documented delivery fee is currently 20 ETB and pickup is free, but verify the authoritative configured fee and do not hardcode it if the backend provides it.
- **S6-04 Payment:** Show only supported methods—documented as Cash, CBE Birr, Telebirr, and Pay on Delivery—after verifying current behavior. Do not claim electronic payment is complete without a real integration.
- **S6-05 Submit order:** Send the actual API request with authenticated session; prevent duplicate submission; use the backend-generated order ID; never show success after failure.
- **S6-06 Confirmation/recovery:** Show returned order details. Preserve the cart on failure and clear it only after confirmed success, following the actual contract.
- **S6-07 Tests/docs:** Cover success, validation, network/server failure, stock change, and duplicate clicks. Run configured checks.

### Acceptance criteria
- [ ] Checkout shows an accurate cart review.
- [ ] Fulfillment/payment choices match supported behavior.
- [ ] Request follows the real API contract.
- [ ] Backend remains authoritative for price, stock, and order creation.
- [ ] Successful confirmation uses the real backend order ID.
- [ ] Failed submission never appears successful.
- [ ] Cart clears only after confirmed success.
- [ ] Tests/build results are recorded.

### Out of scope
Payment gateway integration, delivery-worker assignment/tracking, refunds/payout automation, and rebuilding existing backend order logic.

### Definition of done
The buyer can create a real backend order and see trustworthy confirmation; failures are handled safely.

### Suggested separate commits
- `feat(web-checkout): add order review and fulfillment selection`
- `feat(web-orders): submit orders through the backend API`
- `test(web-checkout): cover order submission and failure states`
- `docs(sprint): record Sprint 6 results`
