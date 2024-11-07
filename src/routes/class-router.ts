import { Hono } from 'hono'
import { prisma } from '../../prisma/db.js'
// import { Class } from "../db/schemas/class-schema"

const classRouter = new Hono()

classRouter
  // GET /api/classes
  .get('/', async (c) => {
    const classes = await prisma.classes.findMany()

    return c.json({
      classes,
    })
  })
  // GET /api/classes/:id
  .get('/:id', async (c) => {
    const id = c.req.param('id')
    const classData = await prisma.classes.findUnique({
      where: {
        id: Number.parseInt(id),
      },
    })

    return c.json({
      class: classData,
    })
  })
  // POST /api/classes
  .post('/', async (c) => {
    const {
      class_name,
      teacher_id,
    } = await c.req.json()

    await prisma.classes.create({
      data: {
        class_name,
        ...(teacher_id && { teacher_id: Number.parseInt(teacher_id) }),
      },
    })

    return c.json({ message: 'success' })
  })

  // DELETE /api/classes/:id
  .delete('/:id', async (c) => {
    const id = c.req.param('id')
    await prisma.classes.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return c.json({ message: 'success' })
  })

  // PUT /api/classes/:id
  .put('/:id', async (c) => {
    const id = c.req.param('id')
    const {
      class_name,
      teacher_id,
    } = await c.req.json()

    await prisma.classes.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        class_name,
        teacher_id,
      },
    })

    return c.json({ message: 'success' })
  })

export default classRouter
