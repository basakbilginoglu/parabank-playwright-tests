# Non-Functional Risks and Security Checks

## 1. Scope

This document records security and non-functional risks identified during testing of the local ParaBank application.

The assessment covers session behavior, account access, transfer validation, request timeouts, service unavailability, and basic keyboard navigation.

Findings are classified according to the evidence collected. Observed behavior is distinguished from potential risks and checks that have not yet been completed.

## 2. Risk Assessment

### H1-01 — Account Authorization and Isolation

**Risk:** A user may access account information belonging to another user if authorization checks are missing or incorrectly enforced.

**Potential impact:** Unauthorized disclosure of account information and possible exposure of financial data.

**Observed behavior:** During UI testing, two separate test accounts were created. The normal UI flow showed that users could not see each other's accounts.

**Assessment:** UI-level account isolation was observed in the tested scenarios.

**Limitation:** Direct API authorization checks using another user's account identifier were not independently verified. UI isolation alone does not prove that all API endpoints enforce authorization correctly.

**Recommended follow-up:** Authenticate as one user and attempt to access another user's account through the API. Verify that unauthorized access is denied and no sensitive account data is returned.

**Status:** Partially verified.

### H1-02 — Logout and Session Behavior

**Risk:** Previously viewed account information may remain visible after logout because of browser caching or session-handling behavior.

**Potential impact:** Another person using the same device may see previously displayed account information.

**Observed behavior:**
- After logout, using the browser Back button displayed the previously viewed account overview.
- Opening account details required the user to sign in again.
- Refreshing returned the browser to the logged-out state.

**Assessment:** The account overview remained visible through browser history after logout, but the tested account-details action required authentication again. No confirmed authentication bypass was demonstrated.

**Limitation:** The underlying caching mechanism was not verified. It has not been established whether the displayed overview contained a fresh response or previously rendered page content.

**Recommended follow-up:** Repeat the test after logout and inspect whether sensitive account information remains accessible. Verify behavior in a new tab and after refreshing the page.

**Status:** Potential privacy concern observed; further investigation required.

### H1-03 — Zero-Amount Transfer Handling

**Risk:** The application may accept a transfer with an amount of zero or handle the request incorrectly.

**Potential impact:** Incorrect transaction records, inconsistent validation, or unexpected application behavior.

**Observed behavior:** During zero-amount transfer testing, the UI displayed the following message:

`An internal error has occurred and has been logged.`

**Assessment:** The application returned an internal-error message for the tested scenario.

**Limitation:** The final account balances and transaction history were not verified after this specific error. It is therefore unknown whether any data was changed.

**Recommended follow-up:** Repeat the test in a controlled test environment, then compare account balances and transaction history before and after the request. Confirm the expected business rule for zero-value transfers.

**Status:** Unexpected error observed; data integrity not yet verified.

### H1-04 — Duplicate Transfer Requests

**Risk:** Repeated submission of the same transfer may create duplicate transactions.

**Potential impact:** An unintended financial operation may be processed more than once.

**Observed behavior:** During exploratory testing, repeated transfers with the same amount were accepted.

**Assessment:** Repeated submissions were observed to succeed. This alone does not establish whether the application received duplicate copies of the same request or whether each submission was treated as a separate intentional transfer.

**Limitation:** The application's idempotency requirements have not been established, and duplicate transaction records were not conclusively verified.

**Recommended follow-up:** Record the initial balances and transaction history, submit a controlled transfer, and inspect the resulting transaction records and balances. Compare the behavior of a repeated submission with the application's intended business rules.

**Status:** Potential risk identified; further verification required.

### H2-01 — Service Unavailability

**Risk:** Users may be unable to access the application when the service is unavailable.

**Test objective:** Observe browser behavior when the ParaBank service is stopped.

**Test setup:** The local ParaBank Docker container named `parabank` was stopped.

**Observed results:**
- Docker reported the container status as `Exited (143)`.
- The browser displayed `This site can't be reached` when accessing the application.

**Recovery verification:** The container was restarted, and the application became accessible again.

**Assessment:** The application was inaccessible while the container was stopped. The browser displayed a connection-level error rather than an application-generated message.

**Limitation:** This test simulated complete service unavailability. It did not evaluate graceful degradation, application-level error handling while the service remains reachable, or recovery during an in-progress transaction.

**Evidence:**
- `evidence/non-functional/H2-01-container-stopped.png` — Docker container stopped.
- `evidence/non-functional/H2-01-browser-unavailable.png` — Browser connection error.
- `evidence/non-functional/H2-01-service-recovered.png` — Application accessible after restart.


**Status:** Service unavailability and recovery observed.

### H2-02 — Client-Side Request Timeout

**Risk:** A client may stop waiting for a response before the server completes processing a request.

**Test objective:** Observe client behavior when a request does not receive a response within the configured timeout period.

**Test tool:** Postman.

**Test setup:** A read-only GET request was executed with `Request Timeout` configured to `1 ms`.

**Observed results:**
- Postman displayed `Request timed out`.
- After restoring the timeout setting to a normal value, the GET request returned `200 OK`.

**Assessment:** A client-side timeout was observed with the deliberately short timeout setting. The subsequent successful response confirmed that the API was responding under normal timeout settings.

**Limitation:** The 1 ms timeout does not establish that the application has a performance defect or that real network latency occurred. The cause of the initial timeout was not independently established.

**Recommended follow-up:** If realistic latency behavior must be evaluated, introduce a controlled delay in a test environment and measure response time and timeout behavior. For state-changing requests, verify transaction status before retrying after a timeout.

**Evidence:**
- `evidence/non-functional/H2-02-postman-timeout-1ms.png` — GET request timed out with a 1 ms client timeout.
- `evidence/non-functional/H2-02-postman-get-200.png` — Subsequent GET request returned HTTP 200 after restoring the timeout setting.

**Status:** Client-side timeout and subsequent API response observed.

### H2-03 — Keyboard Navigation and Form Accessibility

**Risk:** Users who navigate forms using a keyboard may be unable to reach or operate important controls.

**Potential impact:** Reduced usability and accessibility for users who do not use a mouse.

**Observed behavior:** The Tab key was used to navigate the transfer form, and the form fields were reachable.

**Assessment:** Basic keyboard navigation was observed for the tested fields.

**Limitation:** Focus visibility, logical focus order across the full application, Shift+Tab navigation, keyboard submission, and screen-reader compatibility were not systematically tested.

**Recommended follow-up:** Verify focus indicators, forward and reverse navigation, keyboard operation of all relevant controls, and accessible labels for form fields.

**Status:** Basic keyboard navigation observed; full accessibility assessment incomplete.

## 3. Cross-Cutting Limitations

- UI-level account isolation does not establish that direct API access is properly authorized.
- A page remaining visible after logout does not, by itself, prove that the session remains authenticated.
- An error message does not establish whether account balances or transaction records changed.
- A client-side timeout does not establish whether the server received or processed the request.
- Service unavailability and client-side timeout were tested as separate scenarios.
- Full accessibility, realistic network latency, and comprehensive recovery behavior have not been verified.

## 4. Summary

The testing identified several areas requiring further investigation, including account authorization at the API layer, sensitive information remaining visible after logout, transfer validation, and duplicate transfer handling.

Two non-functional scenarios were directly exercised:
1. **Service unavailability:** Stopping the Docker container made the application inaccessible, and access was restored after restarting it.
2. **Client-side timeout:** A GET request with a 1 ms Postman timeout returned `Request timed out`; a subsequent request returned `200 OK` after the timeout setting was restored.

Basic keyboard navigation was also observed on the transfer form.

These results document the tested behavior and its limitations. They do not establish that every identified risk is an exploitable vulnerability or a confirmed application defect.