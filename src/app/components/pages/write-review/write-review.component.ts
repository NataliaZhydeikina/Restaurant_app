import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from "firebase";

import { DatabaseService } from '../../../services/database/database.service';
import { LoaderService } from '../../../services/loader/loader.service';

@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.component.html',
  styleUrls: ['./write-review.component.scss']
})
export class WriteReviewComponent {
  rating: string;
  titlName: string = 'Write a Review';
  userName: any;
  userPhoto: any;
  review: string;
  dishPhoto: string = '';
  date: any;
  file: any;
  downloadURL: any = '../../../img/add-photo.png';
  viewPhoto: boolean = false;

  constructor(private router: Router, private ls: LoaderService, private ds: DatabaseService, private zone: NgZone) {
    let date = new Date();
    // this.date = '' + date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
    this.date = date.toDateString();
    firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (user) {
          this.userName = firebase.auth().currentUser.displayName;
          this.userPhoto = firebase.auth().currentUser.photoURL;
        }
      })
    })
  }

  sendReviewData() {
    this.ls.status = true;
    if (this.file) {
      this.ds.sendInfoForSendFile(this, this.file, this.setPhoto);
    } else {
      this.getAndRoute();
    }
    this.ds.writeReviewData(this.userName, this.userPhoto, this.review, this.rating, this.date, this.dishPhoto).then(() => {
      this.ds.changeRating();
    })
  }

  //Preuploading view photo
  setFile(File) {
    this.file = File;
    this.readFiles(File);
  }

  readFile(file, reader, callback) {
    reader.onload = () => {
      callback(reader.result);
    }
    reader.readAsDataURL(file);
  }

  readFiles(file) {
    let reader = new FileReader();
    if (file) {
      this.readFile(file, reader, (result) => {
        this.downloadURL = result;
        this.viewPhoto = true;
      });
    }
  }
  //End preuploading view photo

  setPhoto(imgURL, self) {
    self.zone.run(() => {
      self.ds.addPhotoToDish(imgURL);
      self.getAndRoute();
    })
  }
  getAndRoute() {
    this.ds.getData().then(() => {
      this.ls.status = false;
      this.router.navigateByUrl('/list')
    });
  }
}
