import { Injectable } from '@angular/core';
import * as firebase from "firebase";
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { DatabaseService } from '../database/database.service';
declare let google: any;
@Injectable()
export class MapService {
  public latitude: number = 49.834824499999996;
  public longitude: number = 24.019443199999998;
  
  public Latlng: any = new google.maps.LatLng(this.latitude, this.longitude);
  constructor(private ds: DatabaseService) {
    this.setCurrentPosition();
  }
  setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        if(!this.ds.lat && !this.ds.lng) {
          this.ds.lat = position.coords.latitude;
          this.ds.lng = position.coords.longitude;
        }
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      }, () => {
        console.log('set current error');
      }, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 1000
        });
    }
  }
}
