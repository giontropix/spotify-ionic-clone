import {Component, Input, OnInit} from '@angular/core';
import {PlaylistsService} from '../../../services/playlists.service';
import {Song} from '../../../models/Song';
import {AlertController, ModalController} from '@ionic/angular';
import {SongsService} from '../../../services/songs.service';
import {UsersService} from '../../../services/users.service';
import {presentToast, startPlaying} from '../../../commons/utils';

@Component({
  selector: 'app-modal-playlist',
  templateUrl: './modal-playlist.component.html',
  styleUrls: ['./modal-playlist.component.scss'],
})
export class ModalPlaylistComponent implements OnInit {

  constructor(
    private playlistsService: PlaylistsService,
    public modalController: ModalController,
    private songsService: SongsService,
    private usersService: UsersService,
    public alertController: AlertController
  ) { }

  @Input() userId: string;
  @Input() playlistId: string;
  @Input() playlistTitle: string;
  userPlaylistSongs: Song[];

  getUserPlaylistSongs = async () => this.userPlaylistSongs = await this.playlistsService.getPlaylistSong(this.userId, this.playlistId);

  async confirmRemoveSong(songId: string, songTitle: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: `Do you really want to <strong>delete</strong> ${songTitle}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Confirm',
          handler: () => {
            this.deleteSong(songId, songTitle);
          }
        }
      ]
    });
    await alert.present();
  }

  startPlaying = (song: Song) => startPlaying(this.songsService, this.usersService, song);

  dismiss = () => this.modalController.dismiss();

  deleteSong = async (songId: string, songTitle: string) => {
    await this.playlistsService.deleteFromPlaylist(this.userId, this.playlistId, songId);
    await presentToast(`Song "${songTitle}" removed from playlist "${this.playlistTitle}"`);
    await this.getUserPlaylistSongs();
    this.playlistsService.isRemovingSongfromPlaylist = true;
  }

  async ngOnInit() {
    await this.getUserPlaylistSongs();
  }
}
