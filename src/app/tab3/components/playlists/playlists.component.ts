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
  ) {
  }

  allUserPlaylists: UserPlaylist[];
  userPlaylistToShow: UserPlaylist[];
  newPlaylistName = '';
  playlistsLimit = 9;
  playlistsOffset = 0;
  @Input() reloadPlaylist;
  @Input() reloadPlaylistBecauseDelete;
  @Output() emit: EventEmitter<boolean> = new EventEmitter<boolean>();

  infiniteScrollPlaylists = (event) => {
    return setTimeout(async () => {
      event.target.complete();
      const playlistToPush = await this.playlistsService.all(USER_ID, String(this.userPlaylistToShow.length), String(this.playlistsLimit));
      this.userPlaylistToShow = [...this.userPlaylistToShow, ...playlistToPush];
      if (this.userPlaylistToShow.length === this.allUserPlaylists.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

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

  getAllUserPlaylists = async () => this.allUserPlaylists = await this.playlistsService.all(USER_ID);

  getUserPlaylistsToShow = async () =>
    this.userPlaylistToShow = await this.playlistsService.all(USER_ID, String(this.playlistsOffset), String(this.playlistsLimit))

  addPlaylist = async () => {
    if (this.newPlaylistName === '') {
      return presentToast('Compile input field first');
    }
    await this.playlistsService.create(USER_ID, {name: this.newPlaylistName});
    await presentToast('Playlist added!');
    this.newPlaylistName = '';
    await this.getUserPlaylistsToShow();
  }

  removePlaylist = async (playlistId: string) => {
    await this.playlistsService.delete(USER_ID, playlistId);
    await presentToast('Playlist removed', 3000);
    await this.getUserPlaylistsToShow();
  }

  async ngOnInit() {
    await this.getAllUserPlaylists();
    await this.getUserPlaylistsToShow();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.reloadPlaylist &&
      changes.reloadPlaylist.previousValue !== changes.reloadPlaylist.currentValue) {
      this.getAllUserPlaylists().then(() => {
        this.getUserPlaylistsToShow().then(() => {
          this.playlistsService.isAddingSongtoPlaylist = false;
          return;
        });
      });
    }
    if (changes.reloadPlaylistBecauseDelete &&
      changes.reloadPlaylistBecauseDelete.previousValue !== changes.reloadPlaylistBecauseDelete.currentValue) {
      this.getAllUserPlaylists().then(() => {
        this.getUserPlaylistsToShow().then(() => {
          this.playlistsService.isRemovingSongfromPlaylist = false;
          return;
        });
      });
    }
  }
}
