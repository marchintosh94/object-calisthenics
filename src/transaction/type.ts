export interface TransactionData {
  from?: string
  to?: string
  amount: number
  date: string
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
