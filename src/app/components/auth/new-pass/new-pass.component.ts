import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { InputValidator } from '../../../classes/input-validator';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-new-pass',
  templateUrl: './new-pass.component.html',
  styleUrls: ['./new-pass.component.scss']
})
export class NewPassComponent {

  titlName: string = 'Change password';
  form: FormGroup;
  actionCode: any;


  constructor(private router: Router, private fb:	FormBuilder, private as: AuthService) {
    this.form = fb.group({
      password: ['', Validators.compose([Validators.required, InputValidator.validatePassword])],
      passwordcheck: ['', Validators.compose([Validators.required, InputValidator.validateIdentityPassword])]
    });
    let mode = this.getParameterByName('mode');
    this.actionCode = this.getParameterByName('oobCode');
    let apiKey = this.getParameterByName('apiKey');
  }
  getParameterByName(name: string) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp(`[\?&]${name}=([^&#]*)`);
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  login(f) {
    this.as.handleResetPassword(this.actionCode, f.value.password)
    this.router.navigateByUrl('/login');
  }

}
