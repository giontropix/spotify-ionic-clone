import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {SongsService} from '../../../services/songs.service';
import {Song} from '../../../models/Song';
import {ActionSheetController, IonInfiniteScroll} from '@ionic/angular';
import {PlaylistsService} from '../../../services/playlists.service';
import {UserPlaylist} from '../../../models/UserPlaylist';
import {UsersService} from '../../../services/users.service';
import {getItem, presentToast, startPlaying} from '../../../commons/utils';

@Component({
  selector: 'app-songs-list',
  templateUrl: './songs-list.component.html',
  styleUrls: ['./songs-list.component.scss'],
})
export class SongsListComponent implements OnInit {

  constructor(
    public songsService: SongsService,
    public actionSheetController: ActionSheetController,
    public playlistsService: PlaylistsService,
    public usersService: UsersService
  ) {}

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @Input() songToPlayFromPlaylist: Song | undefined;
  search = '';
  songsToShow: Song[] = [];
  allSearch: Song[] = [];
  allSongs: Song[] = [];
  userPlaylists: UserPlaylist[];
  isSearching = false;
  songsOffset = 0;
  songsLimit = 9;

  addToPlaylists = async (song: Song) => {
    await this.getUserPlaylists();
    if (this.userPlaylists.length === 0) { return presentToast('No playlists created yet'); }
    const actionSheet = await this.actionSheetController.create({
      header: 'Add to Playlists',
      cssClass: 'my-custom-class',
      buttons: [...this.userPlaylists.map(({title, id}) => ({
          text: title,
          handler: async () => {
            try {
              await this.playlistsService.addToPlaylist(await getItem('user_id'), id, {songId: song._id});
              this.playlistsService.isAddingSongtoPlaylist = true;
            } catch (error: any) {
              return presentToast(error, 2000);
            }
            return presentToast(`${song._title} added to ${title} playlist`);
          }
        })
      ), {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }

  infiniteScrollSongs = (event) => {
    if (!this.isSearching) {
      return setTimeout(async () => {
        event.target.complete();
        const songsToPush = await this.songsService.all('', String(this.songsToShow.length),
          String(this.songsLimit));
        this.songsToShow = [...this.songsToShow, ...songsToPush];
        if (this.songsToShow.length === this.allSongs.length) {
          event.target.disabled = true;
        }
      }, 500);
    } else {
      this.getSearch().then(() => setTimeout(async () => {
        event.target.complete();
        const songsToPush = await this.songsService.all(this.search, String(this.songsToShow.length),
          String(this.songsLimit));
        this.songsToShow = [...this.songsToShow, ...songsToPush];
        if (this.songsToShow.length === this.allSearch.length) {
          event.target.disabled = true;
        }
      }, 500));
    }
  }

  startPlaying = (song: Song) => startPlaying(this.songsService, this.usersService, song);

  getUserPlaylists = async () => this.userPlaylists = await this.playlistsService.all(await getItem('user_id'));

  getAllSongs = async () => this.allSongs = await this.songsService.all();

  getSongsToShow = async () => this.songsToShow = await this.songsService.all('', String(this.songsOffset),
    String(this.songsLimit))

  getSearch = async () => this.songsToShow = await this.songsService.all(this.search, String(this.songsOffset),
    String(this.songsLimit))

  stopSearchingIfEmptyField = async () => {
    if (this.search === '') {
      this.isSearching = false;
      await this.getSongsToShow();
    }
  }

  async ngOnInit() {
    await this.getAllSongs();
    await this.getSongsToShow();
    await this.getUserPlaylists();
  }
}
