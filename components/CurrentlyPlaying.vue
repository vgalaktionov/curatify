<template>
  <div class="column is-12 has-text-centered currently-playing">
    <img :src="imageUrl">
    <h5 class="is-size-5">{{ track.name }}</h5>
    <p v-if="track.artists">{{ track.artist_names.join(', ') }}</p>
    <p v-if="playing" class="is-size-7">matches: {{ matchingPlaylist }}</p>
  </div>
</template>

<script>
export default {
  computed: {
    playing() {
      return !this.$store.state.playbackState.paused
    },
    matchingPlaylist() {
      return this.$store.state.playlists.find(p => p.id === this.track.playlist_matches).name
    },
    imageUrl() {
      return this.track.album.images.max('height').url
    },
    track() {
      return this.$store.getters.currentTrack
    }
  }
}
</script>

<style scoped>
.currently-playing {
    height: 380px;
    min-height: 380px;
}

.currently-playing img {
    height: 280px;
}
</style>
