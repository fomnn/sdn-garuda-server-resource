import { Hono } from "hono"
import { prisma } from "@/prisma/db"
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
      }
    })

    return c.json({ teacher })
  })

  // POST /api/teachers
  .post('/', async (c) => {
    const {
      nama,
      jenis_kelamin,
      NIP,
      NUPTK
    } = await c.req.json()

    await prisma.teachers.create({
      data: {
        nama,
        jenis_kelamin,
        NIP,
        NUPTK
      }
    })

    return c.json({ message: "success" })
  })

  // PUT /api/teachers/:id
  .put('/:id', async (c) => {
    const id = c.req.param('id')
    const {
      nama,
      jenis_kelamin
    } = await c.req.json()
    const teacher = await prisma.teachers.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        nama,
        jenis_kelamin,
      }
    })

    return c.json({ teacher })
  })

  // DELETE /api/teachers/:id
  .delete('/:id', async (c) => {
    const id = c.req.param('id')
    const teacher = await prisma.teachers.delete({
      where: {
        id: Number.parseInt(id),
      }
    })

    return c.json({ teacher })
  })

export default teacherRouter
