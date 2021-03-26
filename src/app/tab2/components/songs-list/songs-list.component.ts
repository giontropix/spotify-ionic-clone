import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {SongsService} from '../../../services/songs.service';
import {Song} from '../../../models/Song';
import {IonInfiniteScroll, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-songs-list',
  templateUrl: './songs-list.component.html',
  styleUrls: ['./songs-list.component.scss'],
})
export class SongsListComponent implements OnInit {

  constructor(
    public songsService: SongsService,
    public toastController: ToastController) {
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
  currentSong = '';
  currentArtist = '';
  songUrl = '';
  isListening = false;

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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    await toast.present();
  }

  getAllSongs = async () => this.allSongs = await this.songsService.all();

  getAllSearch = async () => this.allSearch = await this.songsService.all(this.search);

  getSongs = async () => this.songs = await this.songsService.all('', String(this.songsOffset),
    String(this.songsLimit))

  getSearch = async () => this.songs = await this.songsService.all(this.search, String(this.songsOffset),
    String(this.songsLimit))

  stopSearchingIfEmptyField = async () => {

    if (this.search === '') {
      console.log("empty")
      this.isSearching = false;
      await this.getSongs();
    }console.log(this.songs);
    console.log(this.search)
  }

  startPlaying = (uri: string, title: string, artist: string) => {
    if (this.isListening) {
      return this.presentToast('Please stop the current song before change music!');
    }
    this.songUrl = uri;
    this.currentSong = title;
    this.currentArtist = artist;
    this.isListening = true;
  }

  async ngOnInit() {
    await this.getAllSongs();
    await this.getSongs();
  }
}
