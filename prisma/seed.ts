import { faker } from '@faker-js/faker'
import { account_type, attendance_status, jenis_kelamin, parent_student_relationships } from '@prisma/client'
import { prisma } from './db.js'

async function main() {
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

  // Seeding data for `classes`
  await prisma.classes.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      class_name: faker.lorem.words({ min: 1, max: 4 }),
      teacher_id: faker.number.int({ min: 1, max: 5 }),
    })),
  })

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

  // Seeding data for `feedbacks`
  await prisma.feedbacks.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      date: faker.date.past(),
      feedback_text: faker.lorem.paragraph(),
      rating: faker.number.int({ min: 1, max: 5 }),
      parent_id: faker.number.int({ min: 1, max: 5 }),
      teacher_id: faker.number.int({ min: 1, max: 5 }),
    })),
  })

  // Seeding data for `students`
  await prisma.students.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      nama: faker.person.fullName(),
      NISN: faker.string.numeric(8),
      jenis_kelamin: faker.helpers.enumValue(jenis_kelamin),
      class_id: faker.number.int({ min: 1, max: 5 }),
    })),
  })

  // Seeding data for `subjects`
  await prisma.subjects.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      subject_name: faker.lorem.words(3),
    })),
  })

  // Seeding data for `class_subjects`
  await prisma.class_subjects.createMany({
    data: Array.from({ length: 3 }).fill(null).map(() => ({
      class_id: faker.number.int({ min: 1, max: 5 }),
      subject_id: faker.number.int({ min: 1, max: 5 }),
    })),
  })

  // Seeding data for `parents_students`
  await prisma.parents_students.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      relationship: faker.helpers.enumValue(parent_student_relationships),
      student_id: faker.number.int({ min: 1, max: 5 }),
      parent_id: faker.number.int({ min: 1, max: 5 }),
    })),
  })

  // Seeding data for `attendances`
  await prisma.attendances.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      status: faker.helpers.enumValue(attendance_status),
      date: faker.date.past(),
      student_id: faker.number.int({ min: 1, max: 5 }),
      class_id: faker.number.int({ min: 1, max: 5 }),
    })),
  })

  await prisma.student_assignments.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      deadline_date: faker.date.soon(),
      date: new Date(faker.date.anytime().toISOString().split('T')[0]),
      title: faker.lorem.words({ min: 1, max: 6 }),
      subject_id: faker.number.int({ min: 1, max: 5 }),
    })),
  })

  await prisma.student_grades.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      grade: faker.number.int({ min: 1, max: 100 }),
      term: faker.lorem.paragraphs(),
      student_id: faker.number.int({ min: 1, max: 5 }),
      student_assignment_id: faker.number.int({ min: 1, max: 5 }),
    })),
  })

  await prisma.subject_teachers.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      subject_id: faker.number.int({ min: 1, max: 5 }),
      teacher_id: faker.number.int({ min: 1, max: 5 }),
    })),
  })

  // Seeding data for `account`
  await prisma.accounts.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      email: faker.internet.email(),
      password: faker.internet.password(),
      type: faker.helpers.enumValue(account_type),
      user_id: faker.number.int({ min: 1, max: 5 }),
    })),
  })

  await prisma.posts.createMany({
    data: Array.from({ length: 5 }).fill(null).map(() => ({
      title: faker.lorem.words(),
    })),
  })

  await prisma.posts_paragraphs.createMany({
    data: Array.from({ length: 15 }).fill(null).map(() => ({
      content: faker.lorem.paragraph(),
      paragraph_order: faker.number.int({ min: 1, max: 150 }),
      post_id: faker.number.int({ min: 1, max: 5 }),
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
