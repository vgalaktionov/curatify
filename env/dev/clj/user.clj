(ns user
  (:require [curatify.config :refer [env]]
            [clojure.spec.alpha :as s]
            [expound.alpha :as expound]
            [mount.core :as mount]
            [curatify.figwheel :refer [start-fw stop-fw cljs]]
            [curatify.core :refer [start-app]]
            [curatify.db.core]
            [conman.core :as conman]
            [luminus-migrations.core :as migrations]))

(alter-var-root #'s/*explain-out* (constantly expound/printer))

(defn start []
  (mount/start-without #'curatify.core/repl-server))

(defn stop []
  (mount/stop-except #'curatify.core/repl-server))

(defn restart []
  (stop)
  (start))

(defn restart-db []
  (mount/stop #'curatify.db.core/*db*)
  (mount/start #'curatify.db.core/*db*)
  (binding [*ns* 'curatify.db.core]
    (conman/bind-connection curatify.db.core/*db* "sql/queries.sql")))

(defn reset-db []
  (migrations/migrate ["reset"] (select-keys env [:database-url])))

(defn migrate []
  (migrations/migrate ["migrate"] (select-keys env [:database-url])))

(defn rollback []
  (migrations/migrate ["rollback"] (select-keys env [:database-url])))

(defn create-migration [name]
  (migrations/create name (select-keys env [:database-url])))


