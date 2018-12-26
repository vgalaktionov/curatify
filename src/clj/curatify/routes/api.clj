(ns curatify.routes.api
  (:require
    [curatify.db.core :as db]
    [curatify.spotify :as spotify]
    [compojure.core :refer [defroutes GET]]
    [ring.util.http-response :as response]
    [clojure.tools.logging :as log]))


(defn inbox [{session :session :as req}]
  (as-> {:id (get-in session [:user :id])} v
        (db/get-user-inbox v)
        (assoc {} :body v)
        (log/spy v)
        (response/ok v)))
        ;(response/content-type v "application/transit+json")))


(defroutes api-routes
           (GET "/api/inbox" req (inbox req)))
