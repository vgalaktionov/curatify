
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
