(ns curatify.routes.auth
  (:require
   [curatify.db.core :as db]
   [curatify.spotify :as spotify]
   [compojure.core :refer [defroutes GET]]
   [ring.util.http-response :as response]
   [clojure.tools.logging :as log]))


(defn login []
  (response/found (spotify/auth-url)))


(defn callback [{:keys [params session]}]
  (let [token (spotify/get-token (:code params))
        user (assoc (spotify/me token) :token token)]
    (db/upsert-user! user)
    (-> (response/found "/")
        (assoc :session (assoc session :user user)))))


(defn logout []
  (-> (response/found "/")
      (assoc :session nil)))


(defn me [{session :session}]
  (-> {:body (:user session)}
      (response/content-type "application/transit+json")
      response/ok))


(defroutes auth-routes
  (GET "/auth/login" [] (login))
  (GET "/auth/callback" req (callback req))
  (GET "/auth/logout" [] (logout))
  (GET "/auth/me" req (me req)))
