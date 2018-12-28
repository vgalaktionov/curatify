(ns curatify.routes.api
  (:require
    [curatify.db.core :as db]
    [curatify.spotify :as spotify]
    [compojure.core :refer [defroutes GET]]
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


(defroutes api-routes
           (GET "/api/inbox" req (inbox req))
           (GET "/api/playlists" req (playlists req)))
