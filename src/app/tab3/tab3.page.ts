import {Component} from '@angular/core';
import {PlaylistsService} from '../services/playlists.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private playlistsService: PlaylistsService) {
  }
}
