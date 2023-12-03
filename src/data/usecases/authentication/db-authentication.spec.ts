import { DbAuthentication } from './db-authentication'
import { type AccountModel } from '../add-account/protocols'
import { type LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'

const makeDbAuthentication = (): any => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      const account: AccountModel = {
        id: 1,
        name: 'any_name',
        email: 'any_email@valid_domain.com',
        password: 'any_passowrd',
        createdAt: new Date()
      }
      return await new Promise(resolve => { resolve(account) })
    }
  }

  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
  return {
    create: () => new DbAuthentication(loadAccountByEmailRepositoryStub),
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { create, loadAccountByEmailRepositoryStub } = makeDbAuthentication()
    const dbAuthentication = create()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await dbAuthentication.auth({
      email: 'any_email@valid_domain.com',
      passowrd: 'any_passowrd'
    })
    expect(loadSpy).toHaveBeenCalledWith('any_email@valid_domain.com')
  })
})
