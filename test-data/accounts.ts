export interface TransferTestData {
  amount: string;
  fromAccountId?: string;
  toAccountId?: string;
}

export function getTransferTestData(): TransferTestData {
  return {
    amount: process.env.PARABANK_TRANSFER_AMOUNT ?? '1.00',
    fromAccountId: process.env.PARABANK_FROM_ACCOUNT_ID || undefined,
    toAccountId: process.env.PARABANK_TO_ACCOUNT_ID || undefined
  };
}

export function chooseDistinctAccounts(
  accountIds: string[],
  preferredFrom?: string,
  preferredTo?: string
): { fromAccountId: string; toAccountId: string } {
  const fromAccountId = preferredFrom ?? accountIds[0];
  const toAccountId = preferredTo ?? accountIds.find((id) => id !== fromAccountId);

  if (!fromAccountId || !toAccountId) {
    throw new Error(
      `Need at least two distinct account IDs; discovered: ${accountIds.join(', ') || '(none)'}`
    );
  }
  // Test data constraint: select two distinct accounts to isolate
  // transfer behavior between separate accounts.
  // Whether transfers between the same account are allowed is unconfirmed.
if (fromAccountId === toAccountId) {
  throw new Error('Test setup requires two distinct account IDs.');
}
  if (fromAccountId === toAccountId) {
    throw new Error('Source and destination account IDs must be different.');
  }
  if (!accountIds.includes(fromAccountId) || !accountIds.includes(toAccountId)) {
    throw new Error(
      `Configured account IDs must belong to the logged-in user. Discovered: ${accountIds.join(', ')}`
    );
  }
  return { fromAccountId, toAccountId };
}
