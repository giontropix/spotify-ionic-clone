import {Component, Input, OnInit} from '@angular/core';
import {PlaylistsService} from '../../../services/playlists.service';
import {Song} from '../../../models/Song';
import {ModalController, ToastController} from '@ionic/angular';
import {SongsService} from '../../../services/songs.service';

@Component({
  selector: 'app-modal-playlist',
  templateUrl: './modal-playlist.component.html',
  styleUrls: ['./modal-playlist.component.scss'],
})
export class ModalPlaylistComponent implements OnInit {

  constructor(
    private playlistsService: PlaylistsService,
    public toastController: ToastController,
    public modalController: ModalController,
    private songsService: SongsService
  ) { }

  @Input() userId: string;
  @Input() playlistId: string;
  @Input() playlistTitle: string;
  userPlaylistSongs: Song[];

  getUserPlaylistSongs = async () => this.userPlaylistSongs = await this.playlistsService.getPlaylistSong(this.userId, this.playlistId);

  increaseView = async (songId: string) => await this.playlistsService.increaseSongView(this.userId, this.playlistId, {songId});

  startPlaying = async (song: Song) => {
    if (this.songsService.isListening) {
      return this.presentToast('Please stop the current song before change music!');
    }
    this.songsService.songToPlay = song;
    this.songsService.isListening = true;
    await this.increaseView(song._id);
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
