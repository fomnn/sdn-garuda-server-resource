import { Hono } from "hono"
import studentRouter from "./routes/student-router"
import parentRouter from "./routes/parent-router"
import teacherRouter from "./routes/teacher-router"
import classRouter from "./routes/class-router"
import { cors } from "hono/cors"
import subjectRouter from "./routes/subject-router"
import xlsx from 'node-xlsx';
import { ParentInterface } from "./types/Parent"
import checkIfAnyDataUndefined from "./utils/check-if-any-data-undefined"

const app = new Hono().basePath('/api')

app.use('*', cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})


app.post('/tes', async (c) => {

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

app.route('/students', studentRouter)
app.route('/parents', parentRouter)
app.route('/teachers', teacherRouter)
app.route('/classes', classRouter)
app.route('/subjects', subjectRouter)

export default app
