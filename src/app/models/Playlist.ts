import {Song} from './Song';

export interface Playlist {
  _id: string;
  _title: string;
  _songs: Song[];
}
