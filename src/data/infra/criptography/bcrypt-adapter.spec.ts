import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => { resolve('hash') })
  }
}))

const SALT = 12
const bcryptAdapter = (): any => {
  return {
    create: () => new BcryptAdapter(SALT)
  }
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const bcryptAdapterTest = bcryptAdapter().create()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await bcryptAdapterTest.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', SALT)
  })

  test('Should throw if bcrypt throws', async () => {
    const bcryptAdapterTest = bcryptAdapter().create()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = bcryptAdapterTest.encrypt('any_value')
    await expect(promise).rejects.toThrow()
  })

  test('Should return a hash on success', async () => {
    const bcryptAdapterTest = bcryptAdapter().create()
    const hash = await bcryptAdapterTest.encrypt('any_value')
    expect(hash).toBe('hash')
  })
})
