import { User } from 'src/app/models/User';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  User: any;

  constructor(private userService: UsersService, public modalController: ModalController) { }

  users: User[] = []
  

  getAll = async () => this.users= await this.userService.all();

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });

  }
  ngOnInit():void {
    this.getAll().then(() => console.log(this.users))
  }
  
}
