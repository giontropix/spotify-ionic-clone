import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PlaylistsService} from '../../../services/playlists.service';
import {UserPlaylist} from '../../../models/UserPlaylist';
import {AlertController, ModalController} from '@ionic/angular';
import {ModalPlaylistComponent} from '../modal-playlist/modal-playlist.component';
import {presentToast, USER_ID} from '../../../commons/utils';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
})
export class PlaylistsComponent implements OnInit, OnChanges {

  constructor(
    private playlistsService: PlaylistsService,
    public modalController: ModalController,
    public alertController: AlertController
  ) {}

  userPlaylists: UserPlaylist[];
  newPlaylistName = '';
  @Input() reloadPlaylist;
  @Input() reloadPlaylistBecauseDelete;
  @Output() emit: EventEmitter<boolean> = new EventEmitter<boolean>();

  async showPlaylist(playlistId: string, playlistTitle) {
    const modal = await this.modalController.create({
      component: ModalPlaylistComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        userId: USER_ID,
        playlistId,
        playlistTitle
      }
    });
    return await modal.present();
  }

  async confirmRemovePlaylist(playlistId: string, playlistName: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: `Do you really want to <strong>delete</strong> ${playlistName}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Confirm',
          handler: () => {
            this.removePlaylist(playlistId);
          }
        }
      ]
    });
    await alert.present();
  }

  getUserPlaylists = async () => this.userPlaylists = await this.playlistsService.all(USER_ID);

  addPlaylist = async () => {
    if (this.newPlaylistName === '') { return presentToast('Compile input field first'); }
    await this.playlistsService.create(USER_ID, {name: this.newPlaylistName});
    await presentToast('Playlist added!');
    this.newPlaylistName = '';
    await this.getUserPlaylists();
  }

  removePlaylist = async (playlistId: string) => {
    await this.playlistsService.delete(USER_ID, playlistId);
    await presentToast('Playlist removed', 3000);
    await this.getUserPlaylists();
  }

  async ngOnInit() {
    await this.getUserPlaylists();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.reloadPlaylist &&
      changes.reloadPlaylist.previousValue !== changes.reloadPlaylist.currentValue) {
      this.getUserPlaylists().then(() => {
        this.playlistsService.isAddingSongtoPlaylist = false;
        return;
      });
    }
    if (changes.reloadPlaylistBecauseDelete &&
      changes.reloadPlaylistBecauseDelete.previousValue !== changes.reloadPlaylistBecauseDelete.currentValue) {
      this.getUserPlaylists().then(() => {
        this.playlistsService.isRemovingSongfromPlaylist = false;
        return;
      });
    }
  }
}
