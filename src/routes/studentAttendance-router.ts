import { Hono } from 'hono'
import { prisma } from '../../prisma/db.js'

const attendanceRouter = new Hono()

attendanceRouter
  // GET /api/attendances
  .get('/', async (c) => {
    const studentId = c.req.query('studentId')

    let attendances

    if (studentId) {
      attendances = await prisma.student_attendances.findMany({
        where: {
          student_id: Number.parseInt(studentId),
        },
      })
    }
    else {
      attendances = await prisma.student_attendances.findMany()
    }

    return c.json({ attendances })
  })

  // GET /api/attendances/:id
  .get('/:id', async (c) => {
    const id = c.req.param('id')
    const attendance = await prisma.student_attendances.findUnique({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!attendance) {
      return c.json({
        message: 'Attendance not found',
      }, 404)
    }

    return c.json({ attendance })
  })

  // POST /api/attendances
  .post('/', async (c) => {
    const {
      student_id,
      class_id,
      date,
      status,
    } = await c.req.json()
    const attendance = await prisma.student_attendances.create({
      data: {
        student_id,
        class_id,
        date,
        status,
      },
    })

    return c.json({
      message: 'Created',
      attendance,
    })
  })

  // PUT /api/attendances/:id
  .put('/:id', async (c) => {
    const id = c.req.param('id')
    const {
      student_id,
      class_id,
      date,
      status,
    } = await c.req.json()
    let attendance = await prisma.student_attendances.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!attendance) {
      return c.json({
        message: 'Attendance not found',
      }, 404)
    }
    attendance = await prisma.student_attendances.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        student_id,
        class_id,
        date,
        status,
      },
    })
    return c.json({
      message: 'Updated',
      attendance,
    })
  })

  // DELETE /api/attendances/:id
  .delete('/:id', async (c) => {
    const id = c.req.param('id')

    let attendance = await prisma.student_attendances.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!attendance) {
      return c.json({
        message: 'Attendance not found',
      }, 404)
    }
    attendance = await prisma.student_attendances.delete({
      where: {
        id: Number.parseInt(id),
      },
    })
    return c.json({
      message: 'Deleted',
      attendance,
    })
  })

export default attendanceRouter
