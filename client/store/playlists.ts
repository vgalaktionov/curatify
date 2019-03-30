import axios from "axios";
import { thunk, listen, Action, Thunk, Listen } from "easy-peasy";

import userModel from "./user";
import { Playlist, PlaylistType } from "../../types";

export interface PlaylistsModel {
  playlists: Playlist[];

  setPlaylists: Action<PlaylistsModel, Playlist[]>;
  setPlaylistType: Action<PlaylistsModel, { id: string; type: PlaylistType }>;

  // getPlaylists: Thunk<PlaylistsModel>;
  patchPlaylistType: Thunk<PlaylistsModel, { id: string; type: PlaylistType }>;

  listeners: Listen<PlaylistsModel>;
}

const playlistsModel: PlaylistsModel = {
  playlists: [],

  setPlaylists(state, playlists) {
    state.playlists = playlists;
  },
  setPlaylistType(state, { id, type }) {
    state.playlists = state.playlists.map(p => ({
      ...p,
      playlist_type: p.id === id ? type : p.playlist_type
    }));
  },

  patchPlaylistType: thunk(async (actions, { id, type }) => {
    await axios.patch(`/api/playlists/${id}/type`, {
      playlist_type: type
    });
    actions.setPlaylistType({
      id,
      type
    });
  }),

  listeners: listen(on => {
    on(
      userModel.setUser,
      thunk(async actions => {
        const { data: playlists } = await axios.get("/api/playlists");
        actions.setPlaylists(playlists);
      })
    );
  })
};

export default playlistsModel;
