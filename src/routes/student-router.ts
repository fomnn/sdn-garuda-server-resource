import { Hono } from 'hono'
import { prisma } from '../../prisma/db.js'
// import { Student } from "../db/schemas/student-schema"

const studentRouter = new Hono()

studentRouter
  // GET /api/students
  .get('/', async (c) => {
    // const student = await Student.find()
    // return c.json(student)
    const students = await prisma.students.findMany()

    return c.json({ students })
  })

  // GET /api/students/:id
  .get('/:id', async (c) => {
    const id = c.req.param('id')
    const student = await prisma.students.findUnique({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!student) {
      return c.json({
        message: 'Student not found',
      }, 404)
    }

    return c.json({ student })
  })

  // POST /api/students
  .post('/', async (c) => {
    const {
      nama,
      NISN,
      jenis_kelamin,
    } = await c.req.json()

    let student = await prisma.students.findUnique({
      where: {
        NISN,
      },
    })

    if (student) {
      return c.json({
        message: 'NISN already used',
      }, 409)
    }

    student = await prisma.students.create({
      data: {
        nama,
        jenis_kelamin,
        NISN,
      },
    })

    return c.json({ message: 'success', student })
  })

  // PUT /api/students/:id
  .put('/:id', async (c) => {
    const id = c.req.param('id')
    const {
      nama,
      NISN,
      jenis_kelamin,
    } = await c.req.json()

    let student = await prisma.students.findUnique({
      where: {
        NISN,
        NOT: {
          id: Number.parseInt(id),
        },
      },
    })

    if (student) {
      return c.json({
        message: 'NISN already used',
      }, 409)
    }

    student = await prisma.students.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!student) {
      return c.json({
        message: 'Student not found',
      }, 404)
    }

    student = await prisma.students.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        nama,
        NISN,
        jenis_kelamin,
      },
    })

    return c.json({ message: 'success', student })
  })

  // DELETE /api/students/:id
  .delete('/:id', async (c) => {
    const id = c.req.param('id')
    const student = await prisma.students.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!student) {
      return c.json({
        message: 'Student not found',
      }, 404)
    }

    await prisma.students.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return c.json({ message: 'success', student })
  })

export default studentRouter
