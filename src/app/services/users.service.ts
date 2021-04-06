import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/User';
import {Song} from '../models/Song';
import {API_BASE_URL_USER} from '../commons/utils';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {
  }

  private myUserID: string;

  get userID(): string {
    return this.myUserID;
  }

  set userID(value: string) {
    this.myUserID = value;
  }

  all = (): Promise<User[]> =>
    this.http.get<User[]>(API_BASE_URL_USER).toPromise()

  get = (id: string): Promise<User> =>
    this.http.get<User>(`${API_BASE_URL_USER}/${id}`).toPromise()

  getSuggestedSongs = (id: string): Promise<Song[]> =>
    this.http.get<Song[]>(`${API_BASE_URL_USER}/${id}/suggestedSongs`).toPromise()

  increaseSongView = (id: string, songId: { song_id: string }): Promise<void> =>
    this.http.put<void>(`${API_BASE_URL_USER}/${id}`, songId).toPromise()
      .catch(({error: {error}}) => {
        throw new Error(error);
      })
}
