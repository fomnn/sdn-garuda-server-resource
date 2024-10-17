import { Hono } from "hono"
import studentRouter from "./routes/student-route"
import parentRouter from "./routes/parent-route"
import teacherRouter from "./routes/teacher-route"
import classRouter from "./routes/class-route"
import { cors } from "hono/cors"
import subjectRouter from "./routes/subject-route"

const app = new Hono().basePath('/api')

app.use('*', cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/students', studentRouter)
app.route('/parents', parentRouter)
app.route('/teachers', teacherRouter)
app.route('/classes', classRouter)
app.route('/subjects', subjectRouter)

export default app
