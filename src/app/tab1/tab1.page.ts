import {Component} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {SongsService} from '../services/songs.service';
import {Song} from '../models/Song';
import {ProfileService} from '../services/profile.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private menu: MenuController, private songsService: SongsService, private profileService: ProfileService) {}
  topSongs: Song[];
  userSuggestedSongs: Song[];

  getTopRankingSongs = async () => this.topSongs = await this.songsService.all('', '', '', 'true');
  getUserSuggestedSongs = async () => this.userSuggestedSongs =
    await this.profileService.getSuggestedSongs(localStorage.getItem('user_id'))

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  async ionViewWillEnter() {
    await this.getTopRankingSongs();
    await this.getUserSuggestedSongs();
  }
}
