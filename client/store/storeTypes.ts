import { Action, Thunk, Select, Listen } from "easy-peasy";
import {
  User,
  Image,
  InboxTrack,
  Playlist,
  Status,
  PlaylistType
} from "./../../types/index";

export interface UserModel {
  me?: User;
  ready: boolean;

  setUser: Action<UserModel, User>;
  setReady: Action<UserModel, boolean>;

  getUser: Thunk<UserModel>;
}

export interface Album {
  images: Image[];
}

export interface TrackWindow {
  current_track: {
    id: string;
    linked_from_uri: string;
    album: Album;
  };
}

export interface PlaybackState {
  paused: boolean;
  duration: number;
  position: number;
  track_window: TrackWindow;
}

export interface PlaybackModel {
  playbackState: PlaybackState;
  inbox: InboxTrack[];

  currentTrack: Select<PlaybackModel>;
  nowPlaying: Select<PlaybackModel>;

  setInbox: Action<PlaybackModel, InboxTrack[]>;
  setPlaybackState: Action<PlaybackModel, PlaybackState | null>;
  setTrackStatus: Action<PlaybackModel, { trackId: string; status: Status }>;
  setMatchingPlaylist: Action<
    PlaybackModel,
    { trackId: string; playlistId: string }
  >;
  setPaused: Action<PlaybackModel, boolean>;

  // getInbox: Thunk<PlaybackModel>;
  listeners: Listen<PlaybackModel>;
}

export interface PlaylistsModel {
  playlists: Playlist[];

  setPlaylists: Action<PlaylistsModel, Playlist[]>;
  setPlaylistType: Action<PlaylistsModel, { id: string; type: PlaylistType }>;

  // getPlaylists: Thunk<PlaylistsModel>;
  patchPlaylistType: Thunk<PlaylistsModel, { id: string; type: PlaylistType }>;

  listeners: Listen<PlaylistsModel>;
}

export interface StoreModel {
  user: UserModel;
  playback: PlaybackModel;
  playlists: PlaylistsModel;
}
