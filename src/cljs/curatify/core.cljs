(ns curatify.core
  (:require [reagent.core :as r]
            [goog.events :as events]
            [goog.history.EventType :as HistoryEventType]
            [markdown.core :refer [md->html]]
            [curatify.ajax :as ajax]
            [ajax.core :refer [GET POST]]
            [secretary.core :as secretary :include-macros true])
  (:import goog.History))


(defonce session (r/atom {:page :home :user {} :inbox []}))


(defn authenticated? []
  (not-empty (:user @session)))


(defn nav-link [uri title page]
  [:a.navbar-item {:href uri :class (when (= page (:page @session)) "is-active")} title])


(defn login-button []
  [:div.navbar-item
   [:a.button.is-spotify {:href "/auth/login"}
    [:span.icon
     [:i.fab.fa-spotify]]
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
     [:img {:src "/img/logo_transparent.png" :width 150}]]]
   [:div.navbar-menu
    [:div.navbar-start
     [nav-link "#/" "Home" :home]
     [nav-link "#/about" "About" :about]]
    [:div.navbar-end

     (if (authenticated?)
       [:<>
        [:div.navbar-item (str "Welcome, " (get-in @session [:user :display_name]))]
        [logout-button]]
       [login-button])]]])


(defn about-page []
  [:div.container
   [:div.row
    [:div.col-md-12
     [:img {:src "/img/warning_clojure.png"}]]]])


(defn inbox-list []
  [:nav.panel
   [:p.panel-heading "Inbox tracks"]
   (map (fn [item] ^{:key (:id item)} [:a.panel-block (:name item)]) (:inbox @session))])


(defn home-page []
  [:section.section
   [:div.container.text-center
    (if (authenticated?)
      [inbox-list])]])


(def pages
  {:home #'home-page
   :about #'about-page})


(defn page []
  [(pages (:page @session))])

;; -------------------------
;; Routes

(secretary/set-config! :prefix "#")

(secretary/defroute "/" []
  (swap! session assoc :page :home))

(secretary/defroute "/about" []
  (swap! session assoc :page :about))

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

(defn fetch-user! []
  (GET "/auth/me" {:handler #(swap! session assoc :user (:body %))}))

(defn fetch-inbox! []
  (GET "/api/inbox" {:handler #(swap! session assoc :inbox (:body %))}))

(defn mount-components []
  (r/render [#'navbar] (.getElementById js/document "navbar"))
  (r/render [#'page] (.getElementById js/document "app")))

(defn init! []
  (ajax/load-interceptors!)
  (fetch-user!)
  (fetch-inbox!)
  (hook-browser-navigation!)
  (mount-components)
  (.log js/console session))
