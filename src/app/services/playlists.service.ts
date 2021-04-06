import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Playlist} from '../models/Playlist';
import {Song} from '../models/Song';
import {API_BASE_URL_USER} from '../commons/utils';

@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {

  private isAddingSongToPlaylist = false;
  private isRemovingSongFromPlaylist = false;

  constructor(private http: HttpClient) {
  }

  all = (id: string, offset: string = '', limit: string = ''): Promise<any[]> =>
    this.http.get<any[]>(`${API_BASE_URL_USER}/${id}/playlists?offset=${offset}&limit=${limit}`).toPromise()

  get = (id: string, playlistId: string): Promise<Playlist> =>
    this.http.get<Playlist>(`${API_BASE_URL_USER}/${id}/playlists/${playlistId}`).toPromise()

  getPlaylistSong = (id: string, playlistId: string): Promise<Song[]> =>
    this.http.get<Song[]>(`${API_BASE_URL_USER}/${id}/playlists/${playlistId}/songs`).toPromise()

  create = (id: string, title: {name: string}): Promise<void> =>
    this.http.post<void>(`${API_BASE_URL_USER}/${id}/playlists`, title).toPromise()
      .catch(({error: {error}}) => {
        throw new Error(error);
      })

  delete = (id: string, playlistID: string): Promise<void> =>
    this.http.delete<void>(`${API_BASE_URL_USER}/${id}/playlists/${playlistID}`).toPromise()
      .catch(({error: {error}}) => {
      throw new Error(error);
    })

  addToPlaylist = (id: string, playlistId: string, songId: { songId: string }): Promise<void> =>
    this.http.put<void>(`${API_BASE_URL_USER}/${id}/playlists/${playlistId}/songs`, songId).toPromise()
      .catch(({error: {error}}) => {
      throw new Error(error);
    })

  deleteFromPlaylist = (id: string, playlistId: string, songId: string): Promise<void> =>
    this.http.delete<void>(`${API_BASE_URL_USER}/${id}/playlists/${playlistId}/songs/${songId}`).toPromise()
      .catch(({error: {error}}) => {
        throw new Error(error);
      })

  get isAddingSongtoPlaylist(): boolean {
    return this.isAddingSongToPlaylist;
  }

  set isAddingSongtoPlaylist(value: boolean) {
    this.isAddingSongToPlaylist = value;
  }

  get isRemovingSongfromPlaylist(): boolean {
    return this.isRemovingSongFromPlaylist;
  }

  set isRemovingSongfromPlaylist(value: boolean) {
    this.isRemovingSongFromPlaylist = value;
  }
}
