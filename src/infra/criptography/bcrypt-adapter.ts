import bcrypt from 'bcrypt'
import { type Encrypter } from '../../data/protocols/criptography/encrypter'

export class BcryptAdapter implements Encrypter {
  constructor (private readonly salt: number) {}

  async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
