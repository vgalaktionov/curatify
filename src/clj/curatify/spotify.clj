(ns curatify.spotify
  (:require [ring.util.codec :refer [form-encode]]
            [curatify.config :refer [env]]
            [clj-http.client :as client]
            [clojure.tools.logging :as log]))

(defn client-id [] (-> env :spotify :client-id))
(defn client-secret [] (-> env :spotify :client-secret))
(defn redirect-uri [] (-> env :spotify :redirect-uri))


(defn api-req [method url access]
  (method url {:as :json :headers {"Authorization" (str "Bearer " access)}}))


(def accounts "https://accounts.spotify.com")
(def api "https://api.spotify.com/v1")


(defn auth-url []
  (str accounts "/authorize?"
       (form-encode {:client_id (client-id)
                     :redirect_uri (redirect-uri)
                     :response_type "code"
                     :scope "user-read-email user-library-read user-library-modify"})))


(defn get-token [code]
  (:body (client/post (str accounts "/api/token")
                      {:form-params {:grant_type "authorization_code"
                                     :code code
                                     :redirect_uri (redirect-uri)
                                     :client_id (client-id)
                                     :client_secret (client-secret)}
                       :as :json})))


(defn me [{access :access_token}]
  (:body (api-req client/get (str api "/me") access)))


(defn paginate [access-token endpoint]
  (loop [next-page (str api endpoint)
         acc []]
    (if (nil? next-page)
      acc
      (let [{{:keys [items next]} :body} (api-req client/get next-page access-token)]
        (recur next
               (into [] (concat acc items)))))))


(defn me-playlists [{access :access_token}]
  (paginate access "/me/playlists"))


(defn playlist-tracks [playlist-id {access :access_token}]
  (paginate access (str "/playlists/" playlist-id "/tracks")))
