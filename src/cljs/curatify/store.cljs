(ns curatify.store
  (:require [reagent.core :as r]))

(defonce session (r/atom {:page :home :user {} :inbox []}))
(defonce device-id (r/atom ""))
(defonce playback-status (r/atom {}))
(defonce playlists (r/atom []))
(defonce liked (r/atom #{}))
(defonce disliked (r/atom #{}))