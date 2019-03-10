/* global Spotify */
import store from './store'

export default function spotifyPlayer () {
  window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
      name: 'Curatify Player',
      getOAuthToken: cb => { cb(store.getState().user.token.accessToken) }
    })

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message) })
    player.addListener('authentication_error', ({ message }) => { console.error(message) })
    player.addListener('account_error', ({ message }) => { console.error(message) })
    player.addListener('playback_error', ({ message }) => { console.error(message) })

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state) })

    // Ready
    /* eslint-disable camelcase */
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id)
      store.dispatch.setReady(true)
    })

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id)
      store.dispatch.setReady(false)
    })
    /* eslint-enable camelcase */

    // Connect to the player!
    player.connect()
    window.player = player

    setInterval(async () => {
      const playbackState = await player.getCurrentState()
      store.dispatch.setPlaybackState(playbackState)
    }, 1000)
  }
}
