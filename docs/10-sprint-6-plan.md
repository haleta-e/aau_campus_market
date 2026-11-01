# AAU Campus Market — Sprint 6 Plan
## Checkout and Backend Order Creation

**Status:** Completed & Verified  
**Goal:** Let a signed-in buyer review a cart, choose a supported fulfillment/payment option, create an order through the real backend, and receive an accurate confirmation.

### Preconditions
Inspect the real order route, schemas, response IDs, stock/price rules, supported fulfillment types, payment methods, and existing Flutter checkout. Do not assume endpoint fields or response formats.

### Tasks
- [x] **S6-01 API contract:** Verified actual order creation API (`POST /api/v1/orders`), validation, error shape (`SELLER_MISMATCH`, `INSUFFICIENT_STOCK`), price calculation, stock checks, and payment processing endpoint (`POST /api/v1/payments/process`).
- [x] **S6-02 Review:** Checkout page displays full item list, quantities, unit prices, merchandise subtotal, delivery fee, and grand total; includes back-to-cart navigation.
- [x] **S6-03 Fulfillment:** Implemented campus delivery (+20.00 ETB) with dorm/room location input, and campus pickup (FREE) across 6 AAU campus sites.
- [x] **S6-04 Payment:** Supported payment selection: Cash / Pay on Delivery (`CASH`), Telebirr (`TELEBIRR`), and CBE Birr (`CBE`) matching backend schema enums.
- [x] **S6-05 Submit order:** Order submitted with authenticated JWT session; button disabled during flight (`isSubmitting`) to prevent double-clicks; uses backend-generated order entity and order ID.
- [x] **S6-06 Confirmation/recovery:** `OrderConfirmation` displays confirmed order number, status, payment status, fulfillment location, and total. On failure, cart items remain preserved; cart is cleared only upon confirmed backend response.
- [x] **S6-07 Tests/docs:** Vitest suites for `orderService`, `CheckoutPage`, `OrderConfirmation`, and `App` routing integration. All checks pass.

### Acceptance criteria
- [x] Checkout shows an accurate cart review.
- [x] Fulfillment/payment choices match supported behavior.
- [x] Request follows the real API contract.
- [x] Backend remains authoritative for price, stock, and order creation.
- [x] Successful confirmation uses the real backend order ID.
- [x] Failed submission never appears successful.
- [x] Cart clears only after confirmed success.
- [x] Tests/build results are recorded.

### Verification Outcome
- **Frontend Test Suite:** 75 tests passing across 14 test suites (`npm run test` / `vitest run`).
- **Type Checking:** Passed (`npm run typecheck` / `tsc --noEmit` with 0 errors).
- **Production Build:** Succeeded (`npm run build` / `vite build` generated production bundle with zero warnings).
- **Backend Unit Tests:** 9/9 passed (`npm test -- tests/unit`).

### Out of scope
Payment gateway integration, delivery-worker assignment/tracking, refunds/payout automation, and rebuilding existing backend order logic.

### Definition of done
The buyer can create a real backend order and see trustworthy confirmation; failures are handled safely.

### Suggested separate commits
- `feat(web-checkout): add order review and fulfillment selection`
- `feat(web-orders): submit orders through the backend API`
- `test(web-checkout): cover order submission and failure states`
- `docs(sprint): record Sprint 6 results`
