import {AlertController, ModalController} from '@ionic/angular';
import {SocialService} from '../../../services/social.service';
import {Component, OnInit} from '@angular/core';
import {Follower} from 'src/app/models/Follower';
import {presentToast, USER_ID} from '../../../commons/utils';

@Component({
  selector: 'app-followed',
  templateUrl: './followed.component.html',
  styleUrls: ['./followed.component.scss'],
})
export class FollowedComponent implements OnInit {

  constructor(
    private friendsService: SocialService,
    public modalController: ModalController,
    public alertController: AlertController
  ) {
  }

  followed: Follower[] = [];
  allFollowed: Follower[] = [];
  followedOffset = 0;
  followedLimit = 5;

  getAllFollowed = async () => this.allFollowed = await this.friendsService.allFollowed(USER_ID);

  getFollowed = async () => this.followed =
    await this.friendsService.allFollowed(USER_ID, String(this.followedOffset), String(this.followedLimit))

  removeFollowed = async (friendToUnfollowId: string, friendToUnfollowName: string) => {
    await this.friendsService.remove(USER_ID, friendToUnfollowId);
    await presentToast(`${friendToUnfollowName} removed from followed list!`);
    await this.getAllFollowed();
  }

  async confirmRemoveFollowed(friendToUnfollowId: string, friendToUnfollowName: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: `Do you really want to <strong>remove</strong> ${friendToUnfollowName} from your friends list?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Okay',
          handler: () => {
            this.removeFollowed(friendToUnfollowId, friendToUnfollowName);
          }
        }
      ]
    });
    await alert.present();
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
