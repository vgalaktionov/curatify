export interface Artist {
  id: string;
  name: string;
  genres?: string[];
  images?: Image[];
}

export interface ArtistTrack {
  artist_id: string;
  track_id: string;
}

export interface InboxTrack {
  user_id: string;
  track_id: string;
  genres: string[];
  artists: string[];
  name: string;
  status: Status;
  playlist_matches: string;
  artist_names: string[];
}

export enum Status {
  Unheard = "unheard",
  Liked = "liked",
  Disliked = "disliked"
}

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  images: any[];
  artist_affinities?: Map<string, number>;
  genre_affinities?: Map<string, number>;
  playlist_type?: PlaylistType;
}

export enum PlaylistType {
  Ignored = "ignored",
  Curated = "curated",
  Inbox = "inbox"
}

export interface Image {
  height?: number;
  width?: number;
  url: string;
}

export interface Track {
  id: string;
  name: string;
  artists?: Artist[];
}

export interface PlaylistTrack {
  playlist_id: string;
  track_id: string;
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  token: Token;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
