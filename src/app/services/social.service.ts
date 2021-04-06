import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Follower} from '../models/Follower';
import {API_BASE_URL_USER} from '../commons/utils';

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  constructor(private http: HttpClient) { }

  allFollowed = (id: string, offset: string = '', limit: string = ''): Promise<Follower[]> =>
    this.http.get<Follower[]>(`${API_BASE_URL_USER}/users/${id}/followed?offset=${offset}&limit=${limit}`).toPromise()

  allFollowers = (id: string, offset: string = '', limit: string = ''): Promise<Follower[]> =>
    this.http.get<Follower[]>(`${API_BASE_URL_USER}/users/${id}/followers?offset=${offset}&limit=${limit}`).toPromise()

  add = (id: string, userId: any): Promise<void> =>
    this.http.put<void>(`${API_BASE_URL_USER}/users/${id}/followed`, userId).toPromise()
      .catch(({error: {error}}) => {
      throw new Error(error);
    })

  remove = (id: string, userId: string): Promise<void> =>
    this.http.delete<void>(`${API_BASE_URL_USER}/users/${id}/followed/${userId}`).toPromise()
      .catch(({error: {error}}) => {
        throw new Error(error);
      })

  block = (id: string, userId: string): Promise<void> =>
    this.http.delete<void>(`${API_BASE_URL_USER}/users/${id}/followers/${userId}`).toPromise()
      .catch(({error: {error}}) => {
        throw new Error(error);
      })
}
