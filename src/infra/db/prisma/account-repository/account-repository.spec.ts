import { prisma } from '..'
import { AccountPostgresRepository } from './account-repository'

jest.spyOn(prisma.account, 'create').mockResolvedValue({
  id: 1,
  name: 'any_name',
  email: 'any_email@domain.com',
  password: '12345',
  createdAt: new Date(Date.now())
})

describe('Account Postgres Repository', () => {
  test('Should return an account on success', async () => {
    const accountPostgresRepository = new AccountPostgresRepository()
    const account = await accountPostgresRepository.add({
      name: 'any_name',
      email: 'any_email@domain.com',
      password: '12345'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBe(1)
    expect(account.name).toMatch('any_name')
    expect(account.email).toMatch('any_email@domain.com')
    expect(account.password).toMatch('12345')
  })
})
