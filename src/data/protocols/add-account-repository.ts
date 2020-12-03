import { AddAcountModel } from '../../domain/usecases/add-account'
import { AccountModel } from '../../domain/models/account'

export interface AddAccountRepository {
    add: (accountData: AddAcountModel) => Promise<AccountModel>
}
