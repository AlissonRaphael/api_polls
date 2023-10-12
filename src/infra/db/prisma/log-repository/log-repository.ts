import prisma from '..'
import { type LogErrorRepository } from '../../../../data/protocols/log-error-repository'

export class LogErrorPostgresRepository implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    await prisma.logError.create({ data: { stack } })
  }
}
