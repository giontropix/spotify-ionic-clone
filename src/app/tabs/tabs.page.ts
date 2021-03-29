import { Component } from '@angular/core';
import {SongsService} from '../services/songs.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public songsService: SongsService) {}
}
