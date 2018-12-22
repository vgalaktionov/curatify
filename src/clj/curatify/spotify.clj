(ns curatify.spotify
  (:require [ring.util.codec :refer [form-encode]]
            [curatify.config :refer [env]]
            [clj-http.client :as client]))

(defn client-id [] (-> env :spotify :client-id))
(defn client-secret [] (-> env :spotify :client-secret))
(defn redirect-uri [] (-> env :spotify :redirect-uri))

(def accounts "https://accounts.spotify.com")
(def api "https://api.spotify.com/v1")

(def auth-url
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
  (:body (client/get (str api "/me") {:as :json
                                      :headers {"Authorization" (str "Bearer " access)}})))
