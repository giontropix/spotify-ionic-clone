import {Component, OnInit} from '@angular/core';
import {getItem} from '../commons/utils';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPagePage implements OnInit {

  constructor() {}
  id: string;

  async ngOnInit() {
    this.id = await getItem('user_id');
  }
}
