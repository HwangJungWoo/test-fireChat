import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signupForm: FormGroup | any;
  isTypePassword: boolean = true;
  isLoding: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
  ) {
    this.initForm();
  }

  ngOnInit() {
  }

  initForm() {
    this.signupForm = new FormGroup({
      username: new FormControl('',
        { validators: [Validators.required] }
      ),
      email: new FormControl('',
        { validators: [Validators.required, Validators.email] }
      ),
      password: new FormControl('',
        { validators: [Validators.required, Validators.minLength(8)] }
      ),
    });
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

  onSubmit() {
    if (!this.signupForm.valid) return;
    this.register(this.signupForm);
    console.log(this.signupForm.value);
  }

  register(form: any) {
    this.isLoding = true;
    this.authService.register(form.value).then((data: any) => {
      this.router.navigateByUrl('/main');
      this.isLoding = false;
      form.reset();
    })
      .catch((error: any) => {
        console.log(error);
        this.isLoding = false;
        let msg: string = "Could not sign you up, please try again";
        if (error.code === 'auth/email-already-in-use') {
          msg = error.message;
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
