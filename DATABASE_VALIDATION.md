# ParaBank — Database Access and SQL Validation Report

## 1. Database Access and Schema Discovery

A connection to the HSQLDB database running inside the ParaBank Docker container was established successfully. The actual database schema was discovered before writing the SQL queries.

| Table | Columns |
|---|---|
| `ACCOUNT` | `ID`, `CUSTOMER_ID`, `TYPE`, `BALANCE` |
| `TRANSACTION` | `ID`, `ACCOUNT_ID`, `TYPE`, `DATE`, `AMOUNT`, `DESCRIPTION` |

All validation queries are read-only `SELECT` statements.

## 2. SQL-01 — Source and Target Account Records

```sql
SELECT ID, CUSTOMER_ID, TYPE, BALANCE
FROM ACCOUNT
WHERE ID IN (12345, 13011);
```

**Observed result:**

| Account ID | Customer ID | Balance |
|---:|---:|---:|
| 12345 | 12212 | -2335.0000 |
| 13011 | 12212 | 130.0000 |

Both expected account records were returned.

## 3. SQL-02 — Transaction Records by Account and Amount

```sql
SELECT ID, ACCOUNT_ID, TYPE, DATE, AMOUNT, DESCRIPTION
FROM "TRANSACTION"
WHERE ACCOUNT_ID IN (12345, 13011)
  AND ABS(AMOUNT) = 5.00
ORDER BY DATE DESC, ID DESC;
```

The query returned 17 records matching the account IDs and absolute transaction amount.

The most recent positive-amount records were:

| Transaction ID | Account ID | Amount | Description | Date |
|---:|---:|---:|---|---|
| 39895 | 13011 | 5.0000 | Funds Transfer Received | 2026-10-24 |
| 39784 | 12345 | 5.0000 | Funds Transfer Sent | 2026-10-24 |

These records are consistent with a $5 transfer from account `12345` to account `13011`. Since several similar transactions exist, the exact test execution cannot be conclusively identified from amount and date alone.

## 4. SQL-03 — Aggregate Transaction Check

```sql
SELECT
    ACCOUNT_ID,
    COUNT(*) AS TRANSACTION_COUNT,
    SUM(AMOUNT) AS TOTAL_AMOUNT
FROM "TRANSACTION"
WHERE ACCOUNT_ID IN (12345, 13011)
  AND ABS(AMOUNT) = 5.00
GROUP BY ACCOUNT_ID
ORDER BY ACCOUNT_ID;
```

**Observed result:**

| Account ID | Record count | Sum of amounts |
|---:|---:|---:|
| 12345 | 9 | 35.0000 |
| 13011 | 8 | 30.0000 |

The counts and sums differ between the accounts. This aggregate includes multiple transactions and does not by itself establish a one-to-one reconciliation.

## 5. SQL-04 — Transaction Breakdown by Type and Amount

```sql
SELECT
    ACCOUNT_ID,
    TYPE,
    AMOUNT,
    DESCRIPTION,
    COUNT(*) AS RECORD_COUNT
FROM "TRANSACTION"
WHERE ACCOUNT_ID IN (12345, 13011)
  AND ABS(AMOUNT) = 5.00
GROUP BY ACCOUNT_ID, TYPE, AMOUNT, DESCRIPTION
ORDER BY ACCOUNT_ID, TYPE, AMOUNT;
```

**Observed result:**

| Account ID | Type | Amount | Description | Count |
|---:|---:|---:|---|---:|
| 12345 | 1 | -5.0000 | Funds Transfer Sent | 1 |
| 12345 | 1 | 5.0000 | Funds Transfer Sent | 8 |
| 13011 | 0 | -5.0000 | Funds Transfer Received | 1 |
| 13011 | 0 | 5.0000 | Funds Transfer Received | 7 |

The breakdown confirms that both accounts contain positive and negative $5 transaction records. The source has eight positive and one negative matching records; the target has seven positive and one negative matching records.

The different positive-record counts explain the aggregate discrepancy. They do not, on their own, identify the cause or prove a defect.

## 6. Cross-Layer Balance Validation

The API observations for the tested $5 transfer were:

| Account | Before transfer | After transfer | Change |
|---|---:|---:|---:|
| Source (`12345`) | -2330.00 | -2335.00 | -5.00 |
| Target (`13011`) | 125.00 | 130.00 | +5.00 |

The observed balance changes match the expected effect of a $5 transfer. The current database balances also match the observed final API balances.

## 7. Conclusion and Limitations

- Database connectivity was established successfully.
- The real schema was discovered before SQL validation.
- Four read-only SQL checks were executed successfully.
- Both account records and matching transaction records were retrieved.
- Current database balances match the observed API balances.
- The aggregate and breakdown checks identified different numbers of positive $5 records between the accounts.
- The exact transfer pair has not been conclusively correlated with a unique test execution.

**Overall result:** Account-level balance consistency is supported by the API and database observations. Full transaction-level reconciliation remains inconclusive because multiple similar transactions exist and the aggregate counts differ. No claim of complete database integrity is made without further correlation of the specific transfer records.
