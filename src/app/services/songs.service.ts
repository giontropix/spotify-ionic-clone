import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Song} from '../models/Song';
import {API_BASE_URL} from '../commons/utils';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  constructor(private http: HttpClient) {
  }

  private song: Song;
  private isListeningSong = false;

  get isListening(): boolean {
    return this.isListeningSong;
  }

  set isListening(value: boolean) {
    this.isListeningSong = value;
  }

  get songToPlay(): Song {
    return this.song;
  }

  set songToPlay(value: Song) {
    this.song = value;
  }

  all = (filter: string = '', offset: string = '', limit: string = '', option: string = ''): Promise<Song[]> =>
    this.http.get<Song[]>(`${API_BASE_URL}/songs?filter=${filter}&offset=${offset}&limit=${limit}&option=${option}`).toPromise()
}
