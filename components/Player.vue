<template>
  <div class="column is-6 player">
    <div class="columns">
      <CurrentlyPlaying/>
    </div>
    <div class="columns">
      <div class="column is-12 has-text-centered">
        <progress :max="trackDuration" :value="trackPosition" class="progress"/>
      </div>
    </div>
    <div class="columns playback-buttons is-vcentered has-text-centered">
      <div class="column is-one-fifth">
        <button class="playback" @click="dislikeTrack">
          <b-icon icon="thumb-down" size="is-large"/>
        </button>
      </div>
      <div class="column is-one-fifth">
        <button class="playback" @click="previousTrack">
          <b-icon icon="skip-previous" size="is-large"/>
        </button>
      </div>
      <div class="column is-one-fifth">
        <button :disabled="!playerReady" class="playback" @click="playOrPause">
          <b-icon :icon="playing ? 'pause' : 'play'" size="is-large"/>
        </button>
      </div>
      <div class="column is-one-fifth">
        <button class="playback" @click="nextTrack">
          <b-icon icon="skip-next" size="is-large"/>
        </button>
      </div>
      <div class="column is-one-fifth">
        <button class="playback" @click="likeTrack">
          <b-icon icon="thumb-up" size="is-large"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { SpotifyUserClient } from "~/lib/spotify"
import CurrentlyPlaying from '~/components/CurrentlyPlaying'

export default {
  components: { CurrentlyPlaying },
  data() {
    return { playing: false }
  },
  computed: {
    playerReady() {
      return this.$store.state.ready
    },
    trackDuration() {
      return this.$store.state.playbackState.duration
    },
    trackPosition() {
      return this.$store.state.playbackState.position
    }
  },
  created() {
    this.$spotify = new SpotifyUserClient(this.$store.state.user.token)
  },
  methods: {
    async likeTrack() {
      const track = this.$store.getters.currentTrack
      await this.$axios.put(`/api/tracks/${track.id}/like`)
      await this.$spotify.addTrackToPlaylist(track.id, track.playlist_matches)
      this.$store.commit('setTrackStatus', { trackId: track.id, status: 'liked' })
    },
    async dislikeTrack() {
      const track = this.$store.getters.currentTrack
      await this.$axios.put(`/api/tracks/${track.id}/dislike`)
      await this.nextTrack()
      this.$store.commit('setTrackStatus', { trackId: track.id, status: 'disliked' })
    },
    async nextTrack() {
      await window.player.nextTrack()
    },
    async previousTrack() {
      await window.player.previousTrack()
    },
    async playOrPause() {
      this.playing = !this.playing
      if (!this.playing) {
        await this.$spotify.pause(window.player._options.id)
      } else {
        await this.$spotify.play(
          this.$store.state.inbox.to(11).map(it => "spotify:track:" + it.id),
          window.player._options.id
        )
      }
      setTimeout(() => {
        this.playing = !this.$store.state.playbackState.paused
      }, 1000)
    }
  }
}
</script>

<style scoped>
.playback {
    font-size: 40pt;
    border-color: transparent;
    outline: none;
}

.playback:hover {
    color: rgb(129, 135, 141);
}
</style>
