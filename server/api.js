import express from 'express'
import { userPlaylists, updatePlaylistType } from '../data/playlists'


const api = express.Router()

api.get('/inbox', (req, res) => {

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
