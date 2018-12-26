(ns curatify.spotify
  (:require [curatify.ajax :as ajax]
            [curatify.store :refer [device-id session]]
            [ajax.core :refer [PUT]]))


(def api "https://api.spotify.com/v1")


(defn api-req
  ([method url] (api-req method url {}))
  ([method url opts]
   (let [token (get-in @session [:user :token :access_token])]
     (method (str api url) (conj opts {:format :json
                                       :headers {"Authorization" (str "Bearer " token)}})))))


(defn play [uris]
  (api-req PUT "/me/player/play" {:params {:uris uris} :url-params {:device_id @device-id}}))


(defn pause []
  (api-req PUT "/me/player/pause" {:url-params {:device_id @device-id}}))