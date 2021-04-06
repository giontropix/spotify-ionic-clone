import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {API_BASE_URL} from '../commons/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  register = async (mail: string, userName: string, password: string, sex: string): Promise<void> =>
    this.http.post<void>(`${API_BASE_URL}/register`, {
      mail,
      user_name: userName,
      password,
      sex
    }).toPromise().catch(({error: {error}}) => {
      throw new Error(error);
    })

  login = async (mail: string, password: string): Promise<void> =>
    this.http.get<void>(`${API_BASE_URL}/login`, {
      headers: {Accept: 'application/json', mail, password}}).toPromise().catch(({error: {error}}) => {
      throw new Error(error);
    })

  check = async (accessToken: string, refreshToken: string): Promise<any> =>
    this.http.get<any>(`${API_BASE_URL}/check`, {
      headers: {Accept: 'application/json', access_token: accessToken, refresh_token: refreshToken}}).toPromise()
      .catch(({error: {error}}) => {
        throw new Error(error);
      })

  logout = async (accessToken: string, refreshToken: string): Promise<void> =>
    this.http.delete<void>(`${API_BASE_URL}/logout`, {
      headers: {Accept: 'application/json', access_token: accessToken, refresh_token: refreshToken}})
      .toPromise()
      .catch(({error: {error}}) => {
      throw new Error(error);
    })
}
