import { Injectable } from '@angular/core';
import * as firebase from "firebase";
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { DatabaseService } from '../database/database.service';


@Injectable()
export class SearchFormService {

  indexes = [];
  names = [];

  constructor(private ds: DatabaseService) { }

  getDishes(thet, callback) {
    this.names = [];
    this.indexes = [];
    this.ds.getData().then((restaurantsArr) => {
      for (let object in restaurantsArr) {
        if (object != '_geofire') {
          if (restaurantsArr[object]) {
            restaurantsArr[object].dishes.forEach((dishesObj) => {
              this.indexes.push({ placeIndex: restaurantsArr[object].index, dishIndex: dishesObj.index, dishName: dishesObj.name })
              if (this.names.indexOf(dishesObj.name) == -1) {
                this.names.push(dishesObj.name);
              }
            });
          }
        }
      }
      callback(this.names, this.indexes, thet);
    });
  }
}
