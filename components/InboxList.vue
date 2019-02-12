<template>
  <div>
    <h4 class="is-size-4">INBOX TRACKS</h4>
    <table class="table column is-12 center-table">
      <thead>
        <tr>
          <th>name</th>
          <th>status</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="track in inbox" :key="track.id" >
          <td>{{ track.name }}</td>
          <td>
            <b-icon v-if="track.liked" icon="thumb-up"/>
            <b-icon v-else-if="track.disliked" icon="thumb-down"/>
            <span v-else/>
          </td>
          <td>
            <span v-if="nowPlaying(track)" class="icon is-small">
              <img src="/playing.svg" class="play-spinner">
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  computed: {
    inbox() {
      return this.$store.state.inbox ? this.$store.state.inbox.first(10) : []
    },
    currentTrack() {
      return this.$store.getters.currentTrack
    }
  },
  methods: {
    nowPlaying(track) {
      return this.currentTrack ? [
        this.currentTrack.id, this.currentTrack.linked_from_uri.remove('spotify:track:')
      ].includes(track.id) : false
    }
  }
}
</script>

<style scoped>
img.play-spinner {
    padding-top: 0.5rem;
}
</style>
