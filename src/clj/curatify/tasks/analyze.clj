(ns curatify.tasks.analyze
  (:require [curatify.db.core :as db]
            [clojure.tools.logging :as log]))

(defn playlist-affinities [playlist-id]
  (let  [artist-affinities (db/playlist-artist-affinity {:playlist-id playlist-id})
         genre-affinities (db/playlist-genre-affinity {:playlist-id playlist-id})
         total (:count (db/playlist-track-count {:playlist-id playlist-id}))]
    (as-> artist-affinities aa
         (reduce
           (fn [acc {:keys [artist_id count name]}]
             (assoc acc artist_id {:name name
                                   :percentage (/ count total)}))
           {}
           aa)
         (db/update-artist-affinities! {:playlist-id playlist-id :aa aa}))
    (as-> genre-affinities ga
          (reduce
            (fn [acc {:keys [genre count]}]
              (assoc acc genre (/ count total)))
            {}
            ga)
          (db/update-genre-affinities! {:playlist-id playlist-id :ga ga}))))


(defn track-affinities [playlist]
  (let [playlist-id (:id playlist)
        {genre-aff :genre_affinities artist-aff :artist_affinities} (db/get-playlist-affinities {:playlist-id playlist-id})
        user-id (:user_id playlist)
        tracks (db/get-user-unheard-inbox {:id user-id})]
    (doall (map (fn [track]
                  (let [genre-overlap (or (select-keys genre-aff (map keyword (:genres track))) {})
                        track-genre-aff (or (reduce + (vals genre-overlap)) 0)
                        artist-overlap (or (select-keys artist-aff (map keyword (:artists track))) {})
                        track-artist-aff (or (reduce + (map :percentage (vals artist-overlap))) 0)
                        total-aff (+ track-artist-aff track-genre-aff)]
                    (db/set-inbox-track-affinities {:user-id user-id
                                                    :track-id (:id track)
                                                    :playlist-aff (merge (:playlist_affinities track)
                                                                        {playlist-id total-aff})})))
                tracks))))



(defn analyze-all []
  (log/info "Analyzing all playlist affinities")
  (let [playlists (db/get-curated-playlists)]
    (log/info (with-out-str (time (doall (map playlist-affinities (map :id playlists))))))
    (log/info (with-out-str (time (doall (map track-affinities playlists)))))))
