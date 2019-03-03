<template>
  <tr>
    <td>
      <img :src="playlist.images.min('height').url" alt="" class="playlist-cover">
    </td>
    <td>{{ playlist.name }}</td>
    <td>
      <div class="select">
        <select @change="setPlaylistType">
          <option
            v-for="t in types"
            :key="t"
            :value="t"
            :selected="t === playlist.playlist_type">
            {{ t }}
          </option>
        </select>
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    playlist: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return { types: ['ignored', 'curated', 'inbox'] }
  },
  methods: {
    setPlaylistType(e) {
      this.$store.dispatch('setPlaylistType', { id: this.playlist.id, type: e.target.value })
    }
  }
}
</script>

<style scoped>
img.playlist-cover {
    max-height: 60px;
    height: 60px;
}
</style>
