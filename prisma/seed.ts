import { faker } from '@faker-js/faker'
import { jenis_kelamin, parent_student_relationships, student_attendance_status } from '@prisma/client'
import { prisma } from './db.js'

async function main() {
  // Hapus data sebelum seeding untuk menghindari konflik
  await prisma.superadmin.deleteMany()
  await prisma.teachers.deleteMany()
  await prisma.classes.deleteMany()
  await prisma.parents.deleteMany()
  await prisma.feedbacks.deleteMany()
  await prisma.students.deleteMany()
  await prisma.subjects.deleteMany()
  await prisma.class_subjects.deleteMany()
  await prisma.parents_students.deleteMany()
  await prisma.student_attendances.deleteMany()
  await prisma.student_assignments.deleteMany()
  await prisma.student_grades.deleteMany()
  await prisma.subject_teachers.deleteMany()
  await prisma.accounts.deleteMany()
  await prisma.posts.deleteMany()

  // Seeding data for `superadmin`
  await prisma.superadmin.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      username: faker.internet.username(),
      password: faker.internet.password(),
    })),
  })

  // Seeding data for `teachers`
  await prisma.teachers.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      email: faker.internet.email(),
      jenis_kelamin: faker.helpers.enumValue(jenis_kelamin),
      nama: faker.person.fullName(),
      NIP: faker.string.numeric(8),
      tanggal_lahir: faker.date.past(),
      NUPTK: faker.string.numeric(10),
    })),
  })

  const teachers = await prisma.teachers.findMany()
  const teacherIds = teachers.map(teacher => teacher.id)

  // seeding data for `teacher attendance`
  await prisma.teacher_attendances.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      teacher_id: faker.helpers.arrayElement(teacherIds),
      date: faker.date.past(),
    })),
  })

  await prisma.principals.create({
    data: {
      nama: faker.person.fullName(),
      contact_number: faker.string.numeric(12),
      email: faker.internet.email(),
    },
  })

  // Seeding data for `classes`
  await prisma.classes.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      class_name: faker.lorem.words({ min: 1, max: 4 }),
      teacher_id: faker.helpers.arrayElement(teacherIds),
    })),
  })

  const classes = await prisma.classes.findMany()
  const classIds = classes.map(class2 => class2.id)

  // Seeding data for `parents`
  await prisma.parents.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      nama: faker.person.fullName(),
      email: faker.internet.email(),
      jenjang_pendidikan: faker.lorem.words({ min: 1, max: 4 }),
      NIK: faker.string.numeric(16),
      pekerjaan: faker.lorem.words(3),
      penghasilan: faker.string.numeric(7),
    })),
  })

  const parents = await prisma.parents.findMany()
  const parentIds = parents.map(parent => parent.id)

  // Seeding data for `feedbacks`
  await prisma.feedbacks.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      date: faker.date.past(),
      feedback_text: faker.lorem.paragraph(),
      rating: faker.number.int({ min: 1, max: 5 }),
      parent_id: faker.helpers.arrayElement(parentIds),
      teacher_id: faker.helpers.arrayElement(teacherIds),
    })),
  })

  // Seeding data for `students`
  await prisma.students.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      nama: faker.person.fullName(),
      NISN: faker.string.numeric(8),
      jenis_kelamin: faker.helpers.enumValue(jenis_kelamin),
      class_id: faker.helpers.arrayElement(classIds),
    })),
  })

  const students = await prisma.students.findMany()
  const studentIds = students.map(student => student.id)

  // Seeding data for `subjects`
  await prisma.subjects.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      subject_name: faker.lorem.words(3),
    })),
  })

  const subjects = await prisma.subjects.findMany()
  const subjectIds = subjects.map(subject => subject.id)

  // Seeding data for `class_subjects`
  await prisma.class_subjects.createMany({
    data: Array.from({ length: 3 }).fill(null).map(() => ({
      class_id: faker.helpers.arrayElement(classIds),
      subject_id: faker.helpers.arrayElement(subjectIds),
    })),
  })

  // Seeding data for `parents_students`
  await prisma.parents_students.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      relationship: faker.helpers.enumValue(parent_student_relationships),
      student_id: faker.helpers.arrayElement(studentIds),
      parent_id: faker.helpers.arrayElement(parentIds),
    })),
  })

  // Seeding data for `attendances`
  await prisma.student_attendances.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      status: faker.helpers.enumValue(student_attendance_status),
      date: faker.date.past(),
      student_id: faker.helpers.arrayElement(studentIds),
      class_id: faker.helpers.arrayElement(classIds),
    })),
  })

  await prisma.student_assignments.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      deadline_date: faker.date.soon(),
      date: new Date(faker.date.anytime().toISOString().split('T')[0]),
      title: faker.lorem.words({ min: 1, max: 6 }),
      subject_id: faker.helpers.arrayElement(subjectIds),
    })),
  })

  const student_assignments = await prisma.student_assignments.findMany()
  const studentAssignmentIds = student_assignments.map(studentAssignment => studentAssignment.id)

  await prisma.student_grades.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      grade: faker.number.int({ min: 1, max: 100 }),
      term: faker.lorem.paragraphs(),
      student_id: faker.helpers.arrayElement(studentIds),
      student_assignment_id: faker.helpers.arrayElement(studentAssignmentIds),
    })),
  })

  await prisma.subject_teachers.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      subject_id: faker.helpers.arrayElement(subjectIds),
      teacher_id: faker.helpers.arrayElement(teacherIds),
    })),
  })

  // // Seeding data for `account`
  // await prisma.accounts.createMany({
  //   data: Array.from({ length: 5 }).fill(null).map(() => ({
  //     email: faker.internet.email(),
  //     password: faker.internet.password(),
  //     type: faker.helpers.enumValue(account_type),
  //     user_id: faker.number.int({ min: 1, max: 5 }),
  //   })),
  // })

  await prisma.posts.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      title: faker.lorem.words(),
      description: JSON.stringify(faker.lorem.paragraphs(5, '\n').split('\n')),
    })),
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })
