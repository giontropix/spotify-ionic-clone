import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {presentToast, setItem} from '../commons/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public router: Router
  ) { }

  group: FormGroup;
  isLogin = false;
  submitLogin: boolean;

  getMailErrorMessage = (): string => {
    if (this.group?.controls.mail.hasError('required')) {
      return 'You must enter a value';
    }
    return this.group?.controls.mail.hasError('email')
      ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage = (): string => {
    if (this.group?.controls.password.hasError('required')) {
      return 'You must enter a value';
    }
    return this.group?.controls.password.hasError('minlength')
      ? 'Insert 3 char al least'
      : '';
  }

  goToUser = async () => this.router.navigateByUrl(`tabs/tab1`);

  loginUser = async () => {
    this.isLogin = true;
    let user: any = {};
    if (this.group?.status === 'INVALID') {
      return await presentToast('Field not properly compiled');
    }
    try {
      user = await this.authService.login(this.group?.controls.mail.value, this.group?.controls.password.value);
    } catch (error: any) {
      return await presentToast(error);
    }
    await setItem('refresh_token', user.refresh_token);
    await setItem('access_token', user.access_token);
    await setItem('user_id', user.id);
    await this.goToUser();
  }

  ngOnInit() {
    this.submitLogin = false;
    this.group = this.formBuilder.group({
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
}
