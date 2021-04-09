import {AlertController, ModalController} from '@ionic/angular';
import {SocialService} from '../../../services/social.service';
import {Component, OnInit} from '@angular/core';
import {Follower} from 'src/app/models/Follower';
import {getItem, presentToast} from '../../../commons/utils';

@Component({
  selector: 'app-followed',
  templateUrl: './followed.component.html',
  styleUrls: ['./followed.component.scss'],
})
export class FollowedComponent implements OnInit {

  constructor(
    private socialService: SocialService,
    public modalController: ModalController,
    public alertController: AlertController
  ) {
  }

  followedToShow: Follower[] = [];
  allFollowed: Follower[] = [];
  followedOffset = 0;
  followedLimit = 5;
  followedLimitInfinite: number;
  isSearching = false;
  search = '';

  infiniteScrollSongs = (event) => {
    if (!this.isSearching) {
      return setTimeout(async () => {
        event.target.complete();
        const songsToPush = await this.socialService.allFollowed(await getItem('user_id'), '', String(this.followedToShow.length),
          String(this.followedLimit));
        this.followedToShow = [...this.followedToShow, ...songsToPush];
        this.followedLimitInfinite = this.followedToShow.length;
        if (this.followedToShow.length === this.allFollowed.length) {
          event.target.disabled = true;
        }
      }, 500);
    } else {
      this.getSearch().then(() => setTimeout(async () => {
        event.target.complete();
        const songsToPush = await this.socialService.allFollowed(await getItem('user_id'), this.search, String(this.followedToShow.length),
          String(this.followedLimit));
        this.followedToShow = [...this.followedToShow, ...songsToPush];
        this.followedLimitInfinite = this.followedToShow.length;
        if (this.followedToShow.length === this.allFollowed.length) {
          event.target.disabled = true;
        }
      }, 500));
    }
  }

  getAllFollowed = async () => this.allFollowed = await this.socialService.allFollowed(await getItem('user_id'));

  getFollowedToShow = async (limit?: number) => {
    if (!limit) {
      this.followedToShow =
        await this.socialService.allFollowed(await getItem('user_id'), '', String(this.followedOffset), String(this.followedLimit));
    } else { this.followedToShow =
      await this.socialService.allFollowed(await getItem('user_id'), '', String(this.followedOffset), String(limit)); }
  }

  getSearch = async () => this.followedToShow =
    await this.socialService.allFollowed(await getItem('user_id'), this.search, String(this.followedOffset),
    String(this.followedLimit))

  stopSearchingIfEmptyField = async () => {
    console.log(this.search);
    if (this.search === '') {
      this.isSearching = false;
      await this.getFollowedToShow();
    }
  }

  removeFollowed = async (friendToUnfollowId: string, friendToUnfollowName: string) => {
    await this.socialService.remove(await getItem('user_id'), friendToUnfollowId);
    await presentToast(`${friendToUnfollowName} removed from followed list!`);
    await this.getFollowedToShow(this.followedLimitInfinite);
  }

  async confirmRemoveFollowed(friendToUnfollowId: string, friendToUnfollowName: string) {
    const alert = await this.alertController.create({
      cssClass: 'modal-followed',
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
    await this.getFollowedToShow();
  }
}
