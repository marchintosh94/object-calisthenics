import fs from 'fs'
import dotenv from 'dotenv'
import { TransactionActions } from '../../transaction/transaction'
import { StatementData, TransactionFilter } from '../../transaction/type'

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
        date: expect.any(Number)
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
        date: expect.any(Number)
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
        date: expect.any(Number)
      })
    })
  })

  describe('searchTransactions', () => {
    const transactions: StatementData[] = [
      {
        from: 'John Doe',
        amount: 100,
        date: new Date('2022-01-01').getTime(),
        balance: expect.any(Number)
      },
      {
        from: 'John Doe',
        to: 'Jane Smith',
        amount: 50,
        date: new Date('2023-10-13').getTime(),
        balance: expect.any(Number)
      },
      {
        to: 'Jane Smith',
        amount: 75,
        date: new Date('2024-05-18').getTime(),
        balance: expect.any(Number)
      }
    ]

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('should filter transactions by date and type => transfer', () => {
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValueOnce(JSON.stringify(transactions))

      const filter: TransactionFilter = {
        date: '2023-10-13',
        type: 'transfer',
        account: 'Jane Smith'
      }

      const filteredTransactions = TransactionActions.searchTransactions(filter)

      expect(filteredTransactions).toEqual([transactions[1]])
    })

    it('should filter transactions by type => deposit', () => {
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValueOnce(JSON.stringify(transactions))

      const filter: TransactionFilter = {
        type: 'deposit',
        account: 'Jane Smith'
      }

      const filteredTransactions = TransactionActions.searchTransactions(filter)

      expect(filteredTransactions).toEqual([transactions[2]])
    })

    it('should filter transactions by type => withdraw', () => {
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValueOnce(JSON.stringify(transactions))

      const filter: TransactionFilter = {
        type: 'withdraw',
        account: 'John Doe'
      }

      const filteredTransactions = TransactionActions.searchTransactions(filter)

      expect(filteredTransactions).toEqual([transactions[0]])
    })

    it('should filter transactions by account and type => withdraw', () => {
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValueOnce(JSON.stringify(transactions))

      const filter: TransactionFilter = {
        type: 'withdraw',
        account: 'John Doe'
      }

      const filteredTransactions = TransactionActions.searchTransactions(filter)

      expect(filteredTransactions).toEqual([transactions[0]])
    })

    it('should return transactions list for an account', () => {
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValueOnce(JSON.stringify(transactions))

      const filteredTransactions = TransactionActions.searchTransactions({
        account: 'John Doe'
      })

      expect(filteredTransactions).toEqual([transactions[0], transactions[1]])
    })
  })
})
