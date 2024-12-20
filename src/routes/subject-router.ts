import { Hono } from 'hono'
import { prisma } from '../../prisma/db.js'
// import { Subject } from "../db/schemas/subject-schema"

const subjectRouter = new Hono()

subjectRouter
  // GET /api/subjects
  .get('/', async (c) => {
    const subjects = await prisma.subjects.findMany()

    return c.json({ subjects })
  })

  // GET /api/subjects/:id
  .get('/:id', async (c) => {
    const id = c.req.param('id')
    const subject = await prisma.subjects.findUnique({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!subject) {
      return c.json({
        message: 'Subject not found',
      }, 404)
    }

    return c.json({ subject })
  })

  // POST /api/subjects
  .post('/', async (c) => {
    const {
      subject_name,
    } = await c.req.json()

    const subject = await prisma.subjects.create({
      data: {
        subject_name,
      },
    })

    return c.json({
      message: 'Created',
      subject,
    })
  })

  // PUT /api/subjects/:id
  .put('/:id', async (c) => {
    const id = c.req.param('id')
    const {
      subject_name,
    } = await c.req.json()

    let subject = await prisma.subjects.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!subject) {
      return c.json({
        message: 'Subject not found',
      }, 404)
    }

    subject = await prisma.subjects.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        subject_name,
      },
    })

    return c.json({
      message: 'Updated',
      subject,
    })
  })

  // DELETE /api/subjects/:id
  .delete('/:id', async (c) => {
    const id = c.req.param('id')

    let subject = await prisma.subjects.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!subject) {
      return c.json({
        message: 'Subject not found',
      }, 404)
    }

    subject = await prisma.subjects.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return c.json({
      message: 'Deleted',
      subject,
    })
  })

export default subjectRouter
