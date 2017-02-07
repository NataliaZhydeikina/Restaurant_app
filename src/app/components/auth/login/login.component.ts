import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { InputValidator } from '../../../classes/input-validator';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})



export class LoginComponent {

  titlName: string = 'Login';
  form: FormGroup;
  alertDanger: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private as: AuthService, private zone: NgZone) {
    this.form = fb.group({
      email: ['', Validators.compose([Validators.required, InputValidator.validateEmail])],
      password: ['', Validators.compose([Validators.required, InputValidator.validatePassword])]
    });
  }

  facebookLogin() {
    this.as.facebookLogin();
  }
  twitterLogin() {
    this.as.twitterLogin();
  }
  googleLogin() {
    this.as.googleLogin();
  }
  logIn(f) {
    this.as.loginWithPassword(
      f.value.email,
      f.value.password).catch((error) => {
        this.zone.run(() => {
          console.log(error.message);
          this.alertDanger = true;
        })
      }).then(() => {
        if (this.alertDanger) return;
          this.router.navigateByUrl('/write-review');
      });

  }
  resetAlert() {
    this.alertDanger = false;
  }

}
