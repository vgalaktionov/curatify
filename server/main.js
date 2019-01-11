import express from 'express'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import auth from './auth'

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)

// Import and Set Nuxt.js options
import config from '../nuxt.config.js'
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Server side things
  app.use(bodyParser.json())
  app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    name: 'session',
    secret: process.env.SECRET
  }))

  // API routes
  app.use('/auth', auth)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
