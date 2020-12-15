import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/AccountMongoRepository'
import { DbAddAcount } from '../../data/usecases/add-account/db-add-account'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): Controller => {
    const emailValidor = new EmailValidatorAdapter()
    const bcryptAdapter = new BcryptAdapter(12)
    const accountMongo = new AccountMongoRepository()
    const dbAddAcount = new DbAddAcount(bcryptAdapter, accountMongo)
    const signUpControllerCreation = new SignUpController(emailValidor, dbAddAcount)
    return new LogControllerDecorator(signUpControllerCreation)
}
