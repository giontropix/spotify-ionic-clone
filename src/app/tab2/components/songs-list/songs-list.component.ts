import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {SongsService} from '../../../services/songs.service';
import {Song} from '../../../models/Song';
import {ActionSheetController, IonInfiniteScroll, ToastController} from '@ionic/angular';
import {PlaylistsService} from '../../../services/playlists.service';
import {UserPlaylist} from '../../../models/UserPlaylist';
import {UsersService} from '../../../services/users.service';

@Component({
  selector: 'app-songs-list',
  templateUrl: './songs-list.component.html',
  styleUrls: ['./songs-list.component.scss'],
})
export class SongsListComponent implements OnInit {

  constructor(
    public songsService: SongsService,
    public toastController: ToastController,
    public actionSheetController: ActionSheetController,
    public playlistsService: PlaylistsService,
    public usersService: UsersService
  ) {
  }

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @Input() songToPlayFromPlaylist: Song | undefined;
  search = '';
  songs: Song[] = [];
  allSearch: Song[] = [];
  allSongs: Song[] = [];
  isSearching = false;
  songsOffset = 0;
  songsLimit = 9;
  userPlaylists: UserPlaylist[];

  addToPlaylists = async (song: Song) => {
    await this.getUserPlaylists();
    if (this.userPlaylists.length === 0) { return this.presentToast('No playlists created yet'); }
    const actionSheet = await this.actionSheetController.create({
      header: 'Add to Playlists',
      cssClass: 'my-custom-class',
      buttons: [...this.userPlaylists.map(({title, id}) => ({
          text: title,
          handler: async () => {
            try {
              await this.playlistsService.addToPlaylist(localStorage.getItem('user_id'), id, {songId: song._id});
            } catch (error: any) {
              return this.presentToast(error, 3000);
            }
            return this.presentToast(`${song._title} added to ${title} playlist`);
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

  loadDataForInfiniteScroll = (event) => {
    if (!this.isSearching) {
      return setTimeout(async () => {
        console.log('Done');
        event.target.complete();
        const songsToPush = await this.songsService.all('', String(this.songs.length),
          String(this.songsLimit));
        this.songs = [...this.songs, ...songsToPush];
        if (this.songs.length === this.allSongs.length) {
          event.target.disabled = true;
        }
      }, 500);
    } else {
      this.getSearch().then(() => setTimeout(async () => {
        console.log('Done');
        event.target.complete();
        const songsToPush = await this.songsService.all(this.search, String(this.songs.length),
          String(this.songsLimit));
        this.songs = [...this.songs, ...songsToPush];
        if (this.songs.length === this.allSearch.length) {
          event.target.disabled = true;
        }
      }, 500));
    }
  }

  async presentToast(message: string, duration = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
    });
    await toast.present();
  }

  getUserPlaylists = async () => this.userPlaylists = await this.playlistsService.all(localStorage.getItem('user_id'));

  getAllSongs = async () => this.allSongs = await this.songsService.all();

  getAllSearch = async () => this.allSearch = await this.songsService.all(this.search);

  getSongs = async () => this.songs = await this.songsService.all('', String(this.songsOffset),
    String(this.songsLimit))

  getSearch = async () => this.songs = await this.songsService.all(this.search, String(this.songsOffset),
    String(this.songsLimit))

  increaseSongView = async (songId: string) => await this.usersService.increaseSongView(localStorage.getItem('user_id'), {song_id: songId});

  stopSearchingIfEmptyField = async () => {
    if (this.search === '') {
      this.isSearching = false;
      await this.getSongs();
    }
  }

  startPlaying = async (song: Song) => {
    if (this.songsService.isListening) {
      return this.presentToast('Please stop the current song before change music!');
    }
    this.songsService.songToPlay = song;
    this.songsService.isListening = true;
    console.log(localStorage.getItem('user_id'));
    await this.increaseSongView(song._id);
  }

  async ngOnInit() {
    await this.getAllSongs();
    await this.getSongs();
    await this.getUserPlaylists();
  }
}
