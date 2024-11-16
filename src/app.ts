import { Hono } from 'hono'
import { cors } from 'hono/cors'
import accountRouter from './routes/account-router.js'
import attendanceRouter from './routes/attendance-router.js'
import authenticationRouter from './routes/authentication-router.js'
import classRouter from './routes/class-router.js'
import feedbackRouter from './routes/feedback-router.js'
import parentRouter from './routes/parent-router.js'
import parentsStudentsRouter from './routes/parentsStudents-router.js'
import postRouter from './routes/post-router.js'
import principalsRouter from './routes/principals-router.js'
import studentRouter from './routes/student-router.js'
import StudentAssignmentRouter from './routes/studentAssignment-router.js'
import studentGradeRouter from './routes/studentGrade-router.js'
import subjectRouter from './routes/subject-router.js'
import teacherRouter from './routes/teacher-router.js'

const app = new Hono().basePath('/api')

app.use('*', cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/seed-parents', async (c) => {
  // const workSheet = xlsx.parse('src/assets/excel/tes.xlsx')

  // // console.log(workSheet.forEach(l => {
  // //   console.log(l.data)
  // // }))

  // const data = workSheet[0].data

  // // console.log(data[2][0])

  // for (let i = 1; i < data.length; i++) {
  //   const parent: ParentInterface = {
  //     name: data[i][0],
  //     tahun_lahir: data[i][1],
  //     jenjang_pendidikan: data[i][2],
  //     pekerjaan: data[i][3],
  //     penghasilan: data[i][4],
  //     NIK: data[i][5],
  //   }

  //   if (checkIfAnyDataUndefined(parent)) {
  //     continue
  //   }
  // }

  return c.text('ok')
})

app.route('/auth', authenticationRouter)

app.route('/students', studentRouter)
app.route('/parents', parentRouter)
app.route('/teachers', teacherRouter)
app.route('/classes', classRouter)
app.route('/subjects', subjectRouter)
app.route('/attendances', attendanceRouter)
app.route('/student-assignments', StudentAssignmentRouter)
app.route('/student-grades', studentGradeRouter)
app.route('/feedbacks', feedbackRouter)
app.route('/accounts', accountRouter)
app.route('/posts', postRouter)
app.route('/principals', principalsRouter)
app.route('/parents-students', parentsStudentsRouter)

export default app
