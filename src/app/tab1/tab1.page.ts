import {Component} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {SongsService} from '../services/songs.service';
import {Song} from '../models/Song';
import {UsersService} from '../services/users.service';
import {USER_ID} from '../commons/utils';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    private menu: MenuController,
    private songsService: SongsService,
    private usersService: UsersService
  ) {}

  topSongs: Song[];
  userSuggestedSongs: Song[];
  lastInsertedSongs: Song[];

  getTopRankingSongs = async () => this.topSongs = await this.songsService.all('', '', '', 'top');

  getUserSuggestedSongs = async () => this.userSuggestedSongs =
    await this.usersService.getSuggestedSongs(USER_ID)

  getLastInsertedSongs = async () => this.lastInsertedSongs = await this.songsService.all('', '', '', 'last');

  async openFirst() {
    await this.menu.enable(true, 'first');
    await this.menu.open('first');
  }

  async openEnd() {
    await this.menu.open('end');
  }

  async openCustom() {
    await this.menu.enable(true, 'custom');
    await this.menu.open('custom');
  }

  async ionViewWillEnter() {
    await this.getTopRankingSongs();
    await this.getUserSuggestedSongs();
    await this.getLastInsertedSongs();
  }
}
