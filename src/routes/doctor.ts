import { Router, Response } from 'express'
import { authenticate, requireRole, AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'

const router = Router()

router.use(authenticate, requireRole('DOCTOR'))

router.get('/referrals', async (_req: AuthRequest, res: Response) => {
  const referrals = await prisma.screening.findMany({
    where: { riskLevel: { in: ['MODERATE', 'HIGH'] } },
    orderBy: { createdAt: 'desc' },
    include: {
      child: { select: { id: true, name: true, dateOfBirth: true } },
    },
  })
  res.json(referrals)
})

router.get('/referrals/:childId', async (req: AuthRequest, res: Response) => {
  const childId = req.params['childId'] as string
  const screenings = await prisma.screening.findMany({
    where: { childId },
    orderBy: { createdAt: 'desc' },
  })
  const child = await prisma.child.findUnique({ where: { id: childId } })
  if (!child) {
    res.status(404).json({ error: 'Child not found' })
    return
  }
  res.json({ child, screenings })
})

router.post('/diagnosis', async (req: AuthRequest, res: Response) => {
  const { childId, severity, notes, carePlan } = req.body as { childId: string; severity: string; notes: string; carePlan: object }
  if (!childId || !severity || !notes || !carePlan) {
    res.status(400).json({ error: 'childId, severity, notes and carePlan are required' })
    return
  }
  const diagnosis = await prisma.diagnosis.create({
    data: { childId, doctorId: req.user!.id, severity, notes, carePlan },
  })
  res.status(201).json(diagnosis)
})

router.get('/diagnosis/:childId', async (req: AuthRequest, res: Response) => {
  const childId = req.params['childId'] as string
  const diagnoses = await prisma.diagnosis.findMany({
    where: { childId },
    orderBy: { createdAt: 'desc' },
    include: { doctor: { select: { email: true } } },
  })
  res.json(diagnoses)
})

export default router
