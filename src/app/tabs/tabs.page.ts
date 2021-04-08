import {Component, OnInit} from '@angular/core';
import {SongsService} from '../services/songs.service';
import {goToIndexIfNotLogged} from '../commons/utils';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  constructor(public songsService: SongsService, private authService: AuthService, private router: Router) {
  }

  async ngOnInit() {
    await goToIndexIfNotLogged(this.authService, this.router);
  }
}
