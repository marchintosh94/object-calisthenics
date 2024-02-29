import { TransactionData } from '../../transaction/type'
import { hasMatchingAccount } from '../../utils/transaction/transaction-helpers'

describe('hasMatchingAccount', () => {
  const transaction: TransactionData = {
    from: 'sender',
    to: 'receiver',
    amount: 100,
    date: Date.now()
  }

  it('should return true if the transaction has a matching "from" account', () => {
    const account = 'sender'
    const result = hasMatchingAccount(transaction, account)
    expect(result).toBe(true)
  })

  it('should return true if the transaction has a matching "to" account', () => {
    const account = 'receiver'
    const result = hasMatchingAccount(transaction, account)
    expect(result).toBe(true)
  })

  it('should return false if the transaction does not have a matching account', () => {
    const account = 'other'
    const result = hasMatchingAccount(transaction, account)
    expect(result).toBe(false)
  })
})
