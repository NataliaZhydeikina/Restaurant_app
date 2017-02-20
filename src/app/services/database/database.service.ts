import { Injectable, NgZone } from '@angular/core';
import * as firebase from "firebase";
declare var GeoFire: any;

import { ItemConstructor } from '../../classes/item-constructor'

import { LoaderService } from '../loader/loader.service';
import { MapService } from '../map/map.service';

@Injectable()
export class DatabaseService {

  itemIndex: any;
  dishIndex: any;
  reviewIndex: any;
  foodPhotoIndex: any;

  userName: string;
  userPhoto: any;
  user: any;

  pathToReviews: any;
  pathToDish: any;

  dishName: any;
  barName: any;

  searchArray: any;

  lat;
  lng;

  date: any;
  day: any;
  compareHours: any;
  filteredArray: any = [];
  filteredArrayLatLng: any = [];
  filteredArrForMap: any = [];
  itemForItemPage: any;

  public center: any = [];
  itemForMap: any;
  itemLoc: any;
  forNav: any;
  public onMain: boolean;


  constructor(private ls: LoaderService, private zone: NgZone) {
    this.date = new Date();
    this.day = this.date.getDay();
    this.compareHours = this.date.getHours() + 1;
    // this.filteredArray = this.getItems();
    this.setCurrentPosition();
    //this.getMapMarkers();
  }

  filteredData: any = [];
  getData() {
    this.ls.status = true;
    this.filteredData = [];
    let promiseArr = [];
    let ref = firebase.database().ref('/data');
    return new Promise((resolve, reject) => {
      this.getDataIdArray().then((dataIdArray) => {
        for (let index in dataIdArray) {
          promiseArr[index] = ref.child(dataIdArray[index]).once("value").then((dataSnapshot) => {
            let data = dataSnapshot.val();
            let center = [this.lat || 49.834685, this.lng || 24.018346];
            let dataLocation = [data.location.lat, data.location.lng]
            data.distance = GeoFire.distance(center, dataLocation).toFixed(3)
            this.filteredData.push(data);
          });
        };
        Promise.all(promiseArr).then(() => {
          this.zone.run(()=> {
            this.ls.status = false;
            this.ls.opacity = false;
          })
          this.filteredData.sort((a, b)=> {
            return a.distance - b.distance;
          })
          resolve(this.filteredData);
        });
      });
    });
  }


  // From MapService. 
  setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        if(!this.lat && !this.lng) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        }
      }, () => {
        console.log('set current error');
      }, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 1000
        });
    }
  }

  getDataIdArray() {
    return new Promise((resolve, reject) => {
      let ref = firebase.database().ref('/data');
      var geoFire = new GeoFire(ref.child('_geofire'));
      var geoQuery = geoFire.query({
        center: [this.lat || 49.834685, this.lng || 24.018346],
        radius: 2
      });
      let dataIdArray = [];
      geoQuery.on("key_entered", (dataId, dataLocation) => {
        dataId = dataId;
        dataIdArray.push(dataId);
      });
      geoQuery.on("ready", () => {
        resolve(dataIdArray);
      });
    });

  }

  getItems() {
    let array = [];
    this.filteredArray = [];
    this.filteredArrayLatLng = [];
    this.filteredArrForMap = [];
    let sa = this.searchArray;
    let fd = this.filteredData;
    let check;
    if (!sa) {
      return;
    }
    for (let i = 0; i < fd.length; i++) {
      this.filteredArrayLatLng.push(fd[i].location);
      for (let j = 0; j < sa.length; j++) {
        if (sa[j].placeIndex == fd[i].index) {
          let dish = fd[i].dishes[sa[j].dishIndex];
          let place = fd[i];
          let workSchedule = place.workSchedule[this.day];
          let getStatus = () => {
            if (workSchedule.opening == 'closed' || workSchedule.opening == 'closed') {
              return 'Closed today';
            } else if (this.compareHours < workSchedule.opening) {  // Если еще не открылись
              let result;
              let dayPart;
              if (workSchedule.opening >= 12) { // Если открываются в 12 или после 12
                if (workSchedule.opening == 24) {
                  result = workSchedule.opening - 12;
                  dayPart = ' am'
                } else {
                  result = workSchedule.opening == 12 ? 12 : workSchedule.opening - 12;
                  dayPart = ' pm'
                }
              } else { // Если открываются до 12
                result = workSchedule.opening;
                dayPart = ' am'
              }
              return 'Will be open in ' + result + dayPart;
            } else if (this.compareHours >= workSchedule.closing) {  // Если уже закрылись
              let result = workSchedule.opening; // **вопрос
              let dayPart = workSchedule.opening >= 12 && workSchedule.opening != 24 ? ' pm' : ' am'
              return 'Already closed. Will be opened in ' + result + dayPart;
            } else { // если еще открыты
              let result;
              let dayPart;
              if (workSchedule.closing >= 12 && workSchedule.closing != 24) {
                result = workSchedule.closing == 12 ? 12 : workSchedule.closing - 12;
                dayPart = ' pm'
              } else {
                result = workSchedule.closing == 24 ? workSchedule.closing / 2 : workSchedule.closing;
                dayPart = ' am'
              }
              return 'Open till ' + result + dayPart;
            }
          }
          let status = getStatus();
          let item = new ItemConstructor(
            dish.name,
            dish.rating,
            dish.reviews,
            place.index,
            place.name,
            place.adress,
            place.phone,
            status,
            dish.price,
            place.distance,
            false,
            dish.description,
            dish.foodPhoto,
            dish.index,
            place.location
          )
          if (check != item.uid) {
            check = item.uid;
            this.filteredArrForMap.push({location : place.location, uid: place.uid});
          }
          array.sort((a) => {
            return a.status == 'Closed today' || a.status.indexOf('Already closed') == 0 ? 1 : -1;
          })
          array.push(item);
        }
      }
    }
    this.filteredArray = array;
    return array;
  }

  pushInfo(itemIndex, dishIndex, reviewIndex, itemName, dishName, foodPhotoIndex) {
    this.itemIndex = itemIndex;
    this.reviewIndex = reviewIndex;
    this.dishIndex = dishIndex;
    this.barName = itemName;
    this.dishName = dishName;
    this.foodPhotoIndex = foodPhotoIndex;
    this.pathToDish = 'data/' + this.itemIndex + '/dishes/' + this.dishIndex;
  }

  writeReviewData(reviewerName, reviewerPhoto, review, rating, date, dishPhoto) {
    this.pathToReviews = 'data/' + this.itemIndex + '/dishes/' + this.dishIndex + '/reviews/';
    return firebase.database().ref(this.pathToReviews + this.reviewIndex).set({
      date: date,
      rating: rating,
      review: review,
      reviewer: reviewerName,
      reviewerPhoto: reviewerPhoto,
      dishPhoto: dishPhoto
    });
  }

  addPhotoToDish(imgURL) {
    let pethToFoodPhoto = this.pathToDish + '/foodPhoto/';
    return firebase.database().ref(pethToFoodPhoto + this.foodPhotoIndex).set(imgURL);
  }

  changeRating() {
    firebase.database().ref(this.pathToReviews).once('value').then((snapshot) => {
      let reviewsArray = snapshot.val();
      let average = this.countAverage(reviewsArray);
      firebase.database().ref(this.pathToDish).update({
        rating: average
      });
      // this.ls.status = false
    })
  }

  countAverage(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum = sum + array[i].rating;
    }
    let average = (sum / array.length).toFixed(1);
    return average;
  }

  sendInfoForSendFile(thet, file, callback) {
    let location;
    let self = this;
    location = 'dishes/' + this.barName + '/' + this.dishName + '/';
    this.sendFile(thet, file, location, this.dishName, callback);
  }

  sendFile(thet, file, location, name, callback) {
    // this.ls.status = true;
    let self = thet;
    let dateString = '' + this.date.getDate() + '.' + this.date.getMonth() + '.' + this.date.getFullYear() + ' ' + this.date.getHours() + ':' + this.date.getMinutes() + ':' + this.date.getSeconds();
    let uploadTask;
    let uploadLocation = 'images/' + location + dateString + '.img';
    uploadTask = firebase.storage().ref().child('images/' + location + name + ' ' + dateString + '.img').put(file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log('Upload is running');
            break;
        }
      }, (error) => {
        console.log(error);
      }, () => {
        callback(uploadTask.snapshot.downloadURL, self);
      });
  }/*
  getMapMarkers() {
    let ref = firebase.database().ref('/data');
    let geoFire = new GeoFire(ref.child('_geofire'));
    let center = [this.lat, this.lng];
    let geoQuery = geoFire.query({
      center: center,
      radius: 1
    });
    console.log(geoQuery);
    for(let i = 0; i < geoQuery.length; i++){
    console.log( geoQuery[i]);
    }
  }*/
}
