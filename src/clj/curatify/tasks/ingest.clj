(ns curatify.tasks.ingest
  (:require [curatify.db.core :as db]
            [curatify.spotify :as spotify]
            [clojure.tools.logging :as log]
            [clojure.core.async :as async]))


(defn ingest-user-playlists [{user-id :id token :token}]
  (->> (spotify/me-playlists token)
       (map (fn [{:keys [id name images]}] [id user-id name false images]))
       (assoc {} :playlists)
       (db/upsert-playlists!)))


(defn ingest-track-artists [tracks]
  (->> tracks
       (map :artists)
       (flatten)
       (distinct)
       (map (fn [{:keys [id name]}] [id name]))
       (assoc {} :artists)
       (db/insert-artists!))
  (->> tracks
       (map (fn [{:keys [artists id]}]
              (for [artist artists]
                [id (:id artist)])))
       (mapcat identity) ; flatten 1 level
       (assoc {} :artist-tracks)
       (db/insert-artist-tracks!)))


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
           (db/insert-playlist-tracks!))
      (ingest-track-artists tracks))))


(defn ingest-artist-details []
  (let [artist-chunks (->> (db/get-artist-ids)
                           (map :id)
                           (partition 50))]
       (doall (pmap
                (fn [ac] (->> (spotify/artists ac)
                              (map (fn [{:keys [id images genres]}] [id images genres]))
                              (assoc {} :artists)
                              (db/enrich-artists!)))
                artist-chunks))))


(defn ingest-for-user [user]
  (ingest-user-playlists user)
  (ingest-user-playlist-tracks user)
  (db/update-inbox! user))


(defn ingest-all []
  (println "ingesting for all users...")
  (doseq [user (db/get-user-ids-and-tokens)]
    (println (str "ingesting for user " (:id user) "..."))
    (time (ingest-for-user user)))
  (println "enriching artist data...")
  (time (ingest-artist-details)))
