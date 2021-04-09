import {getItem, presentToast} from '../../../commons/utils';
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

  constructor(
    private userService: UsersService,
    public modalController: ModalController,
    private socialService: SocialService)
  {}

  allUsers: User[] = [];
  usersToShow: User[] = [];
  allFollowed: Follower[] = [];
  usersOffset = 0;
  usersLimit = 15;
  isSearching = false;
  search = '';
  userId: string;

  syncUserIdWithTemplate = async () => this.userId = await getItem('user_id');

  infiniteScrollUsers = (event) => {
    if (!this.isSearching) {
      return setTimeout(async () => {
        event.target.complete();
        const usersToPush = await this.userService.all('', String(this.usersToShow.length),
          String(this.usersLimit));
        this.usersToShow = [...this.usersToShow, ...usersToPush];
        if (this.usersToShow.length === this.allUsers.length) {
          event.target.disabled = true;
        }
      }, 500);
    } else {
      this.getSearch().then(() => setTimeout(async () => {
        event.target.complete();
        const usersToPush = await this.userService.all(this.search, String(this.usersToShow.length),
          String(this.usersLimit));
        this.usersToShow = [...this.usersToShow, ...usersToPush];
        if (this.usersToShow.length === this.allUsers.length) {
          event.target.disabled = true;
        }
      }, 500));
    }
  }

  getSearch = async () => this.usersToShow = await this.userService.all(this.search, String(this.usersOffset), String(this.usersLimit));

  stopSearchingIfEmptyField = async () => {
    if (this.search === '') {
      this.isSearching = false;
      await this.getUsersToShow();
    }
  }

  getAllUsers = async () => this.allUsers = await this.userService.all();

  getUsersToShow = async () => {
    this.usersToShow = await this.userService.all('', String(this.usersOffset), String(this.usersLimit));
  }

  async dismiss() {
    await this.modalController.dismiss({
      dismissed: true
    });
  }

  getAllFollowed = async () => this.allFollowed = await this.socialService.allFollowed(await getItem('user_id'));

  removeJustFollowed = (id: string) => this.allFollowed.find(({_id}: Follower) => _id === id);

  addFriend = async (userIdToFollow: string, userNameToFollow: string) => {
    try {
      await this.socialService.add(await getItem('user_id'), {userIdToFollow});
    } catch (error: any) {
      return presentToast(error);
    }
    await presentToast(`${userNameToFollow} added!`);
    await this.getUsersToShow();
    await this.getAllFollowed();
  }

  async ngOnInit() {
    await this.getAllUsers();
    await this.getAllFollowed();
    await this.getUsersToShow();
    await this.syncUserIdWithTemplate();
  }
}
