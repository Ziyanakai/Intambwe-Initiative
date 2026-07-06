import { Router, Response } from 'express'
import { authenticate, requireRole, AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'

const router = Router()

router.use(authenticate)

const DEFAULT_ACTIVITIES = [
  { id: 'picture-matching', title: 'Picture Matching', goal: 'Improve visual recognition', instructions: 'Show the child 3 picture cards. Ask them to match identical pictures. Repeat with different cards.' },
  { id: 'emotion-recognition', title: 'Emotion Recognition', goal: 'Identify emotions', instructions: 'Show pictures of faces expressing different emotions. Ask the child to name each emotion.' },
  { id: 'communication-practice', title: 'Communication Practice', goal: 'Improve expressive language', instructions: 'Point to objects around the room. Encourage the child to say the name of each object.' },
  { id: 'following-instructions', title: 'Following Instructions', goal: 'Improve attention and understanding', instructions: 'Give simple one-step instructions (e.g. "Touch your nose"). Gradually increase to two steps.' },
  { id: 'social-interaction', title: 'Social Interaction Practice', goal: 'Build interaction skills', instructions: 'Take turns rolling a ball back and forth. Praise the child each time they participate.' },
]

router.get('/:childId/today', requireRole('PARENT'), async (req: AuthRequest, res: Response) => {
  const childId = req.params['childId'] as string
  const child = await prisma.child.findFirst({ where: { id: childId, parentId: req.user!.id } })
  if (!child) {
    res.status(404).json({ error: 'Child not found' })
    return
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const completedToday = await prisma.therapyLog.findMany({
    where: { childId, completedAt: { gte: today } },
    select: { exerciseType: true },
  })
  const completedIds = completedToday.map((l) => l.exerciseType)
  const activities = DEFAULT_ACTIVITIES.map((a) => ({ ...a, completed: completedIds.includes(a.id) }))
  res.json(activities)
})

router.post('/log', requireRole('PARENT'), async (req: AuthRequest, res: Response) => {
  const { childId, exerciseType, notes } = req.body as { childId: string; exerciseType: string; notes?: string }
  if (!childId || !exerciseType) {
    res.status(400).json({ error: 'childId and exerciseType are required' })
    return
  }
  const child = await prisma.child.findFirst({ where: { id: childId, parentId: req.user!.id } })
  if (!child) {
    res.status(404).json({ error: 'Child not found' })
    return
  }
  const log = await prisma.therapyLog.create({ data: { childId, exerciseType, notes } })
  res.status(201).json(log)
})

router.get('/:childId/progress', requireRole('PARENT', 'DOCTOR'), async (req: AuthRequest, res: Response) => {
  const childId = req.params['childId'] as string
  const logs = await prisma.therapyLog.findMany({
    where: { childId },
    orderBy: { completedAt: 'asc' },
  })
  res.json(logs)
})

export default router
