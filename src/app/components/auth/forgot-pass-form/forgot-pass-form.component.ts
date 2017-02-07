import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { InputValidator } from '../../../classes/input-validator';

import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-forgot-pass-form',
  templateUrl: './forgot-pass-form.component.html',
  styleUrls: ['./forgot-pass-form.component.scss']
})
export class ForgotPassFormComponent {

  titlName: string = 'Change password';
  form: FormGroup;
  emailEntered: boolean = false;


  constructor(private router: Router, private fb: FormBuilder, private as: AuthService) {
    this.form = fb.group({
      email: ['', Validators.compose([Validators.required, InputValidator.validateEmail])]
    });
  }

  resetPassword(f) {
    this.emailEntered = true;
    this.as.resetPassword(f.value.email).then(() => {
    }, (error) => {
      console.log(error.message);
    });
  }


  login(f) {
    let formValueObject = f.value; //send data to backend
    this.router.navigateByUrl('/enter-pass');
  }
}
