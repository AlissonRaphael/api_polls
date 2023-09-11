import { DbAddAccount } from './db-add-account'

describe('DbAddAccount Usecase', () => {
  test('Should call encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => { resolve('hashed_password') })
      }
    }

    const encrypterStub = new EncrypterStub()
    const addAccount = new DbAddAccount(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await addAccount.add({
      name: 'Bob',
      email: 'valid_email@domain.com',
      password: '12345'
    })
    expect(encryptSpy).toHaveBeenCalledWith('12345')
  })
})
