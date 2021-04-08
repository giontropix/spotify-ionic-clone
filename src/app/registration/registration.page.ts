import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {goToProfileIfJustLogged, presentToast} from '../commons/utils';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  group: FormGroup;
  submitRegistration: boolean;

  getMailErrorMessage = (): string => {
    if (this.group.controls.mail.hasError('required')) {
      return 'You must enter a value';
    }
    return this.group.controls.mail.hasError('email')
      ? 'Not a valid email' : '';
  }

  getUserNameErrorMessage = (): string => {
    if (this.group.controls.user_name.hasError('required')) {
      return 'You must enter a value';
    }
    return this.group.controls.user_name.hasError('minlength')
      ? 'Insert 3 char al least'
      : '';
  }

  getPasswordErrorMessage = (): string => {
    if (this.group.controls.password.hasError('required')) {
      return 'You must enter a value';
    }
    return this.group.controls.password.hasError('minlength')
      ? 'Insert 3 char al least'
      : '';
  }

  regUser = async () => {
    if (this.group.status === 'INVALID') {
      return presentToast('Field not properly compiled');
    }
    try {
      await this.authService.register(
        this.group.controls.mail.value, this.group.controls.user_name.value,
        this.group.controls.password.value, this.group.controls.sex.value);
    } catch (error: any) {
      return presentToast(error);
    }
    return presentToast(`User ${this.group.controls.user_name.value} created!`);
  }

  async ngOnInit() {
    await goToProfileIfJustLogged(this.authService, this.router);
    this.submitRegistration = false;
    this.group = this.formBuilder.group({
      mail: ['', [Validators.required, Validators.email]],
      user_name: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      sex: ['M', [Validators.required]]
    });
  }
}
