import React from 'react'
import Icon from './Icon'

import playing from '../static/playing.svg'

function InboxRow ({ track }) {
  const nowPlaying = true
  return (
    <tr key={track.id} >
      <td>{track.name}</td>
      <td>
        {(track.status === 'liked') && <Icon icon='fas fa-heart' />}
        {(track.status === 'disliked') && <Icon icon='fas fa-heart-broken' />}
      </td>
      <td>
        {nowPlaying &&
          <span className='icon is-small'>
            <img src={playing} className='play-spinner' />
          </span>}
      </td>
    </tr>
  )
}

export default function InboxList () {
  const inbox = []
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
          {inbox.map(track => <InboxRow track={track} />)}
        </tbody>
      </table>
    </div>
  )
}
