import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAcountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helper/mongodb-helper'

export class AccountMongoRepository implements AddAccountRepository {
    async add (accountData: AddAcountModel): Promise<AccountModel> {
        const accountCollection = MongoHelper.getCollection('accounts')
        const result = await accountCollection.insertOne(accountData)
        console.log(result)
        const account = result.ops[0]
        return account
    }
}
