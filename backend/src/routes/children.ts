import { Router, Response } from 'express'
import { authenticate, requireRole, AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'

const router = Router()

router.use(authenticate)

router.post('/', requireRole('PARENT'), async (req: AuthRequest, res: Response) => {
  const { name, dateOfBirth } = req.body
  if (!name || !dateOfBirth) {
    res.status(400).json({ error: 'name and dateOfBirth are required' })
    return
  }
  const child = await prisma.child.create({
    data: { name, dateOfBirth: new Date(dateOfBirth), parentId: req.user!.id },
  })
  res.status(201).json(child)
})

router.get('/', requireRole('PARENT'), async (req: AuthRequest, res: Response) => {
  const children = await prisma.child.findMany({
    where: { parentId: req.user!.id },
    include: { screenings: { orderBy: { createdAt: 'desc' }, take: 1 } },
  })
  res.json(children)
})

router.post('/:id/activity-log', requireRole('PARENT'), async (req: AuthRequest, res: Response) => {
  const child = await prisma.child.findFirst({ where: { id: req.params['id'], parentId: req.user!.id } })
  if (!child) { res.status(404).json({ error: 'Child not found' }); return }
  const { exerciseType, notes } = req.body
  if (!exerciseType) { res.status(400).json({ error: 'exerciseType is required' }); return }
  const log = await prisma.therapyLog.create({
    data: { childId: child.id, exerciseType, notes },
  })
  res.status(201).json(log)
})

router.get('/:id/activity-log', requireRole('PARENT', 'DOCTOR'), async (req: AuthRequest, res: Response) => {
  const logs = await prisma.therapyLog.findMany({
    where: { childId: req.params['id'] },
    orderBy: { completedAt: 'desc' },
    take: 100,
  })
  res.json(logs)
})

router.delete('/:id/activity-log/:domain', requireRole('PARENT'), async (req: AuthRequest, res: Response) => {
  const child = await prisma.child.findFirst({ where: { id: req.params['id'], parentId: req.user!.id } })
  if (!child) { res.status(404).json({ error: 'Child not found' }); return }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const log = await prisma.therapyLog.findFirst({
    where: {
      childId: child.id,
      exerciseType: req.params['domain'],
      completedAt: { gte: today },
    },
    orderBy: { completedAt: 'desc' },
  })
  if (log) await prisma.therapyLog.delete({ where: { id: log.id } })
  res.json({ ok: true })
})

export default router
