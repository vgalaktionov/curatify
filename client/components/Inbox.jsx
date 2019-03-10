import React, { useEffect } from 'react'
import { useStore, useActions } from 'easy-peasy'
import Icon from './Icon'

import playing from '../static/playing.svg'

function InboxRow ({ track }) {
  const nowPlaying = useStore(state => state.nowPlaying)
  const currentTrack = useStore(state => state.currentTrack)
  const thisTrack = (currentTrack.id === track.id) && nowPlaying
  return (
    <tr key={track.id} >
      <td>{track.name}</td>
      <td>
        {(track.status === 'liked') && <Icon icon='fas fa-heart' />}
        {(track.status === 'disliked') && <Icon icon='fas fa-heart-broken' />}
      </td>
      <td>
        {thisTrack &&
          <span className='icon is-small'>
            <img src={playing} className='play-spinner' />
          </span>}
      </td>
    </tr>
  )
}

export default function InboxList () {
  const getInbox = useActions(actions => actions.getInbox)
  useEffect(() => { getInbox() }, [])
  const inbox = useStore(store => store.inbox)
  return (
    <div>
      <h4 className='is-size-4'>INBOX TRACKS</h4>
      <table className='table column is-12 center-table'>
        <thead>
          <tr>
            <th>name</th>
            <th>status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {inbox.slice(0, 9).map(track => <InboxRow track={track} key={track.id} />)}
        </tbody>
      </table>
    </div>
  )
}
