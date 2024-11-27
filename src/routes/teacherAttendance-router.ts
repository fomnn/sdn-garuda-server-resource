import { Hono } from 'hono'
import { prisma } from '../../prisma/db.js'

const teacherAttendanceRouter = new Hono()

teacherAttendanceRouter
  .get('/', async (c) => {
    const teacherAttendances = await prisma.teacher_attendances.findMany()

    return c.json({ teacher_attendances: teacherAttendances })
  })

  .get('/:id', async (c) => {
    const id = c.req.param('id')
    const teacherAttendance = await prisma.teacher_attendances.findUnique({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!teacherAttendance) {
      return c.json({
        message: 'Teacher attendance not found',
      }, 404)
    }

    return c.json({ teacher_attendance: teacherAttendance })
  })

  .post('/', async (c) => {
    const {
      teacher_id,
    } = await c.req.json()

    const teacher = await prisma.teachers.findUnique({
      where: {
        id: Number.parseInt(teacher_id),
      },
    })

    if (!teacher) {
      return c.json({
        message: 'Teacher not found',
      }, 404)
    }

    const date = new Date(new Date().toISOString().split('T')[0])
    const arrived_at = new Date()

    const teacherAttendance = await prisma.teacher_attendances.create({
      data: {
        teacher_id,
        date,
        arrived_at,
        status: 'present',
      },
    })
    
    return c.json({
      teacher_attendance: teacherAttendance,
      message: 'Created',
    }, 201)
  })

export default teacherAttendanceRouter
