import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup | any;
  isTypePassword: boolean = true;
  isLogin: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController
  ) { 
    this.initForm();
  }

  ngOnInit() {
  }
  
  initForm() {
    this.form = new FormGroup({
      username: new FormControl('', 
        {validators: [Validators.required]}
      ),
      email: new FormControl('', 
        {validators: [Validators.required, Validators.email]}
      ),
      password: new FormControl('', 
        {validators: [Validators.required, Validators.minLength(8)]}
      ),
    });
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

  onSubmit() {
    if (this.form != undefined) {
      if(!this.form.valid) {
        this.login(this.form);
      };
      console.log(this.form.value);
    }
  }

  login(form: FormGroup) {
    this.authService.login(form.value.email, form.value.password).then(data => {
      console.log(data);
      this.router.navigateByUrl('/main');
      form.reset();
    })
    .catch(err => {
      console.log(err);
      let msg: string = "Could not sign you up, please try again";
      if(err.code === 'auth/email-already-in-use') {
        msg = err.message;
      }
      this.showAlert(msg);
    });
  }

  async showAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      // subHeader: 'Important message',
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
