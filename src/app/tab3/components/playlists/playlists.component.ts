import {Component, OnInit} from '@angular/core';
import {PlaylistsService} from '../../../services/playlists.service';
import {UserPlaylist} from '../../../models/UserPlaylist';
import {ModalController} from '@ionic/angular';
import {ModalPlaylistComponent} from '../modal-playlist/modal-playlist.component';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
})
export class PlaylistsComponent implements OnInit {

  constructor(
    private playlistsService: PlaylistsService,
    public modalController: ModalController
  ) {}

  userPlaylists: UserPlaylist[];

  async showPlaylist(playlistId: string, playlistTitle) {
    const modal = await this.modalController.create({
      component: ModalPlaylistComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        userId: localStorage.getItem('user_id'),
        playlistId,
        playlistTitle
      }
    });
    return await modal.present();
  }

  getUserPlaylists = async () => this.userPlaylists = await this.playlistsService.all(localStorage.getItem('user_id'));

  async ngOnInit() {
    await this.getUserPlaylists();
  }
}
