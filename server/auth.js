import express from 'express'
import { upsertUser } from '../data/users'
import { SpotifyUserClient } from '../lib/spotify'
import { updateUserToken } from '../tasks/ingest'

const auth = express.Router()

auth.get('/login', (req, res) => {
  res.redirect(SpotifyUserClient.authUrl())
})

auth.get('/callback', async (req, res) => {
  const token = await SpotifyUserClient.getToken(req.query.code)
  const api = new SpotifyUserClient(token)
  const userData = await api.me()
  const user = { token, ...userData }
  console.log(user)
  await upsertUser(user)
  req.session.user = user
  res.redirect('/')
})

auth.get('/logout', (req, res) => {
  req.session = null
  res.redirect('/')
})

auth.get('/me', async (req, res) => {
  let { user } = req.session
  if (user) {
    user = await updateUserToken(user)
    res.json(user)
  } else {
    res.statusCode(204)
  }
})

export default auth
