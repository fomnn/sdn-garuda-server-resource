import { Hono } from "hono";
import { prisma } from "../../prisma/db.js";

const studentGradeRouter = new Hono()

studentGradeRouter
  // GET /api/student_grades
  .get('/', async (c) => {
    const studentGrades = await prisma.student_grades.findMany()
    return c.json({ student_grades: studentGrades })
  })

  // GET /api/student_grades/:id
  .get('/:id', async (c) => {
    const id = c.req.param('id')
    const studentGrade = await prisma.student_grades.findUnique({
      where: {
        id: Number.parseInt(id),
      }
    })

    return c.json({ student_grade: studentGrade })
  })

  // POST /api/student_grades
  .post('/', async (c) => {
    const {
      student_id,
      student_assignment_id,
      grade,
      term
    } = await c.req.json()
    const studentGrade = await prisma.student_grades.create({
      data: {
        student_id,
        student_assignment_id,
        grade,
        term,
      }
    })
    return c.json({ student_grade: studentGrade })
  })

  // PUT /api/student_grades/:id
  .put('/:id', async (c) => {
    const id = c.req.param('id')
    const {
      student_id,
      student_assignment_id,
      grade,
      term
    } = await c.req.json()
    const studentGrade = await prisma.student_grades.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        student_id,
        student_assignment_id,
        grade,
        term
      }
    })
    return c.json({ student_grade: studentGrade })
  })

  // DELETE /api/student_grades/:id
  .delete('/:id', async (c) => {
    const id = c.req.param('id')
    const studentGrade = await prisma.student_grades.delete({
      where: {
        id: Number.parseInt(id),
      }
    })
    return c.json({ student_grade: studentGrade })
  })

export default studentGradeRouter
