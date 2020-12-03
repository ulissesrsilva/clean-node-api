import { AccountModel } from '../models/account'

export interface AddAcountModel {
    name: string
    password: string
    email: string
}

export interface AddAcount {
    add: (account: AddAcountModel) => Promise<AccountModel | null>
}
