import React from 'react'
import { useStore, useActions } from 'easy-peasy'

const playlistTypes = ['ignored', 'curated', 'inbox']

function PlaylistRow ({ playlist }) {
  const patchPlaylistType = useActions(actions => actions.patchPlaylistType)
  return (
    <tr>
      <td>
        <img src={playlist.images.min('height').url} className='playlist-cover' />
      </td>
      <td>{ playlist.name }</td>
      <td>
        <div className='select'>
          <select defaultValue={playlist.playlist_type} onChange={async e => {
            await patchPlaylistType({ id: playlist.id, type: e.target.value })
          }}>
            {playlistTypes.map(pt => {
              return <option key={pt} value={pt}>{ pt }</option>
            })}
          </select>
        </div>
      </td>
    </tr>
  )
}

export default function Playlists () {
  const playlists = useStore(state => state.playlists)
  return (
    <div className='columns is-centered'>
      <div className='column is-narrow'>
        <table className='table center-table'>
          <thead>
            <tr>
              <th />
              <th>Name</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {playlists.map(p => {
              return <PlaylistRow key={p.id} playlist={p} />
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
