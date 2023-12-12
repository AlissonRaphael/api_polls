import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => { resolve('hash') })
  },

  async compare (): Promise<boolean> {
    return await new Promise(resolve => { resolve(true) })
  }
}))

const SALT = 12
const makeBcryptAdapter = (): any => {
  return {
    create: () => new BcryptAdapter(SALT)
  }
}

describe('Bcrypt Adapter', () => {
  test('Should call hash with correct values', async () => {
    const bcryptAdapter = makeBcryptAdapter().create()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await bcryptAdapter.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', SALT)
  })

  test('Should throw if bcrypt throws', async () => {
    const bcryptAdapter = makeBcryptAdapter().create()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = bcryptAdapter.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  test('Should return a valid hash on success', async () => {
    const bcryptAdapter = makeBcryptAdapter().create()
    const hash = await bcryptAdapter.hash('any_value')
    expect(hash).toBe('hash')
  })

  test('Should call compare with correct values', async () => {
    const bcryptAdapter = makeBcryptAdapter().create()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await bcryptAdapter.compare('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  test('Should return false when compare fails', async () => {
    const bcryptAdapter = makeBcryptAdapter().create()
    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise(resolve => { resolve(false) }))
    const isValid = await bcryptAdapter.compare('any_value', 'any_hash')
    expect(isValid).toBe(false)
  })

  test('Should return true when compare succeeds', async () => {
    const bcryptAdapterTest = makeBcryptAdapter().create()
    const isValid = await bcryptAdapterTest.compare('any_value', 'any_hash')
    expect(isValid).toBe(true)
  })
})
