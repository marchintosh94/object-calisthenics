import { TransactionData } from '../../transaction/type'

export const hasBothAccounts = (transaction: TransactionData): boolean => {
  return !!(transaction.from && transaction.to)
}

export const hasOnlyFromAccount = (transaction: TransactionData): boolean => {
  return !!(transaction.from && !transaction.to)
}

export const hasOnlyToAccount = (transaction: TransactionData): boolean => {
  return !!(!transaction.from && transaction.to)
}

export const hasMatchingAccount = (
  transaction: TransactionData,
  account: string
): boolean => {
  return transaction.from === account || transaction.to === account
}
