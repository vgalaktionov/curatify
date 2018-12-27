(ns curatify.components.curate
  (:require [curatify.store :refer [session playback-status]]
            [curatify.spotify :refer [play pause previous-track next-track]]
            [reagent.core :as r]))


(defn playing? []
  (false? (get @playback-status "paused")))


(defn track-duration []
  (get @playback-status "duration"))


(defn track-position []
  (get @playback-status "position"))


(defn inbox-list []
  [:nav.panel.column.is-4
   [:p.panel-heading "INBOX TRACKS"]
   (map (fn [item] ^{:key (:id item)} [:a.panel-block (:name item)])
        (take 10 (:inbox @session)))])


(defn play-pause []
  (let [uris (vec (map #(str "spotify:track:" (:id %)) (:inbox @session)))]
    (if (not (playing?))
      (play uris)
      (pause))))


(defn generic-playback
  ([icon-class] [generic-playback #() icon-class])
  ([clickhandler icon-class]
   [:div.column.is-one-fifth
    [:button.playback {:on-click clickhandler}
     [:span.icon.is-large
      [:i {:class icon-class}]]]]))


(defn play-pause-button []
  [generic-playback play-pause (if (not (playing?))
                                 "mdi mdi-play"
                                 "mdi mdi-pause")])


(defn next-button []
  [generic-playback next-track "mdi mdi-skip-next"])


(defn previous-button []
  [generic-playback previous-track "mdi mdi-skip-previous"])


(defn like-button []
  [generic-playback "mdi mdi-thumb-up"])


(defn dislike-button []
  [generic-playback "mdi mdi-thumb-down"])


(defn track-progress []
  [:progress.progress {:max (track-duration) :value (track-position)}])


(defn player-layout []
  [:div.column.is-6.player
   [:div.columns
    [:div.column.is-half.is-offset-one-quarter.has-text-centered
     [:div.album-art]]]
   [:div.columns
    [track-progress]]
   [:div.columns.playback-buttons.is-vcentered
    [dislike-button]
    [previous-button]
    [play-pause-button]
    [next-button]
    [like-button]]])



(defn curate []
  [:<>
   [inbox-list]
   [:div.column.is-1]
   [player-layout]])
