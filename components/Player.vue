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
        <button class="playback" @click="playOrPause">
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

export default {
  computed: {
    playing() {
      // return !this.$store.state.playbackState.paused
      return false
    }
    // },
    // trackDuration() {
    //   const playback = this.$store.state.playbackState
    //   return playback && playback.track_window.current_track.trackDuration
    // },
    // trackPosition() {
    //   const playback = this.$store.state.playbackState
    //   return playback && playback.track_window.current_track.trackPosition
    // }
  },
  created() {
    this.$spotify = new SpotifyUserClient(this.$store.state.user.token)
  },
  methods: {
    likeTrack() {
      console.log("liked")
    },
    dislikeTrack() {
      console.log("disliked")
    },
    async nextTrack() {
      await window.player.nextTrack()
    },
    async previousTrack() {
      await window.player.previousTrack()
    },
    async playOrPause() {
      if (this.playing) {
        await this.$spotify.pause()
      } else {
        await this.$spotify.play(
          this.$store.state.inbox.to(11).map(it => "spotify:track:" + it.id)
        )
      }
    }
  }
}
</script>
