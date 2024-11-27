import { Hono } from 'hono'
import { prisma } from '../../prisma/db.js'
// import { Student } from "../db/schemas/student-schema"

const studentRouter = new Hono()

studentRouter
  // GET /api/students
  .get('/', async (c) => {
    const parentId = c.req.query('parentId')
    const classId = c.req.query('classId')

    if (parentId) {
      const students = await prisma.students.findMany({
        where: {
          parents_students: {
            some: {
              parent_id: Number.parseInt(parentId),
            },
          },
        },
      })

      return c.json({ students })
    }
    else if (classId) {
      const students = await prisma.students.findMany({
        where: {
          class_id: Number.parseInt(classId),
        },
      })

      return c.json({ students })
    }

    const students = await prisma.students.findMany()

    return c.json({ students })
  })

  // GET /api/students/:id
  .get('/:id', async (c) => {
    const id = c.req.param('id')
    const summary = !!c.req.query('summary')
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

    if (summary) {
      const today = new Date('2024-06-22')

      const attendance = await prisma.student_attendances.findFirst({
        where: {
          student_id: Number.parseInt(id),
          date: new Date(today.toISOString().split('T')[0]),
        },
      })

      const nameAbbreviation = student.nama
        .split(' ') // Memisahkan string menjadi array berdasarkan spasi
        .map(word => word[0].toUpperCase()) // Mengambil huruf pertama dan mengubahnya ke huruf besar
        .join('')

      const allAttendanceSumByStudentClass = (await prisma.student_attendances.findMany({
        where: {
          class_id: student.class_id,
        },
      })).length
      const presentAttendanceSumByStudentClass = (await prisma.student_attendances.findMany({
        where: {
          class_id: student.class_id,
          status: 'present',
        },
      })).length

      const allStudentGrade = (await prisma.student_grades.findMany({
        where: {
          student_id: student.id,
        },
      }))

      const totalGrades = allStudentGrade.reduce((sum, item) => sum + Number.parseFloat(item.grade.toString()), 0)
      const averageOfGrade = totalGrades / allStudentGrade.length

      const averageOfAttendance = allAttendanceSumByStudentClass ? `${((presentAttendanceSumByStudentClass / allAttendanceSumByStudentClass) * 100).toFixed(0)}` : 0

      const dailyAttendance = attendance?.status ?? null

      const allSubjectIdsByStudentClass = (await prisma.subjects.findMany({
        where: {
          class_subjects: {
            some: {
              class_id: student.class_id,
            },
          },
        },
      })).map(subject => subject.id)

      const assignmentIds = (await prisma.student_assignments.findMany({
        where: {
          subject_id: {
            in: allSubjectIdsByStudentClass,
          },
        },
      })).map(assignment => assignment.id)

      const sumOfCompleteAssignment = await prisma.student_grades.count({
        where: {
          student_id: student.id,
          student_assignment_id: {
            in: assignmentIds,
          },
        },
      })

      const className = await prisma.classes.findUnique({
        where: {
          id: student.class_id,
        },
      })

      return c.json({
        ...student,
        className: className?.class_name,
        dailyAttendance,
        averageOfAttendance,
        averageOfGrade,
        sumOfCompleteAssignment,
        sumOfAssignment: assignmentIds.length,
        nameAbbreviation,
      })
    }

    return c.json({ student })
  })

  // POST /api/students
  .post('/', async (c) => {
    const {
      nama,
      NISN,
      jenis_kelamin,
      class_id,
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
        class_id,
      },
    })

    return c.json({
      message: 'Created',
      student,
    })
  })

  // PUT /api/students/:id
  .put('/:id', async (c) => {
    const id = c.req.param('id')
    const {
      nama,
      NISN,
      jenis_kelamin,
      class_id,
    } = await c.req.json()

    let student = await prisma.students.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!student) {
      return c.json({
        message: 'Student not found',
      }, 404)
    }

    student = await prisma.students.findUnique({
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

    student = await prisma.students.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        nama,
        NISN,
        jenis_kelamin,
        class_id,
      },
    })

    return c.json({
      message: 'Updated',
      student,
    })
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

    return c.json({
      message: 'Deleted',
      student,
    })
  })

export default studentRouter
