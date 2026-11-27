# Claude Instructions for ParaBank Test Automation

## Project Context
This repository contains the Playwright TypeScript automation framework for the ParaBank demo banking web application.

ParaBank is a demo online banking system that allows users to:

- Register new accounts
- Login to the banking portal
- View account balances
- Transfer funds between accounts
- Pay bills
- Request loans
- View transaction history

The application under test is a separate project. Never modify it from this repository.
ParaBank is a deliberately vulnerable demo app by Parasoft.

## Application Type
Web-based banking application with:

- UI workflows for banking operations
- Customer account management
- Financial transactions
- Transaction history tracking

## Testing Objective
Automate the functional test scenarios documented in `docs/`.

Focus on:

- Core user journeys
- Positive test cases
- Negative test cases
- Boundary conditions

## Key Workflows

1. User Registration
2. Login
3. Account Overview
4. Transfer Funds
5. Bill Payment
6. Loan Request
7. Transaction History

## Tech Stack

- Playwright Test with TypeScript (strict mode)
- Page Object Model
- dotenv for environment configuration
- GitHub Actions for CI
- ESLint and Prettier

## Project Structure

- `pages/` page objects, the only place locators live
- `fixtures/` custom Playwright fixtures
- `test-data/` static test data and boundary values
- `utils/` helpers such as the random user generator
- `tests/<workflow>/` spec files grouped by workflow
- `docs/` test design documents (scenarios, edge cases, audit)

## Conventions

- Test titles start with the test case ID from `docs/`, e.g. `TC-LOGIN-003: invalid username shows error`.
- Tag tests with `@smoke` or `@regression`.
- Locators live only in page objects. Prefer `getByRole` and `getByLabel` over CSS or XPath.
- Use web-first assertions. No hard-coded waits or `waitForTimeout`.
- Each test must be independent. Create fresh users through fixtures or utils instead of sharing accounts.
- The base URL comes from the `BASE_URL` environment variable. Never hard-code URLs or credentials.
- Inspect the live application before writing locators or expected messages. Do not guess them.

## Documentation Rules

- Findings in `docs/` are marked verified (supported by source code evidence) or unverified (hypothesis). Keep that distinction.
- Never state an unverified security hypothesis as a fact in code comments, test names or the README.

## Test Scenario Format

When writing or updating test scenario documents, use:

Test Case ID:
Scenario:
Preconditions:
Steps:
Expected Result:

## Test Case ID Prefixes

- Login: TC-LOGIN, TC-LOGIN-EDGE, TC-LOGIN-SEC
- Transfer Funds: TC-TRANSFER, TC-TRANSFER-EDGE, TC-TRANSFER-SEC
  (extended set in docs/TRANSFER_FUNDS_EDGE_CASES_COMPREHENSIVE.md: TC-EDGE-TF, TC-NEG-TF, TC-SEC-TF, TC-DATA-TF, TC-UI-TF, TC-API-TF, TC-PERF-TF)
- Bill Payment: TC-BILLPAY, TC-BILLPAY-EDGE, TC-BILLPAY-SEC
- Loan Request: TC-LOAN, TC-LOAN-EDGE, TC-LOAN-SEC

## Using docs/

- `docs/` holds the test design that this framework automates. Before writing tests for a workflow, read the matching section of `docs/TEST_SCENARIOS_FUNCTIONAL.md` (Login = section 1, Transfer Funds = section 2, Bill Payment = section 3, Loan Request = section 4).
- For Transfer Funds also read `docs/TRANSFER_FUNDS_EDGE_CASES_COMPREHENSIVE.md`.
- Check `docs/DOCUMENTATION_AUDIT_REPORT.md` before treating any security or validation claim as fact.
- Read only the sections you need, not whole files.
- If a scenario's expected result in `docs/` differs from the live app, trust the live app, record the difference in `docs/KNOWN_ISSUES.md`, and do not silently change the expectation.