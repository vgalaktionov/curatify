import express from 'express'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import Bundler from 'parcel-bundler'

import auth from './auth'
import api from './api'
import { ingestAll } from './tasks/ingest'
import { analyzeAll } from './tasks/analyze'

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)


async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const bundler = new Bundler('client/index.html', {})
    app.use(bundler.middleware())
  }

  app.use(bodyParser.json())
  app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    name: 'session',
    secret: process.env.SECRET
  }))

  app.use('/auth', auth)
  app.use('/api', api)


  app.listen(port, host)
  console.info(`Server listening on http://${host}:${port}`)
}

async function allTasks(params) {
  console.info('Running periodic tasks...')
  await ingestAll()
  await analyzeAll()
}

// Run the fetching tasks
setImmediate(allTasks)
setInterval(allTasks, 1000 * 60 * 5)

start()
