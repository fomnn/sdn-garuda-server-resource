import { Hono } from "hono"
import studentRouter from "./routes/student-route"
import parentRouter from "./routes/parent-route"
import teacherRouter from "./routes/teacher-route"
import classRouter from "./routes/class-route"
import { cors } from "hono/cors"
import subjectRouter from "./routes/subject-route"
import xlsx from 'node-xlsx';
import { Parent } from "./db/schemas/parent-schema"
import { ParentInterface } from "./types/Parent"
import checkIfAnyDataUndefined from "./utils/check-if-any-data-undefined"
// import tes from './assets/excel/tes.xlsx'

const app = new Hono().basePath('/api')

app.use('*', cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})


app.post('/tes', async (c) => {

  const workSheet = xlsx.parse('src/assets/excel/tes.xlsx')

  // console.log(workSheet.forEach(l => {
  //   console.log(l.data)
  // }))

  const data = workSheet[0].data

  // console.log(data[2][0])

  for (let i = 1; i < data.length; i++) {
    const parent: ParentInterface = {
      name: data[i][0],
      tahun_lahir: data[i][1],
      jenjang_pendidikan: data[i][2],
      pekerjaan: data[i][3],
      penghasilan: data[i][4],
      NIK: data[i][5],
    }

    if (checkIfAnyDataUndefined(parent)) {
      continue
    }
    // console.log(parent)
    await Parent.create(parent)
  }

  

  return c.text('ok')
})

app.route('/students', studentRouter)
app.route('/parents', parentRouter)
app.route('/teachers', teacherRouter)
app.route('/classes', classRouter)
app.route('/subjects', subjectRouter)

export default app
