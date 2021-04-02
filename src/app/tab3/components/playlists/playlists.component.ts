import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PlaylistsService} from '../../../services/playlists.service';
import {UserPlaylist} from '../../../models/UserPlaylist';
import {ModalController, ToastController} from '@ionic/angular';
import {ModalPlaylistComponent} from '../modal-playlist/modal-playlist.component';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
})
export class PlaylistsComponent implements OnInit, OnChanges {

  constructor(
    private playlistsService: PlaylistsService,
    public modalController: ModalController,
    public toastController: ToastController
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
        userId: localStorage.getItem('user_id'),
        playlistId,
        playlistTitle
      }
    });
    return await modal.present();
  }

  getUserPlaylists = async () => this.userPlaylists = await this.playlistsService.all(localStorage.getItem('user_id'));

  addPlaylist = async () => {
    if (this.newPlaylistName === '') { return this.presentToast('Compile input field first'); }
    await this.playlistsService.create(localStorage.getItem('user_id'), {name: this.newPlaylistName});
    await this.presentToast('Playlist added!');
    this.newPlaylistName = '';
    await this.getUserPlaylists();
  }

  removePlaylist = async (playlistId: string) => {
    await this.playlistsService.delete(localStorage.getItem('user_id'), playlistId);
    await this.presentToast('Playlist removed', 3000);
    await this.getUserPlaylists();
  }

  async presentToast(message: string, duration = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
    });
    await toast.present();
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
