(ns curatify.tasks.analyze
  (:require [curatify.db.core :as db]))

(defn artist-affinity [playlist-id]
  (let  [affinities (into [] (db/playlist-artist-affinity {:playlist-id playlist-id}))
         total (:count (db/playlist-track-count {:playlist-id playlist-id}))]
    (as-> affinities aa
         (reduce
           (fn [acc {:keys [artist_id count name]}]
             (assoc acc artist_id {:name name
                                   :percentage (/ count total)}))
           {}
           aa)
         (db/update-artist-affinities! {:playlist-id playlist-id :aa aa}))))