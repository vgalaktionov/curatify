import React from "react";
import { useEffect } from "react";
import ReactDOM from "react-dom";
import { StoreProvider } from "easy-peasy";
import axios from "axios";

import spotifyPlayer from "./spotifyPlayer";
import Loading from "./components/Loading";
import Main from "./components/Main";
import store, { useStore, useActions } from "./store";

spotifyPlayer();

if (store.getState().user) {
  setInterval(async () => {
    const { data: user } = await axios.get("/auth/me");
    store.dispatch.user.setUser(user);
  }, 1000 * 5 * 60);
}

function App() {
  const initialFetch = useActions(actions => actions.user.getUser);
  useEffect(() => {
    initialFetch();
  }, []);
  const user = useStore(state => state.user.me);
  return user ? <Main /> : <Loading />;
}

ReactDOM.render(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>,
  document.querySelector("#app")
);
