# ParaBank QA Automation Framework - Contributing

## Development Setup

1. **Install dependencies**: `npm ci`
2. **Install browsers**: `npx playwright install --with-deps`
3. **Type-check**: `npx tsc --noEmit`
4. **Lint**: `npm run lint`

## Project Structure

- **`pages/`** — Page objects contain locators only. All interactions go through these classes.
- **`fixtures/`** — Custom Playwright fixtures (`registeredUser`, `loanPage`, `authenticatedPage`). Each test gets isolated data.
- **`utils/`** — Helper utilities (`generateUser`, `apiClient`).
- **`tests/`** — Spec files grouped by workflow: `auth/`, `loan/`, `transfer/`, `billpay/`, `api/`.
- **`docs/`** — Test design documents, audit reports, traceability, and known issues.
- **`.github/workflows/`** — CI pipeline configuration.

## Conventions

- **Test IDs**: Tests must start with their `TC-XXX` ID from `docs/TEST_SCENARIOS_FUNCTIONAL.md`, e.g. `TC-LOGIN-003: invalid username shows error`.
- **Tags**: Tag tests with `@smoke` or `@regression` as appropriate.
- **Locators**: Live only in page objects. Prefer `getByRole` and `getByLabel` over CSS or XPath.
- **Assertions**: Use web-first assertions (`await expect(...).toBeVisible()`, etc.). No `waitForTimeout` or hard-coded waits.
- **BASE_URL**: Comes from the `BASE_URL` environment variable. Never hard-code URLs or credentials.
- **Test independence**: Each test must create its own fresh user through fixtures or utils. No shared accounts.

## Adding New Tests

1. Read the relevant section of `docs/TEST_SCENARIOS_FUNCTIONAL.md` (and `TRANSFER_FUNDS_EDGE_CASES_COMPREHENSIVE.md` for transfer edge cases).
2. Inspect the live application for real locators and expected messages. Do not guess them.
3. Add the test case ID to `docs/KNOWN_ISSUES.md` if the app behavior differs from documentation.
4. Run `npm run traceability` to update `docs/TRACEABILITY.md`.
5. Add `@smoke` or `@regression` tag as appropriate.

## Reporting Issues

- Document behavioral discrepancies between docs and live app in `docs/KNOWN_ISSUES.md`.
- Verify findings against source code in `docs/DOCUMENTATION_AUDIT_REPORT.md`.
- Distinguish between verified findings (VF-XXX) and unverified hypotheses (UH-XXX).
- Never state an unverified security hypothesis as a fact in test names or comments.

## CI

The pipeline runs on push/PR to `main`/`master`:
1. `npm ci`
2. `npx playwright install --with-deps`
3. `npm run lint`
4. `npx tsc --noEmit`
5. `@smoke` tests only (retries=2 in CI)
6. Upload HTML report and traces as artifacts

## ParaBank Notice

This framework automates the **ParaBank** demo application by **Parasoft**. It is a deliberately vulnerable system for testing and training purposes. The target is the live demo at `https://parabank.parasoft.com/parabank` or a locally deployed instance. Do not modify the application under test from this repository.