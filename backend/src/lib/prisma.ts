import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv'

dotenv.config()

const adapter = new PrismaPg(
  { connectionString: process.env.DATABASE_URL! },
  { ssl: { rejectUnauthorized: false } },
)
export const prisma = new PrismaClient({ adapter })
