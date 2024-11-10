import { Hono } from 'hono'
import { prisma } from '../../prisma/db.js'

const accountRouter = new Hono()

accountRouter
  // GET /api/accounts
  .get('/', async (c) => {
    const accounts = await prisma.accounts.findMany()

    return c.json({ accounts })
  })

  // GET /api/accounts/:id
  .get('/:id', async (c) => {
    const id = c.req.param('id')

    const account = await prisma.accounts.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!account) {
      return c.json({
        message: 'Account not found',
      }, 400)
    }

    return c.json({ account })
  })

  // PUT /api/accounts
  .put('/:id', async (c) => {
    const id = c.req.param('id')

    const {
      email,
      password,
    } = await c.req.json()

    const account = await prisma.accounts.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!account) {
      return c.json({
        message: 'Account not found',
      }, 400)
    }

    await prisma.accounts.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        email,
        password,
      },
    })

    return c.json({ message: 'updated', account })
  })

export default accountRouter
