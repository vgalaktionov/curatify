(ns curatify.spotify
  (:require [curatify.ajax :as ajax]
            [curatify.store :refer [device-id session playback-status]]
            [ajax.core :refer [PUT POST]]))


(def api "https://api.spotify.com/v1")


(defn api-req
  ([method url] (api-req method url {}))
  ([method url opts]
   (let [token (get-in @session [:user :token :access_token])]
     (method (str api url) (merge-with into opts {:format :json
                                                  :headers {"Authorization" (str "Bearer " token)}
                                                  :params {:access_token token}})))))


(defn play [uris]
  (let [position (get @playback-status "position")
        params (if (nil? position)
                 {:uris uris}
                 {:position_ms position})]
    (api-req PUT "/me/player/play" {:params params :url-params {:device_id @device-id}})))


(defn pause []
  (api-req PUT "/me/player/pause" {:url-params {:device_id @device-id}}))


(defn next-track []
  (api-req POST "/me/player/next" {:url-params {:device_id @device-id}}))


(defn previous-track []
  (api-req POST "/me/player/previous" {:url-params {:device_id @device-id}}))