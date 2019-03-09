import axios from 'axios'
import { createStore, select,
  thunk
} from 'easy-peasy'

const store = createStore({
  // State
  user: null,
  ready: false,
  playlists: [],
  inbox: [],
  playbackState: {
    paused: true,
    duration: 0,
    position: 0,
    track_window: {
      current_track: {
        id: '',
        linked_from_uri: '',
        album: {
          images: [{
            url: '',
            height: 0
          }]
        }
      }
    }
  },

  // Selectors
  currentTrack: select(({
    playbackState: {
      track_window: {
        current_track: track
      }
    },
    inbox
  }) => {
    track.linked_from_uri = track.linked_from_uri || ''
    return {
      ...track,
      ...inbox.find(t => {
        return [track.id, track.linked_from_uri.remove('spotify:track:')].includes(t.id)
      }) || {}
    }
  }),

  // Actions
  setUser (state, user) {
    state.user = user
  },
  setPlaylists (state, playlists) {
    state.playlists = playlists
  },
  setInbox (state, inbox) {
    state.inbox = inbox
  },
  setPlaylistType (state, {
    id,
    type
  }) {
    state.playlists = state.playlists.map(p => ({
      ...p,
      playlist_type: p.id === id ? type : p.playlist_type
    }))
  },
  setPlaybackState (state, playbackState) {
    state.playbackState = playbackState || state.playbackState
  },
  setReady (state, ready) {
    state.ready = ready
  },
  setTrackStatus (state, {
    trackId,
    status
  }) {
    state.inbox = state.inbox.map(t => t.id === trackId ? {
      ...t,
      status
    } : t)
  },
  setMatchingPlaylist (state, {
    trackId,
    playlistId
  }) {
    state.inbox = state.inbox.map(t => {
      return t.id === trackId ? {
        ...t,
        playlist_matches: playlistId
      } : t
    })
  },

  // Thunks
  initialFetch: thunk(async actions => {
    const { data: user } = await axios.get('/auth/me')
    if (user) {
      actions.setUser(user)
      await Promise.all([
        actions.getInbox(),
        actions.getPlaylists()
      ])
    }
  }),
  getPlaylists: thunk(async actions => {
    const { data: playlists } = await axios.get('/api/playlists')
    actions.setPlaylists(playlists)
  }),
  getInbox: thunk(async actions => {
    const { data: inbox } = await axios.get('/api/inbox')
    actions.setInbox(inbox)
  }),
  patchPlaylistType: thunk(async (actions, { id, type }) => {
    await axios.patch(`/api/playlists/${id}/type`, {
      playlist_type: type
    })
    actions.setPlaylistType({
      id,
      type
    })
  })
})

export default store
