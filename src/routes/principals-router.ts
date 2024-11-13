import { Hono } from 'hono'
import { prisma } from '../../prisma/db.js'

const principalsRouter = new Hono()

principalsRouter
  // GET /api/principals
  .get('/', async (c) => {
    const principals = await prisma.principals.findMany()
    return c.json({ principals })
  })

  // GET /api/principals/:id
  .get('/:id', async (c) => {
    const id = c.req.param('id')
    const principal = await prisma.principals.findUnique({
      where: {
        id: Number.parseInt(id),
      },
    })
    return c.json({ principal })
  })

  // POST /api/principals
  .post('/', async (c) => {
    const {
      nama,
      email,
      contact_number,
    } = await c.req.json()

    const principal = await prisma.principals.create({
      data: {
        nama,
        email,
        contact_number,
      },
    })

    return c.json({
      message: 'Created',
      principal,
    })
  })

  // PUT /api/principals/:id
  .put('/:id', async (c) => {
    const id = c.req.param('id')
    const {
      nama,
      email,
      contact_number,
    } = await c.req.json()

    const principal = await prisma.principals.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        nama,
        email,
        contact_number,
      },
    })

    return c.json({
      message: 'Updated',
      principal,
    })
  })

  // DELETE /api/principals/:id
  .delete('/:id', async (c) => {
    const id = c.req.param('id')
    const principal = await prisma.principals.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return c.json({
      message: 'Deleted',
      principal,
    })
  })

export default principalsRouter
