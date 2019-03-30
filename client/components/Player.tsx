import React from "react";

import axios from "axios";

import { useActions, useStore } from "../store";
import { SpotifyUserClient } from "../../lib/spotify";
import Icon from "./Icon";
import { Status, InboxTrack, Image } from "../../types";

interface RichInboxTrack extends InboxTrack {
  album: {
    images: Image[];
  };
}

interface CurrentlyPlayingProps {
  track: RichInboxTrack;
}

function CurrentlyPlaying({ track }: CurrentlyPlayingProps) {
  const imageUrl = track.album.images.maxBy("height").url;
  const playlists = useStore(state => state.playlists.playlists);
  const matchingPlaylist = playlists.find(p => p.id === track.playlist_matches);
  const setMatchingPlaylist = useActions(
    actions => actions.playback.setMatchingPlaylist
  );

  return (
    <div className="column is-12 has-text-centered currently-playing">
      <img src={imageUrl} />
      <h5 className="is-size-5 has-text-weight-semibold">{track.name}</h5>
      {track.artists && (
        <p className="has-text-weight-semibold">
          {track.artist_names.join(", ")}{" "}
        </p>
      )}
      {track.track_id && (
        <div className="field">
          <label htmlFor="matches" className="is-small">
            matches:
            <div className="control is-centered has-text-centered">
              <span className="select">
                <select
                  name="matches"
                  className="is-small"
                  defaultValue={matchingPlaylist.id}
                  onChange={async e => {
                    await setMatchingPlaylist({
                      trackId: track.track_id,
                      playlistId: e.target.value
                    });
                  }}
                >
                  {playlists.map(playlist => {
                    return (
                      <option key={playlist.id} value={playlist.id}>
                        {playlist.name}
                      </option>
                    );
                  })}
                </select>
              </span>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}

export default function Player() {
  const track = useStore(state => state.playback.currentTrack);
  const { duration: trackDuration, position: trackPosition } = useStore(
    state => state.playback.playbackState
  );
  const playerReady = useStore(state => state.user.ready);
  const inbox = useStore(state => state.playback.inbox);
  const setPaused = useActions(actions => actions.playback.setPaused);
  const nowPlaying = useStore(state => state.playback.nowPlaying);

  const setTrackStatus = useActions(actions => actions.playback.setTrackStatus);
  const token = useStore(state => state.user.me.token, []);
  const spotify = new SpotifyUserClient(token);

  const likeTrack = async () => {
    await axios.put(`/api/tracks/${track.id}/like`);
    await spotify.addTrackToPlaylist(track.id, track.playlist_matches);
    setTrackStatus({ trackId: track.id, status: Status.Liked });
  };

  const dislikeTrack = async () => {
    axios.put(`/api/tracks/${track.id}/dislike`);
    await nextTrack();
    setTrackStatus({ trackId: track.id, status: Status.Disliked });
  };

  const nextTrack = async () => {
    await window.player.nextTrack();
  };

  const previousTrack = async () => {
    await window.player.previousTrack();
  };

  const playOrPause = async () => {
    if (nowPlaying) {
      await spotify.pause(window.player._options.id);
      setPaused(true);
    } else {
      await spotify.play(
        inbox.slice(0, 11).map(it => "spotify:track:" + it.track_id),
        window.player._options.id
      );
      setPaused(false);
    }
  };

  return (
    <div className="column is-6 player">
      <div className="columns">
        <CurrentlyPlaying track={track} />
      </div>
      <div className="columns">
        <div className="column is-12 has-text-centered">
          <progress
            max={trackDuration}
            value={trackPosition}
            className="progress"
          />
        </div>
      </div>
      <div className="columns playback-buttons is-vcentered has-text-centered">
        <div className="column is-one-fifth">
          <button className="playback" onClick={dislikeTrack}>
            <Icon icon="fas fa-heart-broken" size="is-large" />
          </button>
        </div>
        <div className="column is-one-fifth">
          <button className="playback" onClick={previousTrack}>
            <Icon icon="fas fa-step-backward" size="is-large" />
          </button>
        </div>
        <div className="column is-one-fifth">
          <button
            disabled={!playerReady}
            className="playback"
            onClick={playOrPause}
          >
            <Icon
              icon={nowPlaying ? "fas fa-pause" : "fas fa-play"}
              size="is-large"
            />
          </button>
        </div>
        <div className="column is-one-fifth">
          <button className="playback" onClick={nextTrack}>
            <Icon icon="fas fa-step-forward" size="is-large" />
          </button>
        </div>
        <div className="column is-one-fifth">
          <button className="playback" onClick={likeTrack}>
            <Icon icon="fas fa-heart" size="is-large" />
          </button>
        </div>
      </div>
    </div>
  );
}