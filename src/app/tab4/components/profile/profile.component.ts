import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from 'src/app/models/User';
import {AuthService} from 'src/app/services/auth.service';
import {ProfileService} from 'src/app/services/profile.service';
import {ModalController, NavParams} from '@ionic/angular';

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
    public modalController: ModalController
  ) {
  }

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
      localStorage.setItem('user_id', '');
      await this.router.navigate(['/welcome']);
    }
  }

  /*async openListOfUsers() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        user_id: localStorage.getItem('user_id')
      }
    });
    return await modal.present();
  }

  async openListOfFollowed() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        user_id: localStorage.getItem('user_id')
      }
    });
    return await modal.present();
  }

  async openListOfFollowers() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        user_id: localStorage.getItem('user_id')
      }
    });
    return await modal.present();
  }*/

  async ngOnInit() {
    await this.getUser();
  }
}
