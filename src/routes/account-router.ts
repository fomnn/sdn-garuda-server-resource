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
      }, 404)
    }

    return c.json({ account })
  })

  .post('/', async (c) => {
    const {
      email,
      password,
      type,
      user_id,
    } = await c.req.json()

    const accountConflicted = await prisma.accounts.findUnique({
      where: {
        email,
      },
    })

    if (accountConflicted) {
      return c.json({
        message: 'Email already taken, use another email',
      }, 409)
    }

    const account = await prisma.accounts.create({
      data: {
        email,
        password,
        type,
        user_id,
      },
    })

    return c.json({
      message: 'Created',
      account,
    })
  })

  // PUT /api/accounts
  .put('/:id', async (c) => {
    const id = c.req.param('id')

    const {
      email,
      password,
    } = await c.req.json()

    let account = await prisma.accounts.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!account) {
      return c.json({
        message: 'Account not found',
      }, 404)
    }

    account = await prisma.accounts.findUnique({
      where: {
        email,
      },
    })

    if (account) {
      return c.json({
        message: 'Email already taken, use another email',
      }, 409)
    }

    account = await prisma.accounts.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        email,
        password,
      },
    })

    return c.json({
      message: 'Updated',
      account,
    })
  })

  .delete('/:id', async (c) => {
    const id = c.req.param('id')

    const account = await prisma.accounts.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!account) {
      return c.json({
        message: 'Account not found',
      }, 404)
    }

    await prisma.accounts.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return c.json({
      message: 'Deleted',
      account,
    })
  })

export default accountRouter
