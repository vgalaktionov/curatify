(ns curatify.components.playlists
  (:require [reagent.core :as r]
            [curatify.api :as api]
            [curatify.store :refer [playlists]]))


(defn playlist-row [{:keys [id name playlist_type images]}]
  (let [large-image (apply min-key :height images)]
    ^{:key id} [:tr
                [:td
                 [:img.playlist-cover {:src (:url large-image)}]]
                [:td name]
                [:td
                 [:div.select
                  [:select {:on-change (fn [evt]
                                         (api/change-playlist-type! id (-> evt .-target .-value))
                                         (api/fetch-playlists!))}
                   (for [p-type ["ignored" "curated" "inbox"]]
                     ^{:key p-type} [:option {:selected (= playlist_type p-type)}
                                     p-type])]]]]))



(defn playlists-table []
  (api/fetch-playlists!)
  (fn []
    [:table.table.center-table
     [:thead
      [:tr
       [:th]
       [:th "Name"]
       [:th "Type"]]]
     [:tbody
      (map playlist-row (sort-by :id @playlists))]]))


(defn playlists-screen []
  [:div.column.is-narrow
   [playlists-table]])
