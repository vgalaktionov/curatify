import { createStore, createTypedHooks } from "easy-peasy";

import userModel, { UserModel } from "./user";
import playlistsModel, { PlaylistsModel } from "./playlists";
import playbackModel, { PlaybackModel } from "./playback";

interface StoreModel {
  user: UserModel;
  playback: PlaybackModel;
  playlists: PlaylistsModel;
}

const store = createStore({
  user: userModel,
  playlists: playlistsModel,
  playback: playbackModel
});

const { useActions, useStore, useDispatch } = createTypedHooks<StoreModel>();

export { useActions, useDispatch, useStore };

export default store;
