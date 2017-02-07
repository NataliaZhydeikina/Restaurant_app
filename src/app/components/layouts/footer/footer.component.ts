import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private router: Router, private as: AuthService) {
  }

  ngOnInit() {
  }

  logOut() {
    this.router.navigateByUrl('/');
    this.as.logOut();
  }
  routToChangePass() {
    this.router.navigateByUrl('/chenge-pass')
  }
}