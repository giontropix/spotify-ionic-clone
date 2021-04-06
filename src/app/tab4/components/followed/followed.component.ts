
import { ModalController, ToastController } from '@ionic/angular';
import { SocialService } from './../../../services/social.service';
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
  followers: Follower[] = [];
  allFollowers: Follower[] = [];
  followedOffset = 0;
  followedLimit = 5;
  followersOffset = 0;
  followersLimit = 5;
  isFollowedShowed = false;
  isFollowersShowed = false;

  showFriends = () => {
    this.isFollowedShowed = !this.isFollowedShowed;
  }

  showFollowers = () => {
    this.isFollowersShowed = !this.isFollowersShowed;
  }

  getAllFollowed = async () => this.allFollowed = await this.friendsService.allFollowed(localStorage.getItem("user_id"));

  getAllFollowers = async () => this.allFollowers = await this.friendsService.allFollowers(localStorage.getItem("user_id"));

  getFollowed = async () => this.followed =
    await this.friendsService.allFollowed(localStorage.getItem("user_id"), String(this.followedOffset), String(this.followedLimit))

  getFollowers = async () => this.followers =
    await this.friendsService.allFollowers(localStorage.getItem("user_id"), String(this.followedOffset), String(this.followedLimit))


  removeFollowed = async (friendToUnfollowId: string, friendToUnfollowName: string) => {
    await this.friendsService.remove(localStorage.getItem("user_id"), friendToUnfollowId);
    this.presentToast(`${friendToUnfollowName} removed from followed list!`);
    //this.getFollowed()//.then(() => {
    //   if (this.followed.length === 0 && this.followedOffset !== 0) { this.prevFollowed(); }
    // });
    this.getAllFollowed();
  }

  blockFollower = async (friendToUnfollowId: string, friendToUnfollowName: string) => {
    await this.friendsService.block(localStorage.getItem("user_id"), friendToUnfollowId);
    this.presentToast(`${friendToUnfollowName} blocked!`);
    this.getFollowers()//.then(() => {
    //   if (this.followers.length === 0 && this.followersOffset !== 0) { this.prevFollowers(); }
    // });
    this.getAllFollowers();
  }

  async presentToast(message: string, duration = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'top'
    });
    await toast.present();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }



  ngOnInit(): void {
    this.getAllFollowed();
    this.getAllFollowers();
    this.getFollowed();
    this.getFollowers();
    console.log(this.allFollowed)
  }
}