import React from "react";

import axios from "axios";

import { useActions, useStore } from "../store";
import { SpotifyUserClient } from "../../lib/spotify";
import CurrentlyPlaying from "./CurrentlyPlaying";
import PlaybackButton from "./PlaybackButton";
import { Status } from "../../types";

export default function Player() {
  const track = useStore(state => state.playback.currentTrack);
  const index = useStore(state => state.playback.currentTrackIndex);
  const { duration: trackDuration, position: trackPosition } = useStore(
    state => state.playback.playbackState
  );
  const playerReady = useStore(state => state.user.ready);
  const inbox = useStore(state => state.playback.inbox);
  const setPaused = useActions(actions => actions.playback.setPaused);
  const nowPlaying = useStore(state => state.playback.nowPlaying);

  const setTrackStatus = useActions(actions => actions.playback.setTrackStatus);
  const token = useStore(state => state.user.me.token);
  const spotify = new SpotifyUserClient(token);

  const likeTrack = async () => {
    await axios.put(`/api/tracks/${track.id}/like`);
    if (!track.added) await spotify.addTrackToPlaylist(track.id, track.playlist_matches);
    setTrackStatus({ trackId: track.id, status: Status.Liked, added: true });
  };

  const dislikeTrack = async () => {
    axios.put(`/api/tracks/${track.id}/dislike`);
    await nextTrack();
    setTrackStatus({ trackId: track.id, status: Status.Disliked, added: track.added });
  };

  const nextTrack = async () => {
    await spotify.play(
      inbox.slice(index + 1, index + 11).map(it => "spotify:track:" + it.track_id),
      window.player._options.id,
      0
    );
    setPaused(false);
  };

  const previousTrack = async () => {
    await spotify.play(
      inbox.slice(index - 1, index + 9).map(it => "spotify:track:" + it.track_id),
      window.player._options.id,
      trackPosition
    );
    setPaused(false);
  };

  const playOrPause = async () => {
    if (nowPlaying) {
      await spotify.pause(window.player._options.id);
      setPaused(true);
    } else {
      await spotify.play(
        inbox.slice(index, index + 10).map(it => "spotify:track:" + it.track_id),
        window.player._options.id,
        trackPosition
      );
      setPaused(false);
    }
  };

  const time = (ms: number) => {
    const s = ms / 1000;
    const minutes = Math.floor(s / 60);
    const seconds = String(Math.floor(s % 60)).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="column player">
      <div className="columns">
        <CurrentlyPlaying track={track} />
      </div>
      <div className="columns">
        <div className="column is-12 has-text-centered">
          {trackDuration && <span className="is-pulled-left">{time(trackPosition)}</span>}
          {trackDuration && <span className="is-pulled-right">{time(trackDuration)}</span>}
          <progress
            max={trackDuration}
            value={trackPosition}
            className="progress"
            onClick={async e => {
              const x = e.pageX - (e.currentTarget.getBoundingClientRect() as DOMRect).x;
              const clickedValue = (x * e.currentTarget.max) / e.currentTarget.offsetWidth;

              await spotify.play(
                inbox.slice(index, index + 10).map(it => "spotify:track:" + it.track_id),
                window.player._options.id,
                clickedValue
              );
              setPaused(false);
            }}
          />
        </div>
      </div>
      <div className="columns playback-buttons is-vcentered has-text-centered">
        <PlaybackButton
          listener={dislikeTrack}
          iconName={"fa-heart-broken"}
          disabled={track.status === Status.Disliked}
        />
        <PlaybackButton listener={previousTrack} iconName={"fa-step-backward"} />
        <PlaybackButton
          listener={playOrPause}
          iconName={nowPlaying ? "fas fa-pause" : "fas fa-play"}
          disabled={!playerReady}
        />
        <PlaybackButton listener={nextTrack} iconName={"fa-step-forward"} />
        <PlaybackButton
          listener={likeTrack}
          iconName={"fa-heart"}
          disabled={track.status === Status.Liked}
        />
      </div>
    </div>
  );
}
