<template>
  <div class="columns is-centered">
    <div class="column is-narrow">
      <table class="table center-table">
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <PlaylistRow v-for="playlist in playlists" :key="playlist.id" :playlist="playlist"/>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import PlaylistRow from '~/components/PlaylistRow'
export default {
  components: {
    PlaylistRow
  },
  computed: {
    playlists() {
      return this.$store.state.playlists
    }
  }
}
</script>


<style scoped>
</style>
