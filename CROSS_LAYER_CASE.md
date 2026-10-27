# Cross-Layer Transaction Investigation

## 1. Test Information

- **Test ID:** `TX-CROSS-001`
- **Environment:** Local ParaBank / Docker
- **Base URL:** `http://localhost:8080/parabank`
- **Execution Date:** 2026-10-24 /11:11
- **Test Method:** API
- **Transfer Amount:** USD 5.00
- **Result:** Inconclusive

## 2. Objective

Verify that a controlled transfer from account `12345` to account `13011` produces the expected balance changes and determine whether transaction data can be verified consistently across the available application layers.

## 3. Preconditions and Assumptions

- Both accounts exist in the isolated ParaBank test environment.
- Both accounts belong to customer `12212`.
- The source and target accounts are different.
- The transfer amount is USD 5.00.
- No fees, currency conversion, or concurrent transactions are assumed.
- UI verification requires access to the same test accounts.
- Expected balance changes are calculated assuming the transfer succeeds without additional business rules.

## 4. Initial State

Initial account balances were retrieved through the account API before the transfer.

| Field | Source Account | Target Account |
|---|---:|---:|
| Account ID | 12345 | 13011 |
| Customer ID | 12212 | 12212 |
| Account Type | CHECKING | CHECKING |
| Initial Balance | -2330.00 | 125.00 |

**Evidence:**

- `evidence/cross-layer/initial-source-account.png`
- `evidence/cross-layer/initial-target-account.png`

The actual API responses should be retained as supporting evidence.

## 5. Transfer Execution

| Field | Value |
|---|---|
| Source Account | 12345 |
| Target Account | 13011 |
| Transfer Amount | USD 5.00 |
| Method | API |
| Request Timestamp | Not recorded |
| Transfer HTTP Status / Response | Not provided in the available evidence |

**Evidence:** `evidence/cross-layer/transfer-request-response.png`

The transfer request and its response should be captured if available. The final account balances support the expected balance changes, but the transfer response itself has not been documented here.

## 6. Final State

Post-transfer balances were retrieved through the account API.

| Check | Initial Balance | Expected Balance | Actual Balance | Assessment |
|---|---:|---:|---:|---|
| Source Account (12345) | -2330.00 | -2335.00 | -2335.00 | Match |
| Target Account (13011) | 125.00 | 130.00 | 130.00 | Match |

**Balance assessment:** Both actual balances match the expected results for a USD 5.00 transfer, assuming no additional fees, concurrent transactions, or other balance adjustments.

**Evidence:**

- `evidence/cross-layer/final-source-account.png`
- `evidence/cross-layer/final-target-account.png`

## 7. Cross-Layer Verification

| Layer / Check | Status | Notes |
|---|---|---|
| Initial account balances via API | Verified | Initial values recorded |
| Final account balances via API | Pass | Both balances match expected values |
| UI verification | Blocked | The UI test user cannot access these accounts |
| Transaction history | Pass | The USD 5.00 transfer appears as the latest transaction |
| Database verification | Not performed | No database evidence collected |
| Application logs | Not collected | No relevant logs attached |

### UI Access Limitation

The transfer investigation used accounts `12345` and `13011`. These accounts are not accessible to the UI test user's account.

Therefore, UI verification could not be performed with the current test data. This is a test access limitation and does not, by itself, indicate a UI defect.

## 8. Result and Analysis

**Overall Result: Inconclusive**

The API responses show that the source balance decreased by USD 5.00 and the target balance increased by USD 5.00. Both balance changes match the expected values under the stated assumptions.

However, the matching transaction-history record has not been verified, and UI validation was blocked by account access limitations. Database verification was also not performed.

Consequently, the available evidence supports API-level balance consistency but does not establish complete cross-layer transaction consistency.


## 9. Traceability and Evidence

| Evidence | File |
|---|---|
| Initial source account | `evidence/cross-layer/initial-source-account.png` |
| Initial target account | `evidence/cross-layer/initial-target-account.png` |
| Transfer request and response | `evidence/cross-layer/transfer-request-response.png` |
| Final source account | `evidence/cross-layer/final-source-account.png` |
| Final target account | `evidence/cross-layer/final-target-account.png` |
| Transaction history | `evidence/cross-layer/transaction-history.png` |

- **Test ID:** `TX-CROSS-001`
- **Source Account:** `12345`
- **Target Account:** `13011`
- **Transfer Amount:** USD 5.00
- **Transaction / Correlation ID:** Not recorded
- **Execution Timestamp:** Not recorded
- **Database Verification:** Not performed
- **Data Masking:** Credentials, session tokens, and sensitive personal information must be excluded from evidence.


