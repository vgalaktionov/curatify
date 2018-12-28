(ns curatify.core
  (:require [reagent.core :as r]
            [goog.events :as events]
            [goog.history.EventType :as HistoryEventType]
            [markdown.core :refer [md->html]]
            [curatify.ajax :as ajax]
            [curatify.api :as api]
            [curatify.store :refer [session device-id playback-status]]
            [curatify.components.curate :refer [curate]]
            [curatify.components.playlists :refer [playlists-screen]]
            [ajax.core :refer [GET POST]]
            [secretary.core :as secretary :include-macros true])
  (:import goog.History))


;(set! *warn-on-infer* true)


(defn authenticated? []
  (not-empty (:user @session)))


(defn nav-link [uri title page]
  [:a.navbar-item {:href uri :class (when (= page (:page @session)) "is-active")} title])


(defn login-button []
  [:div.navbar-item
   [:a.button.is-spotify {:href "/auth/login"}
    [:span.icon
     [:i.mdi.mdi-spotify]]
    [:span "Login with Spotify"]]])


(defn logout-button []
  [:div.navbar-item
   [:a.button.is-primary.is-inverted.is-outlined {:href "/auth/logout"
                                                  :on-click #(swap! session dissoc :user)}
    "Logout"]])


(defn navbar []
  [:nav.navbar
   [:div.navbar-brand
    [:a.navbar-item.is-logo {:href "/"}
     [:img {:src "/img/logo_transparent.png" :width 100}]]]
   [:div.navbar-menu
    (when (authenticated?)
      [:div.navbar-start
       [nav-link "#/" "Curate" :curate]
       ;[nav-link "#/about" "About" :about]
       [nav-link "#/playlists" "Playlists" :playlists]])
    [:div.navbar-end

     (if (authenticated?)
       [:<>
        [:div.navbar-item (str "Welcome, " (get-in @session [:user :display_name]))]
        [logout-button]]
       [login-button])]]])

;
;(defn about-page []
;  [:div.container
;   [:div.row
;    [:div.col-md-12
;     [:img {:src "/img/warning_clojure.png"}]]]])


(defn curate-page []
  [:section.section
   [:div.container
    [:div.columns
     (if (authenticated?)
       [curate])]]])


(defn playlists-page []
  [:section.section
   [:div.container.text-center
    [:div.columns.is-centered
     [playlists-screen]]]])


(def pages
  {:curate #'curate-page
   ;:about #'about-page
   :playlists #'playlists-page})



(defn page []
  [(pages (:page @session))])

;; -------------------------
;; Routes

(secretary/set-config! :prefix "#")

(secretary/defroute "/" []
                    (swap! session assoc :page :curate))

;(secretary/defroute "/about" []
;                    (swap! session assoc :page :about))

(secretary/defroute "/playlists" []
                    (swap! session assoc :page :playlists))

;; -------------------------
;; History
;; must be called after routes have been defined
(defn hook-browser-navigation! []
  (doto (History.)
        (events/listen
          HistoryEventType/NAVIGATE
          (fn [event]
            (secretary/dispatch! (.-token event))))
        (.setEnabled true)))

;; -------------------------
;; Initialize app

(defn mount-components []
  (r/render [#'navbar] (.getElementById js/document "navbar"))
  (r/render [#'page] (.getElementById js/document "app")))


(defn extract [js-object key]
  (get (js->clj js-object) key))


(defn poll-player [^js/Spotify.Player player]
  (fn []
    (let [promise (.getCurrentState player)]
      (.then promise (fn [state]
                       (if (nil? state)
                         (.debug js/console "User is not playing music through the Web Playback SDK")
                         (reset! playback-status (js->clj state))))))))


(defn configure-spotify []
  (set! (.-onSpotifyWebPlaybackSDKReady js/window)
        (fn []
          (let [token (get-in @session [:user :token :access_token])
                player (js/Spotify.Player. (js-obj "name" "Curatify Player" "getOAuthToken" (fn [cb] (cb token))))]
            (.addListener player "initialization_error" (fn [obj] (.error js/console (extract obj "message"))))
            (.addListener player "authentication_error" (fn [obj] (.error js/console (extract obj "message"))))
            (.addListener player "account_error" (fn [obj] (.error js/console (extract obj "message"))))
            (.addListener player "playback_error" (fn [obj] (.error js/console (extract obj "message"))))
            (.addListener player "player_state_changed" (fn [obj]
                                                          (reset! playback-status (js->clj obj))
                                                          (.log js/console @playback-status)))
            (.addListener player "ready" (fn [props]
                                           (let [id (extract props "device_id")]
                                             (reset! device-id id)
                                             (.log js/console (str "Ready with Device ID " id)))))
            (.addListener player "not_ready" (fn [props]
                                               (let [id (extract props "device_id")]
                                                 (.log js/console (str "Device ID has gone offline " id)))))
            (.connect player)
            (.setInterval js/window (poll-player player) 1000)
            (.log js/console @device-id)))))


(defn init! []
  (ajax/load-interceptors!)
  (api/fetch-user!)
  (api/fetch-inbox!)
  (api/fetch-playlists!)
  (configure-spotify)
  (hook-browser-navigation!)
  (mount-components))
