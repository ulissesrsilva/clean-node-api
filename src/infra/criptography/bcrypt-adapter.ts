import { Encrypter } from '../../data/protocols/encrypter'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {
    private readonly salt: number
    constructor (salt: number) {
        this.salt = salt
    }

   async encrypt (value: string): Promise<string> {
        const crypt = await bcrypt.hash(value, this.salt)
        return await new Promise((resolve, reject) => { resolve(crypt) })
   }
}
