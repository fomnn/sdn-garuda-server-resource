import { Hono } from 'hono'
import { prisma } from '../../prisma/db.js'

const StudentAssignmentRouter = new Hono()

StudentAssignmentRouter
  // GET /api/student-assignments
  .get('/', async (c) => {
    const studentAssignments = await prisma.student_assignments.findMany()
    return c.json({ 
      students_assignments: studentAssignments 
    })
  })

  // GET /api/student-assignments/:id
  .get('/:id', async (c) => {
    const id = c.req.param('id')
    const studentAssignment = await prisma.student_assignments.findUnique({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!studentAssignment) {
      return c.json({
        message: 'Student assignment not found',
      }, 404)
    }

    return c.json({ student_assignment: studentAssignment })
  })

  // POST /api/student-assignments
  .post('/', async (c) => {
    const {
      title,
      date,
      deadline_date,
      subject_id,
    } = await c.req.json()
    const studentAssignment = await prisma.student_assignments.create({
      data: {
        title,
        date,
        deadline_date,
        subject_id,
      },
    })

    return c.json({
      message: 'Created',
      student_assignment: studentAssignment,
    })
  })

  // PUT /api/student-assignments/:id
  .put('/:id', async (c) => {
    const id = c.req.param('id')
    const {
      title,
      date,
      deadline_date,
      subject_id,
    } = await c.req.json()
    let studentAssignment = await prisma.student_assignments.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!studentAssignment) {
      return c.json({
        message: 'Student assignment not found',
      }, 404)
    }

    studentAssignment = await prisma.student_assignments.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        title,
        date,
        deadline_date,
        subject_id,
      },
    })

    return c.json({
      message: 'Updated',
      student_assignment: studentAssignment,
    })
  })

  // DELETE /api/student-assignments/:id
  .delete('/:id', async (c) => {
    const id = c.req.param('id')
    const studentAssignment = await prisma.student_assignments.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!studentAssignment) {
      return c.json({
        message: 'Student assignment not found',
      }, 404)
    }
    await prisma.student_assignments.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return c.json({
      message: 'Deleted',
      student_assignment: studentAssignment,
    })
  })

export default StudentAssignmentRouter
