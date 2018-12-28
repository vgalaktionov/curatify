(ns curatify.routes.api
  (:require
    [curatify.db.core :as db]
    [curatify.spotify :as spotify]
    [compojure.core :refer [defroutes GET POST]]
    [ring.util.http-response :as response]
    [clojure.tools.logging :as log]))


(defn inbox [{session :session :as req}]
  (->> {:id (get-in session [:identity :id])}
       (db/get-user-unheard-inbox)
       (assoc {} :body)
       (response/ok)))


(defn playlists [{session :session :as req}]
  (->> {:id (get-in session [:identity :id])}
       (db/get-user-playlists)
       (assoc {} :body)
       (response/ok)))


(defn change-playlist-type [{{:keys [new-type id]} :params :as req}]
  (if (not (some #(= % new-type) ["inbox" "ignored" "curated"]))
    (-> "new playlist type is not valid!"
      (response/bad-request))
    (do
      (db/change-playlist-type! {:id id :new-type new-type})
      (response/ok))))


(defn like-track [{{{user-id :id token :token} :identity} :session {track-id :id} :params}]
  (let [db-params {:track-id track-id :user-id user-id}
        inbox-track (db/get-inbox-track db-params)
        track-aff (apply max-key val (:playlist_affinities inbox-track))]
       (spotify/add-tracks-to-playlist! (first track-aff) [track-id] token)
       (db/set-inbox-track-status! (assoc db-params :status "liked"))
       (response/ok)))


(defn dislike-track [{{{user-id :id} :identity} :session {track-id :id} :params}]
    (db/set-inbox-track-status! {:track-id track-id :user-id user-id :status "disliked"})
    (response/ok))


(defroutes api-routes
           (GET "/api/inbox" req (inbox req))
           (GET "/api/playlists" req (playlists req))
           (POST "/api/playlists/:id/change-type" req (change-playlist-type req))
           (POST "/api/tracks/:id/like" req (like-track req))
           (POST "/api/tracks/:id/dislike" req (dislike-track req)))
