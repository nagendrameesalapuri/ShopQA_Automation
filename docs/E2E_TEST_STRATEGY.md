# End-to-End Test Strategy

The dedicated E2E suite lives under `tests/e2e/` and validates business journeys across multiple page objects.

## Journeys

- `CustomerCheckoutJourney.e2e.spec.js`: product search through checkout review
- `AdminOperationsJourney.e2e.spec.js`: admin dashboard, product management, and duplicate coupon handling
- `AuthenticationJourney.e2e.spec.js`: customer and admin authentication outcomes
- `StorefrontJourney.e2e.spec.js`: catalog search, product details, and order history

## Design Rules

- Keep feature-level assertions in `tests/` and cross-page outcomes in `tests/e2e/`.
- Use `POManager` and page-object methods; do not place raw selectors in E2E specs.
- Reuse stable test data from `testData/`.
- Avoid fixed sleeps and transient toast assertions when a stable page state exists.
- Keep E2E data non-destructive unless the journey explicitly validates creation or checkout behavior.

Run the suite with:

```bash
npm run test:e2e
```
