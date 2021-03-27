import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private authService: AuthService,
    public router: Router,
    public usersService: ProfileService,
    public route: ActivatedRoute
  ) {}

  user: User;

  getUser = async () =>
    (this.user = await this.usersService.get(/*this.route.snapshot.params.id*/'U1613583743602'));

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
  };

  ngOnInit() {
    this.getUser();
  }
}
