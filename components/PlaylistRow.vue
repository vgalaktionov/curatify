<template>
  <!-- (defn playlist-row [{:keys [id name playlist_type images]}]
    (let [large-image (apply min-key :height images)]
      ^{:key id} [:tr
                  [:td
                  [:img.playlist-cover {:src (:url large-image)}]]
                  [:td name]
                  [:td
                  [:div.select
                    [:select {:on-change (fn [evt]
                                          (api/change-playlist-type! id (-> evt .-target .-value))
                                          (api/fetch-playlists!))}
                    (for [p-type ["ignored" "curated" "inbox"]]
                      ^{:key p-type} [:option {:selected (= playlist_type p-type)} p-type])]]]]))

 -->
  <tr>
    <td>
      <img :src="playlist.images.min('height').url" alt="" class="playlist-cover">
    </td>
    <td>{{ playlist.name }}</td>
    <td>
      <div class="select">
        <select @change="setPlaylistType">
          <!-- <option value="ignored">ignored</option>
          <option value="curated">curated</option>
          <option value="inbox">inbox</option> -->
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
