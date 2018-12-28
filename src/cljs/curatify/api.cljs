(ns curatify.api
  (:require [ajax.core :refer [GET]]
            [curatify.store :refer [session playlists]]))


(defn fetch-user! []
  (GET "/auth/me" {:handler #(swap! session assoc :user (:body %))}))


(defn fetch-inbox! []
  (GET "/api/inbox" {:handler #(swap! session assoc :inbox (:body %))}))


(defn fetch-playlists! []
  (GET "/api/playlists" {:handler #(reset! playlists (:body %))}))