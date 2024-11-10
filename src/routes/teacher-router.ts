import { Hono } from 'hono'
import { prisma } from '../../prisma/db.js'
// import { Teacher } from "../db/schemas/teacher-schema"

const teacherRouter = new Hono()

teacherRouter
  // GET /api/teachers
  .get('/', async (c) => {
    // const teacher = await Teacher.find()
    // return c.json(teacher)
    const teachers = await prisma.teachers.findMany()

    return c.json({ teachers })
  })

  // GET /api/teachers/:id
  .get('/:id', async (c) => {
    const id = c.req.param('id')
    const teacher = await prisma.teachers.findUnique({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!teacher) {
      return c.json({
        message: 'Teacher not found',
      }, 400)
    }

    return c.json({ teacher })
  })

  // POST /api/teachers
  .post('/', async (c) => {
    const {
      nama,
      jenis_kelamin,
      NIP,
      NUPTK,
      tanggal_lahir,
      email,
    } = await c.req.json()

    let teacher = await prisma.teachers.findFirst({
      where: {
        OR: [
          { email },
          { NIP },
          { NUPTK },
        ],
      },
    })

    if (teacher) {
      return c.json({
        message: 'email, NIP, or NUPTK is conflicted',
      }, 409)
    }

    teacher = await prisma.teachers.create({
      data: {
        nama,
        jenis_kelamin,
        NIP,
        tanggal_lahir,
        NUPTK,
        email,
      },
    })

    return c.json({ message: 'Created', teacher })
  })

  // PUT /api/teachers/:id
  .put('/:id', async (c) => {
    const id = c.req.param('id')
    const {
      nama,
      jenis_kelamin,
      NIP,
      NUPTK,
      tanggal_lahir,
      email,
    } = await c.req.json()

    let teacher = await prisma.teachers.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!teacher) {
      return c.json({
        message: 'Teacher not found',
      }, 400)
    }

    teacher = await prisma.teachers.findFirst({
      where: {
        AND: [
          {
            OR: [
              { email },
              { NIP },
              { NUPTK },
            ],
          },
          {
            NOT: {
              id: Number.parseInt(id),
            },
          },
        ],
      },
    })

    if (teacher) {
      return c.json({
        message: 'email, NIP, or NUPTK is conflicted',
      }, 409)
    }

    teacher = await prisma.teachers.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        nama,
        jenis_kelamin,
        NIP,
        NUPTK,
        email,
        tanggal_lahir: new Date(tanggal_lahir),
      },
    })

    return c.json({ message: 'Updated', teacher })
  })

  // DELETE /api/teachers/:id
  .delete('/:id', async (c) => {
    const id = c.req.param('id')

    const teacher = await prisma.teachers.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!teacher) {
      return c.json({
        message: 'Teacher not found',
      }, 400)
    }

    await prisma.teachers.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return c.json({ message: 'Deleted', teacher })
  })

export default teacherRouter
