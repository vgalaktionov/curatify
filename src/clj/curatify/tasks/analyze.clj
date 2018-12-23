(ns curatify.tasks.analyze
  (:require [curatify.db.core :as db]))

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


(defn analyze-all []
  (println "Analyzing all playlist affinities")
  (time (doseq [playlist-id (map :id (db/get-playlist-ids))]
          (playlist-affinities playlist-id))))