(ns curatify.components.curate
  (:require [curatify.store :refer [session playback-status]]
            [curatify.spotify :refer [play pause]]
            [reagent.core :as r]))


(defn playing? []
  (false? (get @playback-status "paused")))


(defn inbox-list []
  [:nav.panel.column.is-one-third
   [:p.panel-heading "INBOX TRACKS"]
   (map (fn [item] ^{:key (:id item)} [:a.panel-block (:name item)])
        (take 10 (:inbox @session)))])


(defn play-pause []
  (let [uris (vec (map #(str "spotify:track:" (:id %)) (:inbox @session)))]
    (if (not (playing?))
      (play uris)
      (pause))))


(defn play-pause-button []
  [:div.column.is-one-fifth.is-offset-two-fifths
   [:button.playback {:on-click play-pause}
    [:span.icon.is-large
     [:i {:class (if (not (playing?))
                   "mdi mdi-play"
                   "mdi mdi-pause")}]]]])


(defn player-layout []
  [:div.column.is-two-thirds
   [:div.columns
    [:div.column.is-half.is-offset-one-quarter.has-text-centered
     [:div.columns
      [play-pause-button]]]]])



(defn curate []
  [:<>
   [inbox-list]
   [player-layout]])
