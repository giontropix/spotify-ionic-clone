import {UsersListComponent} from '../users-list/users-list.component';
import {FollowedComponent} from '../followed/followed.component';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from 'src/app/models/User';
import {AuthService} from 'src/app/services/auth.service';
import {ModalController, NavParams} from '@ionic/angular';
import {UsersService} from '../../../services/users.service';
import {getItem, removeItem} from '../../../commons/utils';

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
    (this.user = await this.usersService.get(await getItem('user_id')))

  logout = async () => {
    const accessToken =  await getItem('access_token');
    const refreshToken = await getItem('refresh_token');
    if (accessToken && refreshToken) {
      await this.authService.logout(accessToken, refreshToken);
      await removeItem('access_token');
      await removeItem('refresh_token');
      await removeItem('user_id');
      await this.router.navigateByUrl('/welcome');
    }
  }

  async openListOfUsers() {
    const modal = await this.modalController.create({
      component: UsersListComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        user_id: await getItem('user_id')
      }
    });
    return await modal.present();
  }

  async openListOfFollowed() {
    const modal = await this.modalController.create({
      component: FollowedComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        user_id: await getItem('user_id')
      }
    });
    return await modal.present();
  }

  async ngOnInit() {
    await this.getUser();
  }
}
