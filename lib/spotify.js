import axios from 'axios'
import axiosRetry from 'axios-retry'
import { stringify } from 'querystring'
import camelcaseKeys from 'camelcase-keys'

const authBase = 'https://accounts.spotify.com'
const scope = [
  'user-read-email',
  'user-library-read',
  'user-library-modify',
  'streaming',
  'user-read-birthdate',
  'user-read-private',
  'user-modify-playback-state',
  'playlist-modify-private',
  'playlist-modify-public'
].join(' ')
const auth = axios.create({ baseURL: authBase })


export class SpotifyClient {
  constructor(token) {
    this.token = token
    this.api = axios.create({
      baseURL: 'https://api.spotify.com/v1',
      headers: { Authorization: `Bearer ${token.accessToken}` }
    })
    axiosRetry(this.api, { retries: 3 })
  }

  static enrichToken(token) {
    const camelToken = camelcaseKeys(token)
    return {
      expiresAt: (new Date().getTime() / 1000) + camelToken.expiresIn,
      ...camelToken
    }
  }

  static async getToken() {
    const { data } = await auth.post('/api/token', stringify({
      client_id: process.env.SPOTIFY_ID,
      grant_type: 'client_credentials',
      client_secret: process.env.SPOTIFY_SECRET
    }))
    return this.enrichToken(data)
  }

  async artists(artistIds) {
    const { data: { artists } } = await this.api.get(
      '/artists', { params: { ids: artistIds.filter(id => !!id).join(',') } }
    )
    return artists
  }
}


export class SpotifyUserClient extends SpotifyClient {
  static authUrl() {
    return `${authBase}/authorize?${stringify({
      scope,
      client_id: process.env.SPOTIFY_ID,
      redirect_uri: process.env.CALLBACK_URL,
      response_type: 'code'
    })}`
  }

  static async getToken(code) {
    const { data } = await auth.post('/api/token', stringify({
      client_id: process.env.SPOTIFY_ID,
      redirect_uri: process.env.CALLBACK_URL,
      grant_type: 'authorization_code',
      client_secret: process.env.SPOTIFY_SECRET,
      code
    }))
    return super.enrichToken(data)
  }

  async refreshToken() {
    const { data } = await auth.post('/api/token', stringify({
      client_id: process.env.SPOTIFY_ID,
      grant_type: 'refresh_token',
      client_secret: process.env.SPOTIFY_SECRET,
      refresh_token: this.token.refreshToken
    }))
    return SpotifyClient.enrichToken({ ...this.token, ...data })
  }

  async me() {
    const { data } = await this.api.get('/me')
    return data
  }

  async *mePlaylists() {
    let next = '/me/playlists'
    while (next) {
      const { data } = await this.api.get(next)
      next = data.next
      yield data.items
    }
  }

  async *playlistTracks(playlistId) {
    let next = `/playlists/${playlistId}/tracks`
    while (next) {
      const { data } = await this.api.get(next, { params: { limit: 100 } })
      next = data.next
      yield data.items
    }
  }

  async play(uris, deviceId, position_ms = undefined) {
    await this.api.put(`/me/player/play?device_id=${deviceId}`, { uris, position_ms })
  }

  async pause(deviceId, ) {
    await this.api.put(`/me/player/pause?device_id=${deviceId}`)
  }
}
