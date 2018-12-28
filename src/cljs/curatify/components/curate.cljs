(ns curatify.components.curate
  (:require [curatify.store :refer [session playback-status liked disliked]]
            [curatify.spotify :refer [play pause previous-track next-track]]
            [clojure.string :as str]
            [curatify.api :refer [like-track! fetch-inbox! dislike-track!]]
            [reagent.core :as r]))


(defn playing? []
  (false? (get @playback-status "paused")))


(defn track-duration []
  (get @playback-status "duration"))


(defn track-position []
  (get @playback-status "position"))


(defn current-track-info []
  (get-in @playback-status ["track_window" "current_track"]))


(defn track-line [{:keys [id name]}]
  ^{:key id} [:tr
              [:td name]
              [:td
               [:span.icon.is-small (cond
                                      (some #(= id %) @liked) [:i.mdi.mdi-thumb-up]
                                      (some #(= id %) @disliked) [:i.mdi.mdi-thumb-down]
                                      :else "")]]
              [:td (if (= id (get (current-track-info) "id")) [:span.icon.is-small
                                                               [:img.play-spinner {:src "img/playing.svg"}]])]])


(defn inbox-list []
  [:h4.is-size-4 "INBOX TRACKS"]
  [:table.table.column.is-4.center-table
   [:thead
    [:tr
     [:th "name"]
     [:th "status"]
     [:th]]]
   [:tbody
    (doall (map track-line
                (take 10 (:inbox @session))))]])


(defn play-pause []
  (let [uris (vec (map #(str "spotify:track:" (:id %)) (take 10 (:inbox @session))))]
    (if (not (playing?))
      (play uris)
      (pause))))


(defn generic-playback
  ([icon-class] [generic-playback icon-class #()])
  ([icon-class clickhandler]
   [:div.column.is-one-fifth
    [:button.playback {:on-click clickhandler}
     [:span.icon.is-large
      [:i {:class icon-class}]]]]))


(defn play-pause-button []
  [generic-playback (if (not (playing?))
                      "mdi mdi-play"
                      "mdi mdi-pause") play-pause])


(defn next-button []
  [generic-playback "mdi mdi-skip-next" next-track])


(defn previous-button []
  [generic-playback "mdi mdi-skip-previous" previous-track])


(defn like-button []
  [generic-playback "mdi mdi-thumb-up" (fn []
                                         (let [id (get (current-track-info) "id")]
                                           (like-track! id)
                                           (swap! liked conj id)
                                           (println @liked)))])


(defn dislike-button []
  [generic-playback "mdi mdi-thumb-down" (fn []
                                           (let [id (get (current-track-info) "id")]
                                             (dislike-track! id)
                                             (next-track)
                                             (swap! disliked conj id)))])


(defn track-progress []
  [:div.column.is-12.has-text-centered
   [:progress.progress {:max (track-duration) :value (track-position)}]])


(defn currently-playing []
  (let [track-info (current-track-info)
        track-name (get track-info "name")
        track-artists (->> (get track-info "artists")
                           (map #(get % "name"))
                           (str/join ", "))
        large-image (->> (get-in @playback-status ["track_window" "current_track" "album" "images"])
                         (apply max-key :height))]
    [:div.column.is-12.has-text-centered.currently-playing
     [:img {:src (get large-image "url")}]
     [:h5.is-size-5 track-name]
     [:p track-artists]]))




(defn player-layout []
  [:div.column.is-6.player
   [:div.columns
    [currently-playing]]
   [:div.columns
    [track-progress]]
   [:div.columns.playback-buttons.is-vcentered.has-text-centered
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
