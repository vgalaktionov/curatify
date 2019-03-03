import express from 'express'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import auth from './auth'
import api from './api'
import { ingestAll } from '../tasks/ingest'
import { analyzeAll } from '../tasks/analyze'

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)

import config from '../nuxt.config.js'
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  const nuxt = new Nuxt(config)

  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(bodyParser.json())
  app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    name: 'session',
    secret: process.env.SECRET
  }))

  app.use('/auth', auth)
  app.use('/api', api)

  app.use(nuxt.render)

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
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
