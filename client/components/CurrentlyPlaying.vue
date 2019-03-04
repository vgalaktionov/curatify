<template>
  <div class="column is-12 has-text-centered currently-playing">
    <img :src="imageUrl">
    <h5 class="is-size-5 has-text-weight-semibold">{{ track.name }}</h5>
    <p v-if="track.artists" class="has-text-weight-semibold">{{ track.artist_names.join(', ') }}</p>
    <div v-if="track.id" class="field">
      <label for="matches" class="is-small">matches:
        <div class="control is-centered has-text-centered">
          <span class="select">
            <select name="matches" class="is-small" @change="setMatchingPlaylist">
              <option
                v-for="p in playlists"
                :key="p.id"
                :selected="p.id === matchingPlaylist.id"
                value="p.id"
              >{{ p.name }}</option>
            </select>
          </span>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    playing() {
      return !this.$store.state.playbackState.paused
    },
    matchingPlaylist() {
      return this.$store.state.playlists.find(
        p => p.id === this.track.playlist_matches
      )
    },
    imageUrl() {
      return this.track.album.images.max("height").url
    },
    track() {
      return this.$store.getters.currentTrack
    },
    playlists() {
      return this.$store.state.playlists
    }
  },
  methods: {
    setMatchingPlaylist(e) {
      this.$store.commit('setMatchingPlaylist', {
        trackId: this.track.id,
        playlistId: e.target.value
      })
    }
  }
}
</script>

<style scoped>
.currently-playing {
  height: 400px;
  min-height: 380px;
}

.currently-playing img {
  height: 280px;
}
</style>
