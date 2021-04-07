import {UsersListComponent} from './../users-list/users-list.component';
import {FollowedComponent} from './../followed/followed.component';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from 'src/app/models/User';
import {AuthService} from 'src/app/services/auth.service';
import {ModalController, NavParams} from '@ionic/angular';
import {UsersService} from '../../../services/users.service';
import {USER_ID} from '../../../commons/utils';

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
    public usersService: UsersService,
    public route: ActivatedRoute,
    public navParams: NavParams,
    public modalController: ModalController
  ) {
  }

  user: User;

  getUser = async () =>
    (this.user = await this.usersService.get(USER_ID))

  logout = async () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    if (accessToken && refreshToken) {
      await this.authService.logout(accessToken, refreshToken);
      localStorage.setItem('access_token', '');
      localStorage.setItem('refresh_token', '');
      localStorage.setItem('user_id', '');
      await this.router.navigate(['/welcome']);
    }
  }

  async openListOfUsers() {
    const modal = await this.modalController.create({
      component: UsersListComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        user_id: USER_ID
      }
    });
    return await modal.present();
  }

  async openListOfFollowed() {
    const modal = await this.modalController.create({
      component: FollowedComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        user_id: USER_ID
      }
    });
    return await modal.present();
  }

  async ngOnInit() {
    await this.getUser();
  }
}
