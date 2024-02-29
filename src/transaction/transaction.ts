import {
  FileManager,
  hasBothAccounts,
  hasOnlyFromAccount,
  hasMatchingAccount,
  hasOnlyToAccount
} from '../utils'
import {
  DepoistAction,
  DepositData,
  StatementData,
  TransactionData,
  TransactionFilter,
  TransactionTypes,
  TransferData,
  WithdrawAction,
  WithdrawData
} from './type'

const getTransactions = (): TransactionData[] => {
  const transactions = FileManager.readFileSync<TransactionData[]>({
    folderPath: process.env.DB_FOLDER_PATH,
    fileName: process.env.TRANSACTIONS_FILE
  })

  return transactions || []
}

const saveTransaction = (
  transaction: Omit<TransactionData, 'date'>
): TransactionData => {
  const _transaction: TransactionData = {
    ...transaction,
    date: Date.now()
  }
  const savedTransactions = getTransactions()
  const payload = FileManager.preparePayload([
    ...savedTransactions,
    _transaction
  ])

  FileManager.createUpdateFile({
    folderPath: process.env.DB_FOLDER_PATH,
    fileName: process.env.TRANSACTIONS_FILE,
    payload
  })
  return _transaction
}

const deposit = ({ name, amount }: DepoistAction): TransactionData => {
  const depositData: DepositData = {
    to: name,
    amount
  }
  const transaction = saveTransaction(depositData)
  return transaction
}

const withdraw = ({ name, amount }: WithdrawAction): TransactionData => {
  const withdrawData: WithdrawData = {
    from: name,
    amount
  }
  const transaction = saveTransaction(withdrawData)
  return transaction
}

const transfer = (transferData: TransferData): TransactionData => {
  const transaction = saveTransaction(transferData)
  return transaction
}

const searchTransactions = ({
  date,
  type,
  account
}: TransactionFilter): StatementData[] => {
  const transactions = getTransactions()
  const filteredTransactions = transactions.filter((transaction) => {
    let isValid = true
    if (
      date &&
      new Date(transaction.date).toDateString() !==
        new Date(date).toDateString()
    ) {
      return false
    }
    if (account) {
      isValid = hasMatchingAccount(transaction, account)
    }
    if (type === TransactionTypes.transfer) {
      isValid = hasBothAccounts(transaction)
    }
    if (type === TransactionTypes.withdraw) {
      isValid = hasOnlyFromAccount(transaction)
    }
    if (type === TransactionTypes.deposit) {
      isValid = hasOnlyToAccount(transaction)
    }

    return isValid
  })
  let balance = 0
  return filteredTransactions.map((transaction) => {
    if (transaction.to === account) {
      balance += transaction.amount
    }
    if (transaction.from === account) {
      balance -= transaction.amount
    }
    return {
      ...transaction,
      balance
    }
  })
}

export const TransactionActions = {
  deposit,
  withdraw,
  transfer,
  searchTransactions
}
