import { serve } from '@hono/node-server'
import connectDB from './db/init'
import dotenv from 'dotenv'
import app from './app'

async function startServer() {
  dotenv.config()
  const port = 3000
  console.log(`Server is running on port ${port}`)

  await connectDB()

  serve({
    fetch: app.fetch,
    port
  })
}

startServer()
