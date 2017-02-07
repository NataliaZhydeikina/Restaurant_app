import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from "firebase";



@Injectable()
export class AuthService {
  public isLoggedIn: boolean;
  user: any = firebase.auth().currentUser;
  fromList: boolean = false;

  constructor(private router: Router) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.isLoggedIn = true;
        console.log("User is signed in.")
      } else {
        this.isLoggedIn = false;
        console.log("No user is signed in.")
      }
    });
  }
  getUser() {
    return firebase.auth().currentUser;
  }
  checkAuth() {
    if (this.isLoggedIn == true) {
      return true;
    } else {
      return false;
    }
  }

  createUser(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        var errorMessage = error.message;
        alert(errorMessage);
        console.log(error);
      });
  }
  updateUser(name: string, imageUrl: string) {
    let user = firebase.auth().currentUser;
    return user.updateProfile({
      displayName: name,
      photoURL: imageUrl
    })
    // this.writeUserData(user.uid, user.displayName, user.email, user.photoURL);
  }

  writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' + userId).set({
      username: name,
      email: email,
      profile_picture: imageUrl
    });
  }

  facebookLogin() {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
      var token = result.credential.accessToken;
      var user = result.user;
      this.router.navigateByUrl('/write-review');
    }).catch((error) => {
      var errorMessage = error.message;
    });

  }
  twitterLogin() {
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
      var token = result.credential.accessToken;
      var secret = result.credential.secret;
      var user = result.user;
      this.router.navigateByUrl('/write-review');
    }).catch((error) => {
      var errorMessage = error.message;
    });
  }
  googleLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
      var token = result.credential.accessToken;
      var user = result.user;
      this.router.navigateByUrl('/write-review');
    }).catch((error) => {
      var errorMessage = error.message;
    });
  }



  loginWithPassword(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  }

  resetPassword(emailAddress) {
    return firebase.auth().sendPasswordResetEmail(emailAddress);
  }

  handleResetPassword(actionCode, newPassword) {
    var accountEmail;
    // Verify the password reset code is valid.
    firebase.auth().verifyPasswordResetCode(actionCode).then((email) => {
      var accountEmail = email;

      // TODO: Show the reset screen with the user's email and ask the user for
      // the new password.

      // Save the new password.
      firebase.auth().confirmPasswordReset(actionCode, newPassword).then((resp) => {
        // Password reset has been confirmed and new password updated.

        // TODO: Display a link back to the app, or sign-in the user directly
        // if the page belongs to the same domain as the app:
        // auth.signInWithEmailAndPassword(accountEmail, newPassword);
      }).catch((error) => {
        console.log(error)
      });
    }).catch((error) => {
      console.log(error)
    });
  }

  logOut() {
    return firebase.auth().signOut();
  }

}
