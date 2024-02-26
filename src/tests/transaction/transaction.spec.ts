import fs from 'fs'
import dotenv from 'dotenv'
import { TransactionActions } from '../../transaction/transaction'

dotenv.config()

describe('TransactionActions', () => {
  afterAll(() => {
    fs.rmSync('db/transactions.json', { recursive: true })
  })

  describe('deposit', () => {
    it('should save a deposit transaction', () => {
      const depositAction = {
        name: 'John Doe',
        amount: 100
      }

      const transaction = TransactionActions.deposit(depositAction)

      expect(transaction).toEqual({
        to: depositAction.name,
        amount: depositAction.amount,
        date: expect.any(String)
      })
    })
  })

  describe('withdraw', () => {
    it('should save a withdraw transaction', () => {
      const withdrawAction = {
        name: 'John Doe',
        amount: 50
      }

      const transaction = TransactionActions.withdraw(withdrawAction)

      expect(transaction).toEqual({
        from: withdrawAction.name,
        amount: withdrawAction.amount,
        date: expect.any(String)
      })
    })
  })

  describe('transfer', () => {
    it('should save a transfer transaction', () => {
      const transferData = {
        from: 'John Doe',
        to: 'Jane Smith',
        amount: 75
      }

      const transaction = TransactionActions.transfer(transferData)

      expect(transaction).toEqual({
        from: transferData.from,
        to: transferData.to,
        amount: transferData.amount,
        date: expect.any(String)
      })
    })
  })
})
