import {ToastController} from '@ionic/angular';
import {Song} from '../models/Song';
import {SongsService} from '../services/songs.service';
import {UsersService} from '../services/users.service';

const toastController: ToastController = new ToastController();
export const API_BASE_URL_USER = 'http://localhost:3000/users';
export const API_BASE_URL = 'http://localhost:3000';
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
