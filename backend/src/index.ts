import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { prisma } from './lib/prisma'

import authRoutes from './routes/auth'
import childrenRoutes from './routes/children'
import screeningRoutes from './routes/screening'
import therapyRoutes from './routes/therapy'
import doctorRoutes from './routes/doctor'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/health', async (_, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() })
  } catch (err: any) {
    res.status(503).json({ status: 'error', db: 'disconnected', error: err.message })
  }
})

app.use('/auth', authRoutes)
app.use('/children', childrenRoutes)
app.use('/screening', screeningRoutes)
app.use('/therapy', therapyRoutes)
app.use('/doctor', doctorRoutes)

app.listen(PORT, () => console.log(`Intambwe API running on port ${PORT}`))
