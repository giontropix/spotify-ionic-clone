import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    private toastController:ToastController) { }

    group?: FormGroup;

    getMailErrorMessage = (): string => {
      if (this.group?.controls.mail.hasError('required')) {
        return 'You must enter a value';
      }
      return this.group?.controls.mail.hasError('email')
        ? 'Not a valid email' : '';
    }
  
    getUserNameErrorMessage = (): string => {
      if (this.group?.controls.user_name.hasError('required')) {
        return 'You must enter a value';
      }
      return this.group?.controls.user_name.hasError('minlength')
        ? 'Insert 3 char al least'
        : '';
    }
  
    getPasswordErrorMessage = (): string => {
      if (this.group?.controls.user_name.hasError('required')) {
        return 'You must enter a value';
      }
      return this.group?.controls.user_name.hasError('minlength')
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
  
    regUser = async () => {
      if (this.group?.status === 'INVALID') { return this.presentToastWithOptions('Field not properly compiled', 'Repeat'); }
      try {
        await this.authService
          .register(this.group?.controls.mail.value, this.group?.controls.user_name.value,
            this.group?.controls.password.value, this.group?.controls.sex.value);
      } catch (error: any){
        return this.presentToastWithOptions(error, 'Repeat!');
      }
      return this.presentToastWithOptions(`User ${this.group?.controls.user_name.value} created!`, '');
    }
  
    ngOnInit(): void {
      localStorage.setItem('translateTitle', 'true');
      this.group = this.formBuilder.group({
        mail: ['', [Validators.required, Validators.email]],
        user_name: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(4)]],
        sex: ['M', [Validators.required]]
      });
    }

}
