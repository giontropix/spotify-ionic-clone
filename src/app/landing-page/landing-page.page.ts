import {Component, OnInit} from '@angular/core';
import {goToProfileIfJustLogged} from '../commons/utils';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPagePage implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
  }

  async ngOnInit() {
    await goToProfileIfJustLogged(this.authService, this.router);
  }

}
