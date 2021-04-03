import {Component, Input, OnInit} from '@angular/core';
import {Song} from '../../../models/Song';
import {SongsService} from '../../../services/songs.service';
import {UsersService} from '../../../services/users.service';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(private songsService: SongsService,
              private usersService: UsersService,
              public toastController: ToastController
  ) { }
  @Input() title: string;
  @Input() list: Song[];
  @Input() componentRole: string;

  startPlaying = async (song: Song) => {
    if (this.songsService.isListening) {
      return this.presentToast('Please stop the current song before change music!');
    }
    this.songsService.songToPlay = song;
    this.songsService.isListening = true;
    await this.increaseSongView(song._id);
  }

  async presentToast(message: string, duration = 1000) {
    const toast = await this.toastController.create({
      message,
      duration,
    });
    await toast.present();
  }

  increaseSongView = async (songId: string) => await this.usersService.increaseSongView(localStorage.getItem('user_id'), {song_id: songId});

  ngOnInit() {}

}
