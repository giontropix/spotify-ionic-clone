import {presentToast} from '../../../commons/utils';
import {SocialService} from '../../../services/social.service';
import {User} from 'src/app/models/User';
import {Component, OnInit} from '@angular/core';
import {UsersService} from 'src/app/services/users.service';
import {ModalController} from '@ionic/angular';
import {Follower} from 'src/app/models/Follower';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  User: any;

  constructor(private userService: UsersService, public modalController: ModalController, private socialService: SocialService) {
  }

  users: User[] = [];
  allFollowed: Follower[] = [];

  getAll = async () => this.users = await this.userService.all();

  async dismiss() {
    await this.modalController.dismiss({
      dismissed: true
    });
  }

  getAllFollowed = async () => this.allFollowed = await this.socialService.allFollowed(localStorage.getItem('user_id'));

  removeJustFollowed = (id: string) => this.allFollowed.find(({_id}: Follower) => _id === id);

  addFriend = async (userIdToFollow: string, userNameToFollow: string) => {
    try {
      await this.socialService.add(localStorage.getItem('user_id'), {userIdToFollow});
    } catch (error: any) {
      return presentToast(error);
    }
    await presentToast(`${userNameToFollow} added!`);
  }

  async ngOnInit() {
    await this.getAll();
    await this.getAllFollowed();
  }
}
