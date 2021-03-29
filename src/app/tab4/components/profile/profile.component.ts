import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import {NavParams} from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  providers: [NavParams],
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private authService: AuthService,
    public router: Router,
    public usersService: ProfileService,
    public route: ActivatedRoute,
    public navParams: NavParams,
  ) {}

  user: User;

  getUser = async () =>
    (this.user = await this.usersService.get(localStorage.getItem('user_id')))

  logout = async () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    if (accessToken && refreshToken) {
      await this.authService.logout(accessToken, refreshToken);
      localStorage.setItem('access_token', '');
      localStorage.setItem('refresh_token', '');
      localStorage.setItem('translateTitle', 'false');
      await this.router.navigate(['/welcome']);
    }
  }

  ngOnInit() {
    console.log(this.route.parent );
    this.getUser();
  }
}
