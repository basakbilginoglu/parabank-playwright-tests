
# ParaBank Playwright Testing

A banking application testing project using TypeScript, Playwright, Docker, GitHub Actions, and Postman.

The project covers UI automation, API testing, negative scenarios, risk analysis, debugging investigations, and CI evidence for ParaBank account and money transfer workflows.

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Clone the Repository](#clone-the-repository)
- [Local Environment Setup](#local-environment-setup)
- [Configure Test Credentials](#configure-test-credentials)
- [Run the Tests](#run-the-tests)
- [GitHub Actions CI](#github-actions-ci)
- [Test Scope](#test-scope)
- [Test Data and Known Limitations](#test-data-and-known-limitations)
- [Documentation and Evidence](#documentation-and-evidence)

## Project Overview

ParaBank is used to exercise banking workflows and investigate how the application handles valid and invalid transfer scenarios.

The application is accessed locally at:

`http://localhost:8080/parabank`

The project includes:

- **UI automation:** Login, account overview, money transfers, and transaction history.
- **Negative testing:** Invalid transfer amounts, same-account transfers, and transfer boundary scenarios.
- **API testing:** Postman collections, environments, and request/response evidence.
- **Risk analysis:** Banking risks, business rules, and expected application behavior.
- **Debugging investigation:** Analysis of environment, test data, assertion, and application behavior issues.
- **CI validation:** TypeScript type-checking, Playwright execution, and diagnostic artifacts.

## Technology Stack

- TypeScript
- Playwright
- Node.js and npm
- Docker
- GitHub Actions
- Postman

## Project Structure

The repository contains UI automation, API testing assets, supporting documentation, and evidence.

```text
parabank-playwright-tests/
├── .github/
│   └── workflows/
├── api/
│   ├── collections/
│   ├── environments/
│   └── evidence/
├── evidence/
│   └── ci/
├── pages/
├── tests/
├── test-data/
├── playwright.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── DOMAIN_ANALYSIS.md
├── NONFUNCTIONAL_RISKS.md
├── DEBUG_INVESTIGATION.md
├── TECHNICAL_DECISIONS.md
├── AI_USAGE.md
└── README.md
```

The exact contents of each directory may change as the project evolves.

## Prerequisites

Install the following tools before setting up the project:

- Git
- Node.js and npm
- Docker Desktop
- Visual Studio Code (recommended)

## Clone the Repository

1. Open the [GitHub repository](https://github.com/basakbilginoglu/parabank-playwright-tests).
2. Click **Code** and copy the HTTPS repository URL.
3. Open a terminal and run:

```bash
git clone https://github.com/basakbilginoglu/parabank-playwright-tests.git
cd parabank-playwright-tests
```

To open the project in Visual Studio Code, run:

```bash
code .
```

Alternatively, open the cloned project folder from Visual Studio Code.

## Local Environment Setup

### 1. Install Dependencies

From the repository root, run:

```bash
npm ci
```

This installs the dependencies specified by the lockfile.

### 2. Install Playwright Browsers

Run:

```bash
npx playwright install
```

Install the browser dependencies required by your operating system if prompted or if a browser fails to launch.

### 3. Start Docker Desktop and ParaBank

Start Docker Desktop and launch the ParaBank container using the Docker image and port configuration used by this project.

The application must be available at:

`http://localhost:8080/parabank`

Check that the container is running and that the application has finished starting before running the UI tests.

If the application is unavailable, inspect the Docker container status and logs before investigating a Playwright failure.

## Configure Test Credentials

The setup requires the test credentials expected by the project configuration.

For GitHub Actions, configure the relevant repository secrets under:

**Settings → Secrets and variables → Actions**

For local execution, provide the required environment variables using the mechanism supported by the project's configuration.

Do not commit real credentials or other secrets to the repository.

The `auth.setup.ts` setup handles both a newly registered user and an existing user in the persistent ParaBank database. When an existing user is found, the setup logs in and checks whether another account is needed for the tests.

## Run the Tests

Run TypeScript type-checking:

```bash
npm run typecheck
```

This checks the TypeScript code without generating compiled output when configured with `tsc --noEmit`.

Run the Playwright tests:

```bash
npm test
```

The commands above assume the corresponding scripts are defined in `package.json`. Check `package.json` for other supported scripts, such as UI mode or report generation.

To run Playwright directly, use:

```bash
npx playwright test
```

## GitHub Actions CI

The workflow is located in `.github/workflows/`.

The configured pipeline is intended to:

1. Check out the repository.
2. Set up Node.js.
3. Install npm dependencies.
4. Install Playwright browsers.
5. Run TypeScript type-checking.
6. Start the ParaBank Docker container.
7. Wait for the application to become available.
8. Execute the configured Playwright smoke tests.
9. Upload available test reports and failure artifacts.

Type-checking helps detect TypeScript errors before browser tests run. The readiness check helps avoid starting UI tests before the application is available.

### CI Run Evidence

Two successful GitHub Actions runs were recorded:

- [Successful run 1](https://github.com/basakbilginoglu/parabank-playwright-tests/actions/runs/40371205791/job/121742108220)
- [Successful run 2](https://github.com/basakbilginoglu/parabank-playwright-tests/actions/runs/40383020132/job/121783939772)

A controlled test failure was also captured to demonstrate failure detection and diagnostic evidence handling.

Evidence file: `evidence/ci/controlled-failure.png`

### Accessing CI Artifacts

1. Open the relevant GitHub Actions run.
2. Return to the overall workflow run summary if the link opens an individual job.
3. Find the **Artifacts** section.
4. Download the relevant artifact as a ZIP file, if one was uploaded.
5. Extract it to inspect the available reports, screenshots, and traces.

The artifacts available depend on the workflow configuration and whether the corresponding files were generated and uploaded.

If a Playwright trace is included, it can be inspected locally with:

```bash
npx playwright show-trace path/to/trace.zip
```

## Test Scope

The project covers the following areas:

| Area | Coverage |
|---|---|
| Authentication | Registration setup and login |
| Account overview | Account information and balances |
| Transfers | Money transfer workflow and result validation |
| Transaction history | Transaction records and history checks |
| Negative scenarios | Invalid amounts and transfer boundary cases |
| API testing | Postman requests and response assertions |
| CI | TypeScript checks, Playwright execution, and failure diagnostics |

The precise scenarios and assertions are defined in the relevant test files and Postman collection.

## Test Data and Known Limitations

ParaBank data can persist between executions. Accounts, balances, and transaction histories may therefore differ between runs.

Transfer tests can modify account state. When investigating a failure, consider the initial balances, transfer amount, resulting balances, and transaction history rather than relying only on a success message or HTTP status.

Observed application behavior should be distinguished from expected business behavior. For example, a successful response does not necessarily establish that a transfer amount or resulting balance is correct.

The project investigates such cases through assertions and supporting evidence. Findings apply to the tested environment and scenarios; they do not establish that every application workflow has been validated.

## Documentation and Evidence

The following documents provide additional context:

- [`DOMAIN_ANALYSIS.md`](DOMAIN_ANALYSIS.md) — domain workflows, business rules, and open questions.
- [`NONFUNCTIONAL_RISKS.md`](NONFUNCTIONAL_RISKS.md) — identified risks and testing priorities.
- [`DEBUG_INVESTIGATION.md`](DEBUG_INVESTIGATION.md) — investigation of a specific failure or uncertainty.
- [`TECHNICAL_DECISIONS.md`](TECHNICAL_DECISIONS.md) — technical choices and test strategy.
- [`AI_USAGE.md`](AI_USAGE.md) — how AI assistance was used and reviewed.
- `api/` — Postman collections, environments, and API evidence.
- `evidence/` — selected screenshots and test execution evidence.

## Quality Gate

A successful CI run confirms that the configured type-check and selected Playwright tests passed in that run. It does not prove that the entire application is defect-free.

Reliable results also depend on suitable assertions, repeatable environment setup, controlled test data, and useful diagnostic artifacts.
