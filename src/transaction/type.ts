export interface TransactionData {
  from?: string
  to?: string
  amount: number
  date: number
}
export interface StatementData extends TransactionData {
  balance: number
}
export interface DepoistAction {
  name: string
  amount: number
}
export interface DepositData {
  to: string
  amount: number
}

export interface WithdrawAction extends DepoistAction {}
export interface WithdrawData {
  from: string
  amount: number
}

export interface TransferData {
  from: string
  to: string
  amount: number
}

export enum TransactionTypes {
  deposit = 'deposit',
  withdraw = 'withdraw',
  transfer = 'transfer'
}
export type TransactionType = keyof typeof TransactionTypes
export interface TransactionFilter {
  type?: TransactionType
  account: string
  date?: string
}
