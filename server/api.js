import express from 'express'


const api = express.Router()

api.get('/inbox', (req, res) => {

})

api.get('/playlists', async (req, res) => {

})

api.patch('/playlists/:id/type', (req, res) => {

})

api.put('/tracks/:id/like', (req, res) => {

})

api.put('/tracks/:id/dislike', (req, res) => {

})

export default api
