import { input, select } from '@inquirer/prompts'
import { TransactionActions } from './transaction/transaction'
import { TransactionType } from './transaction/type'

type OperationType = 'deposit' | 'withdraw' | 'transfer' | 'display' | 'exit'

const getTransactionInfo = async () => {
  const mainAccount: string = await input({
    message: 'Enter your account name:',
    validate: (value) => {
      if (value) {
        return true
      }
      return 'Account name is required'
    }
  })
  const amount: string = await input({
    message: 'Enter amount:',
    validate: (value) => {
      if (value && !isNaN(Number(value))) {
        return true
      }
      return 'Amount is required'
    }
  })
  return { name: mainAccount, amount: Number(amount) }
}

const deposit = async () => {
  const { name, amount } = await getTransactionInfo()
  TransactionActions.deposit({ name, amount })
  console.log(`Deposited ${amount} to ${name}`)
}
const withdraw = async () => {
  const { name, amount } = await getTransactionInfo()
  TransactionActions.withdraw({ name, amount })
  console.log(`Withdrew ${amount} from ${name}`)
}
const transfer = async () => {
  const { name, amount } = await getTransactionInfo()
  const otherAccount: string = await input({
    message: 'Enter other account name:',
    validate: (value) => {
      if (value) {
        return true
      }
      return 'Account name is required'
    }
  })
  TransactionActions.transfer({ from: name, to: otherAccount, amount })
  console.log(`Transferred ${amount} from ${name} to ${otherAccount}`)
}
const getAccountStatement = async () => {
  const account: string = await input({
    message: 'Enter your account name:',
    validate: (value) => {
      if (value) {
        return true
      }
      return 'Account name is required'
    }
  })
  const type: TransactionType | undefined = await select({
    message: 'Select an transaction type',
    choices: [
      { name: 'All', value: undefined },
      { name: 'Deposit', value: 'deposit' },
      { name: 'Withdraw', value: 'withdraw' },
      { name: 'Transfer', value: 'transfer' }
    ]
  })
  const transactions = TransactionActions.searchTransactions({ account, type })
  const mappedTransactions = transactions.map((transaction) => ({
    ...transaction,
    date: new Date(transaction.date).toDateString()
  }))
  console.table(mappedTransactions, ['from', 'to', 'amount', 'date', 'balance'])
}

export const startBankApp = async () => {
  try {
    const choice: OperationType = await select({
      message: 'Select an operation',
      choices: [
        { name: 'Deposit', value: 'deposit' },
        { name: 'Withdraw', value: 'withdraw' },
        { name: 'Transfer', value: 'transfer' },
        { name: 'Display transactions', value: 'display' },
        { name: 'Exit', value: 'exit' }
      ]
    })
    switch (choice) {
      case 'deposit':
        console.log('Start Deposit')
        await deposit()
        break
      case 'withdraw':
        console.log('Start Withdraw')
        await withdraw()
        break
      case 'transfer':
        console.log('Start Transfer')
        await transfer()
        break
      case 'display':
        console.log('Display')
        await getAccountStatement()
        break
      case 'exit':
        console.log('See ya!')
        return
    }
    startBankApp()
  } catch (error) {
    return
  }
}
