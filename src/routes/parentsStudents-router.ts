import { Hono } from 'hono'
import { prisma } from '../../prisma/db.js'

const parentsStudentsRouter = new Hono()

parentsStudentsRouter
  .get('/', async (c) => {
    const parentsStudents = await prisma.parents_students.findMany()

    return c.json({
      parents_students: parentsStudents,
    })
  })

  .get('/:id', async (c) => {
    const id = c.req.param('id')
    const parentStudent = await prisma.parents_students.findUnique({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!parentStudent) {
      return c.json({
        message: 'Parent student not found',
      }, 404)
    }

    return c.json({ parent_student: parentStudent })
  })

  .post('/', async (c) => {
    const {
      parent_id,
      student_id,
      relationship,
    } = await c.req.json()

    const parentStudent = await prisma.parents_students.create({
      data: {
        parent_id,
        student_id,
        relationship,
      },
    })

    return c.json({
      message: 'Created',
      parent_student: parentStudent,
    })
  })

  .put('/', async (c) => {
    const {
      parent_id,
      student_id,
      old_parent_id,
      old_student_id,
      relationship,
    } = await c.req.json()

    let parentStudent

    if (old_parent_id) {
      parentStudent = await prisma.parents_students.findFirst({
        where: {
          student_id,
          parent_id: old_parent_id,
        },
        select: {
          id: true,
        },
      })
    }
    else if (old_student_id) {
      parentStudent = await prisma.parents_students.findFirst({
        where: {
          student_id,
          parent_id: old_parent_id,
        },
        select: {
          id: true,
        },
      })
    }

    await prisma.parents_students.update({
      where: {
        id: parentStudent?.id,
      },
      data: {
        parent_id,
        student_id,
        relationship,
      },
    })

    return c.json({
      message: 'Updated',
    })
  })

export default parentsStudentsRouter
