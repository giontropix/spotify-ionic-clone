import {ToastController} from '@ionic/angular';
import {Song} from '../models/Song';
import {SongsService} from '../services/songs.service';
import {UsersService} from '../services/users.service';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

const toastController: ToastController = new ToastController();

// INDIRIZZO SENZA TUNNELING
export const API_BASE_URL = 'http://localhost:3000';
// INDIRIZZO IN CASO DI TUNNELING
// export const API_BASE_URL = 'http://localhost:3000';
export const API_BASE_URL_USER = `${API_BASE_URL}/users`;

export const USER_ID = localStorage.getItem('user_id');

export const presentToast = async (message: string, duration = 1000) => {
  const toast = await toastController.create({
    message,
    duration,
  });
  await toast.present();
};

const increaseSongView = async (usersService: UsersService, songId: string) =>
  await usersService.increaseSongView(USER_ID, {song_id: songId});

export const startPlaying = async (songsService: SongsService, usersService: UsersService, song: Song) => {
  if (songsService.isListening) {
    return presentToast('Please stop the current song before change music!');
  }
  songsService.songToPlay = song;
  songsService.isListening = true;
  await increaseSongView(usersService, song._id);
};

export const goToProfileIfJustLogged = async (authService: AuthService, router: Router) => {
  let apiAnswer: any;
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  if (accessToken && refreshToken) {
    try {
      apiAnswer = await authService.check(accessToken, refreshToken);
    } catch (err) {
      return presentToast(err);
    }
    localStorage.setItem('access_token', apiAnswer.access_token);
    localStorage.setItem('refresh_token', apiAnswer.refresh_token);
    return router.navigateByUrl(`tabs/tab1`);
  }
};

export const goToIndexIfNotLogged = async (authService: AuthService, router: Router) => {
  let apiAnswer: any;
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  if (!accessToken || !refreshToken || accessToken === '' || refreshToken === '') {
    return router.navigateByUrl('/welcome');
  }
  try {
    apiAnswer = await authService.check(accessToken, refreshToken);
  } catch (err) {
    return router.navigate(['/welcome']);
  }
  localStorage.setItem('access_token', apiAnswer.access_token);
  localStorage.setItem('refresh_token', apiAnswer.refresh_token);
  return;
};
