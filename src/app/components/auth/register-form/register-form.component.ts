import { Component, Inject, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from "firebase";


import { InputValidator } from '../../../classes/input-validator';
import { AuthService } from '../../../services/auth/auth.service';
import { DatabaseService } from '../../../services/database/database.service';
import { LoaderService } from '../../../services/loader/loader.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {

  titlName: string = 'Register';
  form: FormGroup;
  viewPhoto: boolean = false;
  downloadURL: any = '../../../img/person-icon.png';
  personPhoto: string = 'https://firebasestorage.googleapis.com/v0/b/sep-angular2.appspot.com/o/images%2Fusers%2Fperson-icon.png?alt=media&token=da37e0bc-0059-4afc-8fbf-a5e9d84ba09a'
  userName: string;
  file: any;

  constructor(private ls: LoaderService, private fb: FormBuilder, private router: Router, private as: AuthService, private ds: DatabaseService, private zone: NgZone) {
    this.form = fb.group({
      email: ['', Validators.compose([Validators.required, InputValidator.validateEmail])],
      name: ['', Validators.compose([Validators.required, InputValidator.validateName])],
      password: ['', Validators.compose([Validators.required, InputValidator.validatePassword])]
    });
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
  setPhoto(imgURL, self) {
    self.zone.run(() => {
      self.downloadURL = imgURL;
      self.setUser(self.downloadURL);
      self.ls.status = false;
    })
  }

  setUser(photoUrl) {
    let user = firebase.auth().currentUser;
    this.as.updateUser(this.userName, photoUrl).then(() => {
      this.router.navigateByUrl('/write-review');
      this.as.writeUserData(user.uid, user.displayName, user.email, user.photoURL);
    })
  }
  login(f) {
    let formValueObject = f.value; //send data to backend
  }
  register(f) {
    this.ls.status = true;
    let self = this;
    this.userName = f.value.name;
    this.as.createUser(
      f.value.email,
      f.value.password
    )
      .then(() => {
        if (!this.file) {
          this.setUser(this.personPhoto);
        } else {
          this.ds.sendFile(this, this.file, 'users/', f.value.name, this.setPhoto);
        }

      },
      (error) => {
      });
  }

}