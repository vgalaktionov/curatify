(ns curatify.tasks.core
  (:require [immutant.scheduling :as scheduling]
            [mount.core :refer [defstate]]
            [curatify.tasks.analyze :refer [analyze-all]]
            [curatify.tasks.ingest :refer [ingest-all]]
            [clojure.tools.logging :as log]))


(defn schedule-jobs []
  (log/warn "Scheduling periodic jobs to run...")
  (scheduling/schedule #(fn []
                          (ingest-all)
                          (analyze-all))
   (scheduling/every 5 :minutes)))


(defstate jobs
          :start (schedule-jobs)
          :stop (scheduling/stop))