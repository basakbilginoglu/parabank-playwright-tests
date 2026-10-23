# Risk Test Strategy

## 1. Risk Assessment

| Risk ID | Risk | Trigger | Potential Cause | User / Business Impact | Likelihood | Priority Rationale |
|---|---|---|---|---|---|---|
| R-01 | Transfer to the wrong account | A transfer is submitted with an unintended destination account. | Incorrect account selection or destination account handling. | Funds may be transferred to the wrong recipient. | Medium | High priority because incorrect fund allocation has a direct financial impact. |
| R-02 | Duplicate transfer processing | A user retries a transfer or the same request is submitted more than once. | Missing duplicate-request protection or unclear idempotency behavior. | The user may be charged or credited more than once. | Medium | High priority because duplicate transfers can cause financial discrepancies. |
| R-03 | Insufficient balance | A transfer amount exceeds the source account's available funds. | Missing or incorrect balance validation. | The source account may become overdrawn, or an invalid transfer may be completed. | High | High priority because exploratory testing showed that a transfer can complete even when the source balance is insufficient. |
| R-04 | Unauthorized account or transaction-history access | A user attempts to access another customer's account or transaction history. | Missing or incorrect authorization checks. | Private financial information may be exposed, or unauthorized actions may occur. | Medium | High priority because unauthorized access could compromise customer data and account security. |
| R-05 | UI–API data discrepancy | The account balance or transaction details displayed in the UI differ from the API response. | Incorrect data mapping, stale data, or inconsistent update handling. | Users may make decisions based on incorrect financial information. | Medium | High priority because financial data must remain consistent across application layers. |
| R-06 | Invalid transfer amount accepted | A user submits a zero, negative, or unusually high transfer amount. | Missing input validation or insufficient business-rule enforcement. | Invalid transfers may affect account balances incorrectly. | High | High priority because exploratory testing showed that zero and negative amounts can be accepted. |
| R-07 | Same-account transfer accepted | The source and destination account IDs are identical. | Missing validation of source and destination accounts. | The transaction may be misleading or produce unintended financial records. | Medium | Medium priority because the expected business rule needs confirmation. |
| R-08 | Transaction record or balance persistence failure | A transfer completes, but the updated balance or transaction record does not persist. | Failed persistence, inconsistent transaction handling, or incomplete updates. | Users may see incorrect balances or missing transaction history. | Medium | High priority because reliable financial records are essential. |

## 2. Risk-Based Test Scenarios

| Risk ID | Test Scenario | Expected Result | Test Layer |
|---|---|---|---|
| R-01 | Submit a transfer between two different accounts and verify the source and destination account IDs. | The transfer affects only the intended accounts. | UI + API |
| R-02 | Repeat the same transfer request and inspect the response and resulting balances. | Behavior matches the documented duplicate-request or idempotency contract. | API + UI |
| R-03 | Attempt a transfer exceeding the source account's available funds. | The transfer follows the documented insufficient-funds policy. | API + UI; DB if accessible |
| R-04 | Attempt to access another test user's account details and transaction history. | Access is denied unless explicitly authorized. | API + UI |
| R-05 | Compare the balance and transaction details for the same account and transaction context in the UI and API. | The values are consistent, accounting for documented differences in format or timing. | UI + API |
| R-06 | Submit zero, negative, and unusually high transfer amounts. | Invalid amounts are rejected according to the business rules. | API + UI |
| R-07 | Submit a transfer with the same source and destination account. | The application follows the documented same-account transfer rule. | API + UI |
| R-08 | Complete a transfer, refresh the page, and recheck the balance and transaction history. | The updated balance and transaction record persist correctly. | UI + API; DB if accessible |

## 3. Test-Level Strategy

| Layer | Purpose | Selected Checks | Rationale |
|---|---|---|---|
| UI | Validate user-facing behavior and workflows. | Transfer form validation, account selection, success/error messages, displayed balances, transaction history, and persistence after refresh. | Confirms what users can see and do through the application. |
| API | Validate service behavior and business rules. | Transfer responses, account IDs, balance updates, invalid amounts, insufficient funds, repeated requests, and authorization. | Enables direct verification of service contracts and negative scenarios without depending entirely on UI behavior. |
| DB | Validate persistence and data integrity, if database access is available. | Account balance changes, transaction records, transaction uniqueness, and consistency between related records. | Provides an additional way to verify persisted data. It is conditional on database access and permission. |

The same check does not need to be repeated at every layer. Tests are assigned to the layer that provides the clearest evidence for the risk. Cross-layer checks are used when consistency between layers is itself the risk.

## 4. Prioritization

### High Priority

- **R-01:** Incorrect recipient can result in funds reaching the wrong account.
- **R-02:** Duplicate processing may result in repeated financial transactions.
- **R-03:** Insufficient-funds validation may allow transfers that violate the intended account policy.
- **R-04:** Unauthorized access can expose sensitive account information.
- **R-05:** Inconsistent financial data can mislead users.
- **R-06:** Invalid amounts may cause unintended balance changes.
- **R-08:** Missing or incorrect persisted records can undermine transaction reliability.

### Medium Priority

- **R-07:** Same-account transfers require clarification of the intended business rule before the behavior can be classified as a defect.

Priorities are qualitative and based on potential financial impact, security implications, and the observed behavior of the application. They are not calculated from numerical risk scores.

## 5. Important Scenarios Not Yet Fully Tested

| Scenario | Current Status | Reason Not Fully Tested |
|---|---|---|
| Transfer to an unintended destination account | Partially tested | Account IDs and transaction details need to be cross-checked against the API. |
| Duplicate technical request | Not verified | Repeating a transfer manually does not establish idempotency. The same request must be tested against the documented API contract. |
| Very high transfer amount | Partially tested | A success message was observed, but the resulting balance changes have not been confirmed. |
| Unauthorized access to another customer's account | Not tested directly | Separate test accounts and appropriate authorization conditions are required. |
| UI–API balance and transaction consistency | Partially tested | Values must be compared for the same account and transaction context. |
| Transaction record correctness | Partially tested | The record is visible in transaction history, but all fields and transaction details have not been validated. |
| Database persistence and integrity | Not tested | Database access and permission have not been confirmed. |
| Fees, transfer limits, and overdraft rules | Not verified | The applicable product requirements and business rules are unavailable or unconfirmed. |

## 6. Assumptions and Constraints

- The strategy is based on exploratory testing of the ParaBank demo application and the API observations collected so far.
- Observed behavior does not automatically establish the intended business rule or confirm a defect.
- Business rules for zero and negative amounts, overdrafts, same-account transfers, transfer limits, and duplicate requests require confirmation.
- API tests depend on the availability of the relevant endpoints and valid test data.
- Database tests will be performed only if database access is available and authorized.
- Authorization testing should use isolated test accounts and must not access real customers' data.

## 7. Exit Criteria

Risk-based testing can be considered complete when:

- All high-priority scenarios have been executed or documented with a clear blocker.
- Expected results are compared with observed results.
- Relevant UI and API data consistency checks have been completed.
- Unexecuted scenarios and their reasons are documented.
- Observed failures are recorded with reproducible steps and supporting evidence.
- Unconfirmed business rules are clearly identified for clarification.