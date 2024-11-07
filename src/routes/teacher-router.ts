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
    } = await c.req.json()

    await prisma.teachers.create({
      data: {
        nama,
        jenis_kelamin,
        NIP,
        tanggal_lahir,
        NUPTK,
      },
    })

    return c.json({ message: 'success' })
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
    } = await c.req.json()

    const teacher = await prisma.teachers.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        nama,
        jenis_kelamin,
        NIP,
        NUPTK,
        tanggal_lahir: new Date(tanggal_lahir),
      },
    })

    return c.json({ message: 'success' })
  })

  // DELETE /api/teachers/:id
  .delete('/:id', async (c) => {
    const id = c.req.param('id')
    const teacher = await prisma.teachers.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return c.json({ message: 'success' })
  })

export default teacherRouter
