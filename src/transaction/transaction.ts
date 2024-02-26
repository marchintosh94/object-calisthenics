import { FileManager } from '../utils'
import {
  DepoistAction,
  DepositData,
  TransactionData,
  TransferData,
  WithdrawAction,
  WithdrawData
} from './type'

const _saveTransaction = (
  transaction: Omit<TransactionData, 'date'>
): TransactionData => {
  const _transaction: TransactionData = {
    ...transaction,
    date: new Date().toISOString()
  }

  const payload = FileManager.preparePayload(_transaction)

  FileManager.createUpdateFile({
    folderPath: process.env.DB_FOLDER_PATH,
    fileName: process.env.TRANSACTIONS_FILE,
    payload
  })
  return _transaction
}

const deposit = ({ name, amount }: DepoistAction): TransactionData => {
  const deposit: DepositData = {
    to: name,
    amount
  }
  const transaction = _saveTransaction(deposit)
  return transaction
}

const withdraw = ({ name, amount }: WithdrawAction): TransactionData => {
  const withdraw: WithdrawData = {
    from: name,
    amount
  }
  const transaction = _saveTransaction(withdraw)
  return transaction
}

const transfer = (transferData: TransferData): TransactionData => {
  const transaction = _saveTransaction(transferData)
  return transaction
}

export const TransactionActions = {
  deposit,
  withdraw,
  transfer
}
