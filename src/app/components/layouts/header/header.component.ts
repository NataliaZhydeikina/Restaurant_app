import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as firebase from "firebase";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  isClassVisible: boolean = false;
  active: boolean;
  user: any = firebase.auth().currentUser;
  display: boolean = false;
  name: string = "person";
  photo: any = '../img/person-icon.png';

  @Input('sendedTitle') title: string;
  @Input('sendButtons') withButtons: boolean;

  constructor(private zone: NgZone, private router: Router, private location: Location) {
    firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (user) {
          this.name = firebase.auth().currentUser.displayName;
          this.photo = firebase.auth().currentUser.photoURL;
          this.display = true;
        }
      })
    })
  }

  ngOnInit() {
    this.setActive();
  }

  setActive() {
    if (this.router.url == '/list') {
      this.active = true;
    } else {
      this.active = false;
    }
  }

  routToPrev() {
    this.location.back();
    // this.rs.routToPrev()
  }
  routTo(rout) {
    this.router.navigateByUrl(rout);
  }

}