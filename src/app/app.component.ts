import { Component } from '@angular/core';
import * as firebase from "firebase";

import { LoaderService } from './services/loader/loader.service';



import './rxjs-operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private ls: LoaderService) {
    firebase.initializeApp({
      apiKey: 'AIzaSyB0JIEHu5gOwz8UGKwlWXN34Vr8SgiDf6Q',
      authDomain: 'sep-angular2.firebaseapp.com',
      databaseURL: 'https://sep-angular2.firebaseio.com',
      storageBucket: 'sep-angular2.appspot.com',
      messagingSenderId: '527845588276'
    });
  }

}
