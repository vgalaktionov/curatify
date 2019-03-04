import React from 'react'
import Icon from './Icon'

function CurrentlyPlaying({ track }) {
  const imageUrl = ''
  let setMatchingPlaylist, playlists, matchingPlaylist
  return (
    <div className="column is-12 has-text-centered currently-playing">
      <img src={imageUrl} />
      <h5 className="is-size-5 has-text-weight-semibold">{ track.name }</h5>
      {track.artists &&
        <p className="has-text-weight-semibold">
          { track.artist_names.join(', ') }
        </p>}
      {track.id &&
      <div className="field">
        <label for="matches" className="is-small">matches:
          <div className="control is-centered has-text-centered">
            <span className="select">
              <select name="matches" className="is-small" onchange={setMatchingPlaylist}>
                {playlists.map(playlist => {
                  return (
                    <option
                      key={playlist.id}
                      selected={playlist.id === matchingPlaylist.id}
                      value="p.id"
                    >{ playlist.name }
                    </option>
                  )
                })}
              </select>
            </span>
          </div>
        </label>
      </div>}
    </div>
  )
}

export default function Player() {
  let trackDuration, trackPosition, dislikeTrack, likeTrack, previousTrack, nextTrack, playOrPause, playerReady, playing
  return (
    <div className="column is-6 player">
      <div className="columns">
        <CurrentlyPlaying/>
      </div>
      <div className="columns">
        <div className="column is-12 has-text-centered">
          <progress max={trackDuration} value={trackPosition} className="progress"/>
        </div>
      </div>
      <div className="columns playback-buttons is-vcentered has-text-centered">
        <div className="column is-one-fifth">
          <button className="playback" onclick={dislikeTrack}>
            <Icon icon="thumb-down" size="is-large"/>
          </button>
        </div>
        <div className="column is-one-fifth">
          <button className="playback" onclick={previousTrack}>
            <Icon icon="skip-previous" size="is-large"/>
          </button>
        </div>
        <div className="column is-one-fifth">
          <button disabled={!playerReady} className="playback" onclick={playOrPause}>
            <Icon icon={playing ? 'pause' : 'play'} size="is-large"/>
          </button>
        </div>
        <div className="column is-one-fifth">
          <button className="playback" onclick={nextTrack}>
            <Icon icon="skip-next" size="is-large"/>
          </button>
        </div>
        <div className="column is-one-fifth">
          <button className="playback" onclick={likeTrack}>
            <Icon icon="thumb-up" size="is-large"/>
          </button>
        </div>
      </div>
    </div>
  )
}
