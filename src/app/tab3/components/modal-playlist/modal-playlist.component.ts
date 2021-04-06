import {Component, Input, OnInit} from '@angular/core';
import {PlaylistsService} from '../../../services/playlists.service';
import {Song} from '../../../models/Song';
import {ModalController} from '@ionic/angular';
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
    private usersService: UsersService
  ) { }

  @Input() userId: string;
  @Input() playlistId: string;
  @Input() playlistTitle: string;
  userPlaylistSongs: Song[];

  getUserPlaylistSongs = async () => this.userPlaylistSongs = await this.playlistsService.getPlaylistSong(this.userId, this.playlistId);

  /*increaseView = async (songId: string) => await this.usersService.increaseSongView(this.userId, {song_id: songId});

  startPlaying = async (song: Song) => {
    if (this.songsService.isListening) {
      return presentToast('Please stop the current song before change music!');
    }
    this.songsService.songToPlay = song;
    this.songsService.isListening = true;
    await this.increaseView(song._id);
  }*/

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
