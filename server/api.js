import express from 'express'
import { userPlaylists, updatePlaylistType } from '../data/playlists'
import { userUnheardInboxRich } from '../data/inbox'


const api = express.Router()

api.get('/inbox', async (req, res) => {
  const inbox = await userUnheardInboxRich(req.session.user)
  res.json(inbox)
})

api.get('/playlists', async (req, res) => {
  const playlists = await userPlaylists(req.session.user.id)
  res.json(playlists)
})

api.patch('/playlists/:id/type', async (req, res) => {
  await updatePlaylistType(req.params.id, req.body.playlist_type)
  res.sendStatus(200)
})

api.put('/tracks/:id/like', (req, res) => {

})

api.put('/tracks/:id/dislike', (req, res) => {

})

export default api
