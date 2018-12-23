(ns curatify.tasks.ingest
  (:require [curatify.db.core :as db]
            [curatify.spotify :as spotify]
            [clojure.tools.logging :as log]))


(defn ingest-user-playlists [{user-id :id token :token}]
  (->> (spotify/me-playlists token)
       (map (fn [{:keys [id name images]}] [id user-id name false images]))
       (assoc {} :playlists)
       (db/upsert-playlists!)))


(defn ingest-user-playlist-tracks [{user-id :id token :token}]
  (doseq [playlist-id (map :id (db/get-user-playlist-ids {:id user-id}))]
    (let [tracks (->> (spotify/playlist-tracks playlist-id token)
                      (map :track)
                      (remove #(nil? (:id %))))]
      (->> tracks
           (map (fn [{:keys [id name]}] [id name]))
           (assoc {} :tracks)
           (db/upsert-tracks!))
      (db/wipe-playlist-tracks! {:id playlist-id})
      (->> tracks
           (map (fn [{id :id}] [id playlist-id]))
           (assoc {} :playlist-tracks)
           (db/insert-playlist-tracks!)))))


(defn ingest-for-user [user]
  (ingest-user-playlists user)
  (ingest-user-playlist-tracks user))


(defn ingest-all []
  (doseq [user (db/get-user-ids-and-tokens)]
    (time (ingest-for-user user))))
