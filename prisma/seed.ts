import { prisma } from './db.js'

async function main() {
  // Seeding data for `superadmin`
  await prisma.superadmin.createMany({
    data: [
      { username: 'admin1', password: 'password1' },
      { username: 'admin2', password: 'password2' },
      { username: 'admin3', password: 'password3' },
      { username: 'admin4', password: 'password4' },
      { username: 'admin5', password: 'password5' },
    ],
  })

  // Seeding data for `account`
  await prisma.accounts.createMany({
    data: [
      { email: 'parent1@example.com', password: 'password', type: 'parent', user_id: 1 },
      { email: 'teacher1@example.com', password: 'password', type: 'teacher', user_id: 2 },
      { email: 'principal1@example.com', password: 'password', type: 'principal', user_id: 3 },
      { email: 'parent2@example.com', password: 'password', type: 'parent', user_id: 4 },
      { email: 'teacher2@example.com', password: 'password', type: 'teacher', user_id: 5 },
    ],
  })

  // Seeding data for `teachers`
  await prisma.teachers.createMany({
    data: [
      { nama: 'Teacher One', email: 'teacher1@example.com', jenis_kelamin: 'male', NIP: '12345', NUPTK: '54321' },
      { nama: 'Teacher Two', email: 'teacher2@example.com', jenis_kelamin: 'female', NIP: '23456', NUPTK: '65432' },
      { nama: 'Teacher Three', email: 'teacher3@example.com', jenis_kelamin: 'male', NIP: '34567', NUPTK: '76543' },
      { nama: 'Teacher Four', email: 'teacher4@example.com', jenis_kelamin: 'female', NIP: '45678', NUPTK: '87654' },
      { nama: 'Teacher Five', email: 'teacher5@example.com', jenis_kelamin: 'male', NIP: '56789', NUPTK: '98765' },
    ],
  })

  // Seeding data for `classes`
  await prisma.classes.createMany({
    data: [
      { class_name: 'Class 1', teacher_id: 1 },
      { class_name: 'Class 2', teacher_id: 2 },
      { class_name: 'Class 3', teacher_id: 3 },
      { class_name: 'Class 4', teacher_id: 4 },
      { class_name: 'Class 5', teacher_id: 5 },
    ],
  })

  // Seeding data for `parents`
  await prisma.parents.createMany({
    data: [
      { nama: 'Parent One', email: 'parent_one@example.com', tahun_lahir: 1970, jenjang_pendidikan: 'Bachelor', pekerjaan: 'Engineer', penghasilan: '5000000', NIK: '123456789' },
      { nama: 'Parent Two', email: 'parent_two@example.com', tahun_lahir: 1975, jenjang_pendidikan: 'Bachelor', pekerjaan: 'Teacher', penghasilan: '4040000', NIK: '987654321' },
      { nama: 'Parent Three', email: 'parent_three@example.com', tahun_lahir: 1980, jenjang_pendidikan: 'Master', pekerjaan: 'Doctor', penghasilan: '6000000', NIK: '123459876' },
      { nama: 'Parent Four', email: 'parent_four@example.com', tahun_lahir: 1985, jenjang_pendidikan: 'Diploma', pekerjaan: 'Lawyer', penghasilan: '7000000', NIK: '987651234' },
      { nama: 'Parent Five', email: 'parent_five@example.com', tahun_lahir: 1990, jenjang_pendidikan: 'PhD', pekerjaan: 'Scientist', penghasilan: '8000000', NIK: '1122334455' },
    ],
  })

  // Seeding data for `feedbacks`
  await prisma.feedbacks.createMany({
    data: [
      { feedback_text: 'Great teacher', rating: 5, date: new Date(), teacher_id: 1, parent_id: 1 },
      { feedback_text: 'Good teacher', rating: 4, date: new Date(), teacher_id: 2, parent_id: 2 },
      { feedback_text: 'Average teacher', rating: 3, date: new Date(), teacher_id: 3, parent_id: 3 },
      { feedback_text: 'Not satisfied', rating: 2, date: new Date(), teacher_id: 4, parent_id: 4 },
      { feedback_text: 'Excellent', rating: 5, date: new Date(), teacher_id: 5, parent_id: 5 },
    ],
  })

  // Seeding data for `students`
  await prisma.students.createMany({
    data: [
      { nama: 'Student One', jenis_kelamin: 'male', NISN: 'S123456' },
      { nama: 'Student Two', jenis_kelamin: 'female', NISN: 'S234567' },
      { nama: 'Student Three', jenis_kelamin: 'male', NISN: 'S345678' },
      { nama: 'Student Four', jenis_kelamin: 'female', NISN: 'S456789' },
      { nama: 'Student Five', jenis_kelamin: 'male', NISN: 'S567890' },
    ],
  })

  // Seeding data for `subjects`
  await prisma.subjects.createMany({
    data: [
      { subject_name: 'Mathematics' },
      { subject_name: 'Science' },
      { subject_name: 'History' },
      { subject_name: 'Geography' },
      { subject_name: 'English' },
    ],
  })

  // Seeding data for `class_subjects`
  await prisma.class_subjects.createMany({
    data: [
      { class_id: 1, subject_id: 1 },
      { class_id: 2, subject_id: 2 },
      { class_id: 3, subject_id: 3 },
      { class_id: 4, subject_id: 4 },
      { class_id: 5, subject_id: 5 },
    ],
  })

  // Seeding data for `parents_students`
  await prisma.parents_students.createMany({
    data: [
      { parent_id: 1, student_id: 1, relationship: 'father' },
      { parent_id: 2, student_id: 2, relationship: 'mother' },
      { parent_id: 3, student_id: 3, relationship: 'guardian' },
      { parent_id: 4, student_id: 4, relationship: 'father' },
      { parent_id: 5, student_id: 5, relationship: 'mother' },
    ],
  })

  // Seeding data for `attendances`
  await prisma.attendances.createMany({
    data: [
      { student_id: 1, class_id: 1, date: new Date(), status: 'present' },
      { student_id: 2, class_id: 2, date: new Date(), status: 'absent' },
      { student_id: 3, class_id: 3, date: new Date(), status: 'excused' },
      { student_id: 4, class_id: 4, date: new Date(), status: 'present' },
      { student_id: 5, class_id: 5, date: new Date(), status: 'present' },
    ],
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
