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

export default router
