import prisma from '..'
import { AccountPostgresRepository } from './account-repository'

afterEach(async () => {
  const resetAccount = prisma.$queryRaw`TRUNCATE TABLE "Account";`
  const resetAccountIds = prisma.$queryRaw`ALTER SEQUENCE "Account_id_seq" RESTART WITH 1;`
  await prisma.$transaction([
    resetAccount,
    resetAccountIds
  ])
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
