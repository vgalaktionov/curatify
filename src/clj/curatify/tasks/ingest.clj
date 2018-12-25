(ns curatify.tasks.ingest
  (:require [curatify.db.core :as db]
            [curatify.spotify :as spotify]
            [clojure.tools.logging :as log]
            [clojure.core.async :as async]))


(defn expiring? [token]
  (> (quot (System/currentTimeMillis) 1000)
     (- 60 (:expires-at token))))


(defn update-user-token [{token :token :as user}]
  (if (expiring? token)
    (let [user (->> (spotify/refresh-token token)
                    (merge token)
                    (assoc user :token))]
      (db/upsert-user! user)
      user)
    user))


(defn ingest-user-playlists [{user-id :id token :token :as user}]
  (->> (spotify/me-playlists token)
       (map (fn [{:keys [id name images]}] [id user-id name false images]))
       (assoc {} :playlists)
       (db/upsert-playlists!))
  user)


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


(defn ingest-user-playlist-tracks [{user-id :id token :token :as user}]
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
      (ingest-track-artists tracks)))
  user)


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
  (-> (update-user-token user)
      (ingest-user-playlists)
      (ingest-user-playlist-tracks)
      (db/update-inbox!)))


(defn ingest-all []
  (log/info "ingesting for all users...")
  (doseq [user (db/get-users)]
    (log/info (str "ingesting for user " (:id user) "..."))
    (log/info (with-out-str (time (ingest-for-user user)))))
  (log/info "enriching artist data...")
  (log/info (with-out-str (time (ingest-artist-details)))))
