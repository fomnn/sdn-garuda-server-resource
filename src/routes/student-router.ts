import { Hono } from "hono"
import { prisma } from "./../prisma/db.js"
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
      }
    })

    return c.json({ student })
  })

  // POST /api/students
  .post('/', async (c) => {
    const {
      nama,
      NISN,
      jenis_kelamin,
      attendance
    } = await c.req.json()

    await prisma.students.create({
      data: {
        nama,
        jenis_kelamin,
        NISN,
        attendance,
      }
    })

    return c.text('Success', 200)
  })

  // PUT /api/students/:id
  .put('/:id', async (c) => {
    const id = c.req.param('id')
    const {
      nama,
      NISN,
      jenis_kelamin,
      attendance
    } = await c.req.json()

    const student = await prisma.students.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        nama,
        NISN,
        jenis_kelamin,
        attendance
      }
    })

    return c.json({ student })
  })

  // DELETE /api/students/:id
  .delete('/:id', async (c) => {
    const id = c.req.param('id')
    const student = await prisma.students.delete({
      where: {
        id: Number.parseInt(id),
      }
    })

    return c.json({ student })
  })

  



export default studentRouter
