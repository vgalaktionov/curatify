import express from 'express'
import { upsertUser } from '../data/users'
import { SpotifyUserClient } from '../lib/spotify'

const auth = express.Router()

auth.get('/login', (req, res) => {
  console.log(SpotifyUserClient.authUrl())
  res.redirect(SpotifyUserClient.authUrl())
})

auth.get('/callback', async (req, res) => {
  const token = await SpotifyUserClient.getToken(req.query.code)
  const api = new SpotifyUserClient(token)
  const userData = await api.me()
  const user = {
    token,
    ...userData
  }
  await upsertUser(user)
  req.session.user = user
  res.redirect('/')
})

auth.get('/logout', (req, res) => {
  req.session = null
  res.redirect('/')
})

auth.get('/me', (req, res) => {
  const { user } = req.session
  if (user) {
    res.json(user)
  } else {
    res.statusCode(204)
  }
})

export default auth
