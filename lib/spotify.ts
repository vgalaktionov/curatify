import { PlaylistTrack, Track } from "./../server/data/tracks";
import { User } from "./../server/data/users";
import { Artist } from "./../server/data/artists";
import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import { stringify } from "querystring";
import camelcaseKeys from "camelcase-keys";
import { Token } from "../server/data/users";
import { Playlist } from "../server/data/playlists";

interface WrappedPlaylistTrack {
  track: Track;
  id: string;
}

export class SpotifyClient {
  static authBase = "https://accounts.spotify.com";
  static auth = axios.create({ baseURL: SpotifyClient.authBase });
  static scope = [
    "user-read-email",
    "user-library-read",
    "user-library-modify",
    "streaming",
    "user-read-birthdate",
    "user-read-private",
    "user-modify-playback-state",
    "playlist-modify-private",
    "playlist-modify-public"
  ].join(" ");

  token: Token;
  api: AxiosInstance;

  constructor(token: Token) {
    this.token = token;
    this.api = axios.create({
      baseURL: "https://api.spotify.com/v1",
      headers: { Authorization: `Bearer ${token.accessToken}` }
    });
    axiosRetry(this.api, { retries: 3 });
  }

  static enrichToken(token: Token): Token {
    const camelToken = camelcaseKeys(token);
    return {
      expiresAt: new Date().getTime() / 1000 + camelToken.expiresIn,
      ...camelToken
    };
  }

  static async getToken(): Promise<Token> {
    const { data } = await this.auth.post(
      "/api/token",
      stringify({
        client_id: process.env.SPOTIFY_ID,
        grant_type: "client_credentials",
        client_secret: process.env.SPOTIFY_SECRET
      })
    );
    return this.enrichToken(data);
  }

  async artists(artistIds: string[]): Promise<Artist[]> {
    const {
      data: { artists }
    } = await this.api.get("/artists", {
      params: { ids: artistIds.filter(id => !!id).join(",") }
    });
    return artists;
  }
}

export class SpotifyUserClient extends SpotifyClient {
  static authUrl(): string {
    return `${SpotifyUserClient.authBase}/authorize?${stringify({
      scope: SpotifyUserClient.scope,
      client_id: process.env.SPOTIFY_ID,
      redirect_uri: process.env.CALLBACK_URL,
      response_type: "code"
    })}`;
  }

  static async getToken(code?: string): Promise<Token> {
    const { data } = await SpotifyUserClient.auth.post(
      "/api/token",
      stringify({
        client_id: process.env.SPOTIFY_ID,
        redirect_uri: process.env.CALLBACK_URL,
        grant_type: "authorization_code",
        client_secret: process.env.SPOTIFY_SECRET,
        code
      })
    );
    return super.enrichToken(data);
  }

  async refreshToken(): Promise<Token> {
    const { data } = await SpotifyUserClient.auth.post(
      "/api/token",
      stringify({
        client_id: process.env.SPOTIFY_ID,
        grant_type: "refresh_token",
        client_secret: process.env.SPOTIFY_SECRET,
        refresh_token: this.token.refreshToken
      })
    );
    return SpotifyClient.enrichToken({ ...this.token, ...data });
  }

  async me(): Promise<User> {
    const { data } = await this.api.get("/me");
    return data;
  }

  async *mePlaylists(): AsyncIterable<Playlist[]> {
    let next = "/me/playlists";
    while (next) {
      const { data } = await this.api.get(next);
      next = data.next;
      yield data.items;
    }
  }

  async *playlistTracks(
    playlistId: string
  ): AsyncIterable<WrappedPlaylistTrack[]> {
    let next = `/playlists/${playlistId}/tracks`;
    while (next) {
      const { data } = await this.api.get(next, { params: { limit: 100 } });
      next = data.next;
      yield data.items;
    }
  }

  async play(
    uris: string[],
    deviceId: string,
    position_ms?: string
  ): Promise<void> {
    await this.api.put(`/me/player/play?device_id=${deviceId}`, {
      uris,
      position_ms
    });
  }

  async pause(deviceId: string): Promise<void> {
    await this.api.put(`/me/player/pause?device_id=${deviceId}`);
  }

  async addTrackToPlaylist(trackId: string, playlistId: string): Promise<void> {
    await this.api.post(`/playlists/${playlistId}/tracks`, {
      uris: [`spotify:track:${trackId}`]
    });
  }
}
