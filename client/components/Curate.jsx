import React from 'react'
import InboxList from './Inbox'
import Player from './Player'


function Player() {

}

export default function Curate() {
  return (
    <div class="columns">
      <InboxList />
      <div class="column is-1" />
      <Player />
    </div>
  )
}
