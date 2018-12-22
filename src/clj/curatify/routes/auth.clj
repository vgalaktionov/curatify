(ns curatify.routes.auth
  (:require
   [curatify.db.core :as db]
   [compojure.core :refer [defroutes GET]]
   [ring.util.http-response :as response]))

(defn login []
  (println "/auth/login"))

(defroutes auth-routes
  (GET "/auth/login" []
       (login)))
