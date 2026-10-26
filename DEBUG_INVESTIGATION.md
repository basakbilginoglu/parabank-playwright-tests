# DEBUG_INVESTIGATION.md

## 1. Symptom

Playwright tests passed locally in Visual Studio Code but failed in GitHub Actions CI.

- **Local environment:** ParaBank running in Docker.
- **CI environment:** GitHub Actions.
- **Problem:** The same tests behaved differently in local and CI environments.

The investigation focused on Docker image consistency, test-user state, and authentication setup.

## 2. Hypotheses

| ID | Hypothesis | Possible Cause |
|---|---|---|
| H1 | Docker image mismatch | Local and CI environments used different Docker images. |
| H2 | Existing test user | The CI registration step encountered a user that already existed. |
| H3 | Authentication setup | The required authentication state was not prepared correctly before tests ran. |

## 3. Evidence

### Evidence A — Docker Image Mismatch

The Docker images used locally and in CI were different. The image mismatch was corrected, but the CI failure continued.

**Evidence to attach:**

- **Docker image correction:** [View code changes](https://github.com/basakbilginoglu/parabank-playwright-tests/commit/aeba82ddde8042bdd8cf074b037340944def91c4)


### Evidence B — Unique Username Generation and Authentication Setup

The test setup was updated to generate a unique username for each run, preventing duplicate-user registration errors. The authentication setup was also addressed through `auth.setup.ts`. After these changes, the CI issue was resolved.


**Evidence to attach:**
- **Code changes:** [View commit diff](https://github.com/basakbilginoglu/parabank-playwright-tests/commit/4a44025fc8812e871b63e278e82914e64c06ebf9)
- The relevant changes in `auth.setup.ts`, if applicable.
- The successful GitHub Actions run after the changes.
- ### Evidence C: Existing-user error and fix
During subsequent CI attempts, user creation failed with an error indicating that the user already existed.

- **Code changes:** [View commit diff](https://github.com/basakbilginoglu/parabank-playwright-tests/commit/8a74776b831ddac847fe0770ab01180a7e0c2df7)
## 4. Hypothesis Elimination

| Hypothesis | Evidence and Assessment |
|---|---|
| H1 — Docker image mismatch | The image mismatch was corrected, but the failure continued. Therefore, it was not sufficient to explain the problem on its own. |
| H2 — Existing test user | The error confirmed a conflict during user creation. However, it did not prove that this was the cause of every earlier CI failure. |
| H3 — Authentication setup | The issue was resolved after `auth.setup.ts` was addressed. This supports authentication setup as an important part of the final fix. |

## 5. Root Cause / Conclusion

The investigation identified multiple issues during CI debugging.

First, the local and CI Docker images differed. Correcting this mismatch did not resolve the failure. Subsequent CI attempts encountered an existing-user error during user creation.

The issue was ultimately resolved after the authentication setup was addressed in `auth.setup.ts`. This supports authentication preparation as the final fix, although the exact technical cause should be confirmed against the code diff and CI logs.

## 6. Fix and Reruns

| Stage | Action | Result |
|---|---|---|
| Initial run | Compared local and CI test behavior. | CI tests failed. |
| First fix | Corrected the Docker image mismatch. | The failure continued. |
| Further investigation | Examined the existing-user error during registration. | A user-creation conflict was observed. |
| Final fix | Addressed authentication setup in `auth.setup.ts`. | The issue was resolved. |



## Final Assessment

This investigation shows why an initial environment difference should not automatically be treated as the root cause. Correcting the Docker image mismatch alone did not resolve the failure. The investigation then exposed an existing-user conflict, and addressing `auth.setup.ts` resolved the issue. CI logs and code changes should be retained to support these conclusions.