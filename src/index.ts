import { serve } from '@hono/node-server'
// import connectDB from './db/init'
import dotenv from 'dotenv'
import app from './app.js'

async function startServer() {
  dotenv.config()
  const port = 3000
  console.log(`Server is running on port ${port}`)

  serve({
    fetch: app.fetch,
    port,
  })
}

startServer()
