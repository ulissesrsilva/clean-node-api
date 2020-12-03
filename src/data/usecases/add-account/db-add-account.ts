import { AccountModel, AddAcount, AddAcountModel, Encrypter } from './db-add-account-protocols'
export class DbAddAcount implements AddAcount {
    private readonly encrypter: Encrypter

    constructor (encrypter: Encrypter) {
        this.encrypter = encrypter
    }

    async add (account: AddAcountModel): Promise<AccountModel | null> {
        // const accountCreated = new AccountModel()
         await this.encrypter.encrypt(account.password)
        return await new Promise((resolve) => { resolve(new Promise((resolve) => resolve(null))) })
    }
}
