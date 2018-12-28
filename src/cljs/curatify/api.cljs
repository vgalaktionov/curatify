(ns curatify.api
  (:require [ajax.core :refer [GET POST]]
            [curatify.store :refer [session playlists]]))


(defn fetch-user! []
  (GET "/auth/me" {:handler #(swap! session assoc :user (:body %))}))


(defn fetch-inbox! []
  (GET "/api/inbox" {:handler #(swap! session assoc :inbox (:body %))}))


(defn fetch-playlists! []
  (GET "/api/playlists" {:handler #(reset! playlists (:body %))}))


(defn change-playlist-type! [playlist-id new-type]
  (POST (str "/api/playlists/" playlist-id "/change-type") {:params {:new-type new-type}}))