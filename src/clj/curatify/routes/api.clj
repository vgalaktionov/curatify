(ns curatify.routes.api
  (:require
    [curatify.db.core :as db]
    [curatify.spotify :as spotify]
    [compojure.core :refer [defroutes GET POST]]
    [ring.util.http-response :as response]
    [clojure.tools.logging :as log]))


(defn inbox [{session :session :as req}]
  (->> {:id (get-in session [:identity :id])}
       (db/get-user-inbox)
       (assoc {} :body)
       (response/ok)))


(defn playlists [{session :session :as req}]
  (->> {:id (get-in session [:identity :id])}
       (db/get-user-playlists)
       (assoc {} :body)
       (response/ok)))


(defn change-playlist-type [{{:keys [new-type id]} :params :as req}]
  (println new-type id)
  (if (not (some #(= % new-type) ["inbox" "ignored" "curated"]))
    (-> "new playlist type is not valid!"
      (response/bad-request))
    (do
      (db/change-playlist-type! {:id id :new-type new-type})
      (response/ok))))


(defroutes api-routes
           (GET "/api/inbox" req (inbox req))
           (GET "/api/playlists" req (playlists req))
           (POST "/api/playlists/:id/change-type" req (change-playlist-type req)))
