import {Component, Input, OnInit} from '@angular/core';
import {PlaylistsService} from '../../../services/playlists.service';
import {Song} from '../../../models/Song';
import {ModalController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-modal-playlist',
  templateUrl: './modal-playlist.component.html',
  styleUrls: ['./modal-playlist.component.scss'],
})
export class ModalPlaylistComponent implements OnInit {

  constructor(
    private playlistsService: PlaylistsService,
    public toastController: ToastController,
    public modalController: ModalController
  ) { }

  @Input() userId: string;
  @Input() playlistId: string;
  @Input() playlistTitle: string;
  userPlaylistSongs: Song[];
  songUrl: string;
  currentArtist: string;
  currentSong: string;
  isListening = false;

  getUserPlaylistSongs = async () => this.userPlaylistSongs = await this.playlistsService.getPlaylistSong(this.userId, this.playlistId);

  startPlaying = (uri: string, title: string, artist: string) => {
    if (this.isListening) {
      return this.presentToast('Please stop the current song before change music!');
    }
    this.songUrl = uri;
    this.currentSong = title;
    this.currentArtist = artist;
    this.isListening = true;
  }

  async presentToast(message: string, duration = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
    });
    await toast.present();
  }

  dismiss = () => this.modalController.dismiss();

  deleteSong = async (songId: string, songTitle: string) => {
    await this.playlistsService.deleteFromPlaylist(this.userId, this.playlistId, songId);
    await this.presentToast(`Song "${songTitle}" removed from playlist "${this.playlistTitle}"`);
    await this.getUserPlaylistSongs();
  }

  async ngOnInit() {
    await this.getUserPlaylistSongs();
  }

}
