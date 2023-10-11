import prisma from '..'
import { LogErrorPostgresRepository } from './log-repository'

describe('LogError Postgres Repository', () => {
  afterEach(async () => {
    await prisma.$queryRaw`TRUNCATE TABLE "LogError";`
  })

  test('Should create an error log on success', async () => {
    const logErrorPostgresRepository = new LogErrorPostgresRepository()
    const logError = 'any_stack'
    await logErrorPostgresRepository.add(logError)

    const count = await prisma.logError.count()
    expect(count).toBe(1)
  })
})
