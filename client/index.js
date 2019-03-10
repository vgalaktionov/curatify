/* eslint-disable import/first */
import Sugar from 'sugar'
Sugar.extend()

import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { StoreProvider, useStore, useActions } from 'easy-peasy'
import axios from 'axios'

import spotifyPlayer from './spotifyPlayer'
import Loading from './components/Loading.jsx'
import Main from './components/Main.jsx'
import store from './store'
import './index.scss'

spotifyPlayer()

if (store.getState().user) {
  setInterval(async () => {
    const { data: user } = await axios.get('/auth/me')
    store.dispatch.setUser(user)
  }, 1000 * 5 * 60)
}

function App () {
  const initialFetch = useActions(actions => actions.initialFetch)
  useEffect(() => { initialFetch() }, [])
  const user = useStore(state => state.user)
  return user ? <Main /> : <Loading />
}

ReactDOM.render(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>,
  document.querySelector('#app')
)
