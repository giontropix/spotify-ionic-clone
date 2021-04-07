import { ModalController, ToastController } from '@ionic/angular';
import { SocialService } from '../../../services/social.service';
import { Component, OnInit } from '@angular/core';
import { Follower } from 'src/app/models/Follower';

@Component({
  selector: 'app-followed',
  templateUrl: './followed.component.html',
  styleUrls: ['./followed.component.scss'],
})
export class FollowedComponent implements OnInit {

  constructor(
    private friendsService: SocialService,
    private toastController: ToastController,
    public modalController: ModalController
  ) { }

  followed: Follower[] = [];
  allFollowed: Follower[] = [];
  followedOffset = 0;
  followedLimit = 5;

  getAllFollowed = async () => this.allFollowed = await this.friendsService.allFollowed(localStorage.getItem('user_id'));

  getFollowed = async () => this.followed =
    await this.friendsService.allFollowed(localStorage.getItem('user_id'), String(this.followedOffset), String(this.followedLimit))

  removeFollowed = async (friendToUnfollowId: string, friendToUnfollowName: string) => {
    await this.friendsService.remove(localStorage.getItem('user_id'), friendToUnfollowId);
    await this.presentToast(`${friendToUnfollowName} removed from followed list!`);
    await this.getAllFollowed();
  }

  async presentToast(message: string, duration = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'top'
    });
    await toast.present();
  }

  async dismiss() {
    await this.modalController.dismiss({
      dismissed: true
    });
  }

  async ngOnInit() {
    await this.getAllFollowed();
    await this.getFollowed();
  }
}