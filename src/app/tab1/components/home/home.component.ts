import {Component, Input, OnInit} from '@angular/core';
import {Song} from '../../../models/Song';
import {SongsService} from '../../../services/songs.service';
import {UsersService} from '../../../services/users.service';
import {startPlaying} from '../../../commons/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(private songsService: SongsService,
              private usersService: UsersService,
  ) { }
  @Input() title: string;
  @Input() list: Song[];
  @Input() componentRole: string;

  startPlaying = (song: Song) => startPlaying(this.songsService, this.usersService, song);

  ngOnInit() {}

}
