import {ToastController} from '@ionic/angular';
import {Song} from '../models/Song';
import {SongsService} from '../services/songs.service';
import {UsersService} from '../services/users.service';

const toastController: ToastController = new ToastController();

// INDIRIZZO SENZA TUNNELING
export const API_BASE_URL = 'http://localhost:3000';

// INDIRIZZO IN CASO DI TUNNELING
// export const API_BASE_URL = 'https://1cf6f0dc1881.ngrok.io';

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
