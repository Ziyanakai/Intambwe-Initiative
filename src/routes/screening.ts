import { Router, Response } from 'express'
import { authenticate, requireRole, AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'

const router = Router()

router.use(authenticate)

function calculateRisk(answers: Record<string, boolean>) {
  const flagged = Object.values(answers).filter((v) => v === false).length
  if (flagged >= 4) return 'HIGH'
  if (flagged >= 2) return 'MODERATE'
  return 'LOW'
}

router.post('/', requireRole('PARENT'), async (req: AuthRequest, res: Response) => {
  const { childId, answers } = req.body
  if (!childId || !answers) {
    res.status(400).json({ error: 'childId and answers are required' })
    return
  }
  const child = await prisma.child.findFirst({ where: { id: childId, parentId: req.user!.id } })
  if (!child) {
    res.status(404).json({ error: 'Child not found' })
    return
  }
  const riskLevel = calculateRisk(answers) as 'LOW' | 'MODERATE' | 'HIGH'
  const screening = await prisma.screening.create({ data: { childId, answers, riskLevel } })
  res.status(201).json(screening)
})

router.get('/:childId', requireRole('PARENT', 'DOCTOR'), async (req: AuthRequest, res: Response) => {
  const screenings = await prisma.screening.findMany({
    where: { childId: req.params['childId'] as string },
    orderBy: { createdAt: 'desc' },
  })
  res.json(screenings)
})

export default router
