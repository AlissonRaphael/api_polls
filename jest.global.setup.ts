import { promisify } from 'util'
import { config } from 'dotenv'
import { exec } from 'child_process'

const prismaBinary = './node_modules/.bin/prisma'

export default async (): Promise<void> => {
  config({ path: '.env.test' })
  const execSync = promisify(exec)
  await execSync(`${prismaBinary} migrate deploy`)
}
