(ns curatify.routes.auth
  (:require
   [curatify.db.core :as db]
   [curatify.spotify :as spotify]
   [compojure.core :refer [defroutes GET]]
   [ring.util.http-response :as response]))

(defn login []
  (response/found spotify/auth-url))

(defn callback [req]
  (let [code (get-in req [:params :code])
        token (spotify/get-token code)
        user (spotify/me token)]
    ; (println req)
    ; (println code)
    (println user)
    (response/found "/")))


(defroutes auth-routes
  (GET "/auth/login" []
       (login))
  (GET "/auth/callback" []
       callback))
