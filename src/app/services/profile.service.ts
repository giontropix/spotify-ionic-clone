import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  public API_BASE_URL = 'http://localhost:3000/users';
  constructor(private http: HttpClient) {}

  /*all = (): Promise<User[]> =>
    this.http.get<User[]>(this.API_BASE_URL).toPromise()

  get = (id: string): Promise<User> =>
    this.http.get<User>(`${this.API_BASE_URL}/${id}`).toPromise()

  getSuggestedSongs = (id: string): Promise<Song[]> =>
    this.http.get<Song[]>(`${this.API_BASE_URL}/${id}/suggestedSongs`).toPromise()*/
}
