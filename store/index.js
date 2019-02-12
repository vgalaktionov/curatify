import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const store = () => new Vuex.Store({

  state: () => ({
    user: null,
    playlists: [],
    inbox: [],
    playbackState: {
      paused: true,
      duration: 0,
      position: 0,
      track_window: {
        current_track: {
          id: "",
          linked_from_uri: "",
          album: {
            images: [
              { url: '', height: 0 }
            ]
          }
        }
      }
    }
  }),

  getters: {
    currentTrack: (state) => {
      const track = state.playbackState.track_window.current_track
      track.linked_from_uri = track.linked_from_uri || ""
      return {
        ...track,
        ...state.inbox.find(t => {
          return [track.id, track.linked_from_uri.remove('spotify:track:')].includes(t.id)
        }) || {}
      }
    }
  },

  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setPlaylists(state, playlists) {
      state.playlists = playlists
    },
    setInbox(state, inbox) {
      state.inbox = inbox
    },
    setPlaylistType(state, { id, type }) {
      state.playlists = state.playlists.map(p => (
        { ...p, playlist_type: p.id === id ? type : p.playlist_type }
      ))
    },
    setPlaybackState(state, playbackState) {
      state.playbackState = playbackState || state.playbackState
    }

  },

  actions: {
    async nuxtServerInit ({ commit, dispatch }, { req }) {
      if (req.session && req.session.user) {
        commit('setUser', req.session.user)
        await Promise.all([
          dispatch('getInbox'),
          dispatch('getPlaylists')
        ])
      }
    },
    async getPlaylists({ commit }) {
      const playlists = await this.$axios.$get('/api/playlists')
      return commit('setPlaylists', playlists)
    },
    async getInbox({ commit }) {
      const inbox = await this.$axios.$get('/api/inbox')
      return commit('setInbox', inbox)
    },
    async setPlaylistType({ commit }, { id, type }) {
      await this.$axios.$patch(`/api/playlists/${id}/type`, { playlist_type: type })
      return commit('setPlaylistType', { id, type })
    }
  }

})

export default store
