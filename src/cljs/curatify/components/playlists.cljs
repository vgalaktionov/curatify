(ns curatify.components.playlists
  (:require [reagent.core :as r]
            [curatify.api :as api]
            [curatify.store :refer [playlists]]))


(defn playlist-row [{:keys [id name curated inbox images]}]
  (let [large-image (apply min-key :height images)]
    ^{:key id} [:tr
                [:td
                 [:img.playlist-cover {:src (:url large-image)}]]
                [:td name]
                [:td
                 [:input {:type "checkbox" :checked curated}]]
                [:td
                 [:input {:type "checkbox" :checked inbox}]]]))


(defn playlists-table []
  (api/fetch-playlists!)
  (fn []
    [:table.table.center-table
     [:thead
      [:tr
       [:th]
       [:th "Name"]
       [:th "Curated"]
       [:th "Inbox"]]]
     [:tbody
      (map playlist-row @playlists)]]))


(defn playlists-screen []
  [:div.column.is-narrow
   [playlists-table]])
