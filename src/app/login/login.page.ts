import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    public authService: AuthService,
    private toastController:ToastController,
    public formBuilder: FormBuilder,
    public router: Router
  ) { }

  group?: FormGroup;

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

  async presentToastWithOptions(message: string, action: string) {
    const toast = await this.toastController.create({
      header: 'Notification',
      message,
      position: 'top',
      duration: 3000,
      buttons: [
        {
          text: action,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  goToUser = (id: string) => this.router.navigate([`/users/${id}`]);

  loginUser = async () => {
    let user: any = {};
    if (this.group?.status === 'INVALID') {
      return await this.presentToastWithOptions('Field not properly compiled', 'Repeat');
    }
    try {
      user = await this.authService.login(this.group?.controls.mail.value, this.group?.controls.password.value);
    } catch (error: any) {
      return await this.presentToastWithOptions(error, 'Repeat!');
    }
    localStorage.setItem('refresh_token', user.refresh_token);
    localStorage.setItem('access_token', user.access_token);
    localStorage.setItem('user_id', user.id);
    await this.goToUser(user.id);
  }

  ngOnInit(): void {
    localStorage.setItem('translateTitle', 'true');
    this.group = this.formBuilder.group({
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
    console.log(this.group);
  }

}
