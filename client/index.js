import React from 'react'
import ReactDOM from 'react-dom'

import Login from './components/Login'
import Main from './components/Main'

import './index.scss'

import { StoreProvider, createStore, useStore, useActions } from 'easy-peasy'
import store from './store'


function App() {
  const user = useStore(state => state.user)
  return user ? <Login /> : <Main />
}


ReactDOM.render(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>,
  document.getElementById('app')
)
