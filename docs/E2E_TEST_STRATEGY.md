# End-to-End Test Strategy

The dedicated E2E suite lives under `tests/e2e/` and validates business journeys across multiple page objects.

Additional regression coverage lives under `tests/regression/` for supported option combinations and boundary behavior.

## Folder Structure

```text
tests/
	feature/       Feature-level functional tests
	regression/    Dedicated regression and edge-case tests
	e2e/           Cross-page business journeys
```

Smoke and sanity are tags applied to feature tests. They are intentionally not separate copies of the same files, so one test can participate in both release tiers when appropriate.

## Journeys

- `CustomerCheckoutJourney.e2e.spec.js`: product search through checkout review
- `AdminOperationsJourney.e2e.spec.js`: admin dashboard, product management, and duplicate coupon handling
- `AuthenticationJourney.e2e.spec.js`: customer and admin authentication outcomes
- `StorefrontJourney.e2e.spec.js`: catalog search, product details, and order history
- `../tests/regression/CheckoutDeliveryOptions.spec.js`: Standard, Express, Overnight, and Pickup delivery paths

## Design Rules

- Keep feature-level assertions in `tests/` and cross-page outcomes in `tests/e2e/`.
- Use `POManager` and page-object methods; do not place raw selectors in E2E specs.
- Reuse stable test data from `testData/`.
- Avoid fixed sleeps and transient toast assertions when a stable page state exists.
- Keep E2E data non-destructive unless the journey explicitly validates creation or checkout behavior.

## Test Tags

- `@smoke`: fast critical checks for core storefront and authentication availability
- `@sanity`: focused happy-path checks for a release candidate
- `@regression`: negative, edge-case, and broader feature coverage
- `@e2e`: cross-page business journeys under `tests/e2e/`

Run each tier with:

```bash
npm run test:smoke
npm run test:sanity
npm run test:regression
npm run test:e2e
```

Run the suite with:

```bash
npm run test:e2e
```
