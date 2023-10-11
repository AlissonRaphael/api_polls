import prisma from '..'

export class LogErrorPostgresRepository {
  async add (logError: string): Promise<void> {
    await prisma.logError.create({ data: { stack: logError } })
  }
}
