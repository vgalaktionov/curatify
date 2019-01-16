<template>
  <div class="columns">
    <InboxList />
    <div class="column is-1" />
    <Player />
  </div>
</template>

// (defn playing? []
//   (false? (get @playback-status "paused")))


// (defn track-duration []
//   (get @playback-status "duration"))


// (defn track-position []
//   (get @playback-status "position"))


// (defn current-track-info []
//   (get-in @playback-status ["track_window" "current_track"]))


// (defn lookup-track-id-in-inbox [id]
//   (some #(if (= (:id %) id) %) (:inbox @session)))


// (defn lookup-playlist [id]
//   (some #(if (= (:id %) id) %) @playlists))


// (defn play-pause []
//   (let [uris (vec (map #(str "spotify:track:" (:id %)) (take 10 (:inbox @session))))]
//     (if (not (playing?))
//       (play uris)
//       (pause))))


// (defn generic-playback
//   ([icon-class] [generic-playback icon-class #()])
//   ([icon-class clickhandler]
//    [:div.column.is-one-fifth
//     [:button.playback {:on-click clickhandler}
//      [:span.icon.is-large
//       [:i {:class icon-class}]]]]))


// (defn play-pause-button []
//   [generic-playback (if (not (playing?))
//                       "mdi mdi-play"
//                       "mdi mdi-pause") play-pause])


// (defn next-button []
//   [generic-playback "mdi mdi-skip-next" next-track])


// (defn previous-button []
//   [generic-playback "mdi mdi-skip-previous" previous-track])


// (defn like-button []
//   [generic-playback "mdi mdi-thumb-up" (fn []
//                                          (let [id (get (current-track-info) "id")]
//                                            (like-track! id)
//                                            (swap! liked conj id)
//                                            (println @liked)))])


// (defn dislike-button []
//   [generic-playback "mdi mdi-thumb-down" (fn []
//                                            (let [id (get (current-track-info) "id")]
//                                              (dislike-track! id)
//                                              (next-track)
//                                              (swap! disliked conj id)))])


// (defn track-progress []
//   [:div.column.is-12.has-text-centered
//    [:progress.progress {:max (track-duration) :value (track-position)}]])


// (defn currently-playing []
//   (let [track-info (current-track-info)
//         track-name (get track-info "name")
//         track-id (get track-info "id")
//         track-playing (not (nil? track-info))
//         inbox-track (lookup-track-id-in-inbox track-id)
//         matching-playlist (if (and track-playing inbox-track)
  (->> (or (:playlist_affinities inbox-track) {})
//                                                                    (apply max-key val)
//                                                                    (first)
//                                                                    (name)
//                                                                    (lookup-playlist)))
//         track-artists (->> (get track-info "artists")
//                            (map #(get % "name"))
//                            (str/join ", "))
//         large-image (->>
(get-in @playback-status ["track_window" "current_track" "album" "images"])
//                          (apply max-key :height))]
//     [:div.column.is-12.has-text-centered.currently-playing
//      [:img {:src (get large-image "url")}]
//      [:h5.is-size-5 track-name]
//      [:p track-artists]
//      (if track-playing [:p.is-size-7 (str "matches: " (:name matching-playlist))])]))




// (defn player-layout []
//   [:div.column.is-6.player
//    [:div.columns
//     [currently-playing]]
//    [:div.columns
//     [track-progress]]
//    [:div.columns.playback-buttons.is-vcentered.has-text-centered
//     [dislike-button]
//     [previous-button]
//     [play-pause-button]
//     [next-button]
//     [like-button]]])


<script>
import InboxList from '~/components/InboxList'
import Player from '~/components/Player'

export default {
  components: {
    Player,
    InboxList
  },
  middleware: 'auth'
}
</script>


<style scoped>
img.play-spinner {
    padding-top: 0.5rem;
}

.playback {
    font-size: 40pt;
    border-color: transparent;
    outline: none;
}

.playback:hover {
    color: rgb(129, 135, 141);
}

.playback-buttons {
    /*margin-left: 6rem;*/
}


.album-art {
    min-height: 300px;
}

.player {
    /*margin-left: 6rem;*/
}

.currently-playing {
    height: 380px;
    min-height: 380px;
}

.currently-playing img {
    height: 280px;
}
</style>
