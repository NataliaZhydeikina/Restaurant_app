import { Component, NgZone, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from "firebase";

import { InputValidator } from '../../../classes/input-validator';

import { SearchFormService } from '../../../services/search-form/search-form.service';
import { DatabaseService } from '../../../services/database/database.service';
import { LoaderService } from '../../../services/loader/loader.service';
import { ShareService } from '../../../services/share/share.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  providers: [SearchFormService],
  styleUrls: ['./search-form.component.scss']
})

export class SearchFormComponent {
  form: FormGroup;
  array: any = [];
  dishesNames: any;
  inputText = this.ss.dish;
  indexes: any;
  forReload: boolean = false;

  @Output() reload: EventEmitter<any> = new EventEmitter();

  constructor(private ss: ShareService, private ls: LoaderService, private ds: DatabaseService, private fb: FormBuilder, private router: Router, private sfs: SearchFormService, private zone: NgZone) {

    this.form = fb.group({
      desiredDish: ['', Validators.compose([Validators.required, InputValidator.validateDesiredDish])],
      location: ['', Validators.compose([Validators.required])]
    });
    if (this.ss.dishesNamesArr.length == 0 && this.ss.indexes == 0) {
      this.getElements();
    } else {
      this.dishesNames = this.ss.dishesNamesArr;
      this.indexes = this.ss.indexes;
    }
  }
  getElements() {
    this.sfs.getDishes(this, this.func);
  }
  func(object1, object2, self) {
    self.ss.dishesNamesArr = object1;
    self.ss.indexes = object2;
    self.dishesNames = object1;
    self.indexes = object2;
    self.ds.getItems();
    if(self.forReload) {
      self.reload.emit('some');
    }
  }

  public address: string = this.ss.adress;

  getAddress(place: Object) {
    if (!place['geometry'] && !this.inputText) return;
    if (this.router.url == '/list') {
      this.routTo();
    }
    this.address = place['formatted_address'];
    let location = place['geometry']['location'];
    this.zone.run(() => {
      this.ls.status = true;
      this.ls.opacity = true;
    })
    this.ds.lat = location.lat();
    this.ds.lng = location.lng();
    this.ss.adress = this.address;
    this.getElements();
    this.forReload = true;
  }

  getDish(name: string): void {
    this.inputText = name;
  }
  routTo() {
    if (this.router.url == '/list') {
      this.ds.getItems();
    }
    if (!this.inputText) return;
    let array = [];
    let itemsNameArray = [];
    let dishName = this.inputText.toLowerCase();
    for (let i = 0; i < this.indexes.length; i++) {
      if (this.indexes[i].dishName.toLowerCase().indexOf(dishName) != -1) {
        array.push(this.indexes[i]);
      }

    }
    this.ss.dish = this.inputText;
    this.ds.searchArray = array;
    this.router.navigateByUrl('/list');
  }
}
