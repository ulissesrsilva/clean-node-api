import { AddAccountRepository } from '../../protocols/add-account-repository'
import { AccountModel, AddAcount, AddAcountModel, Encrypter } from './db-add-account-protocols'
export class DbAddAcount implements AddAcount {
    private readonly encrypter: Encrypter
    private readonly addAccountRepository: AddAccountRepository

    constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
        this.encrypter = encrypter
        this.addAccountRepository = addAccountRepository
    }

    async add (accountData: AddAcountModel): Promise<AccountModel | null> {
        const hashedPass = await this.encrypter.encrypt(accountData.password)
        const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPass }))
        return await new Promise((resolve) => { resolve(new Promise((resolve) => resolve(account))) })
    }
}
