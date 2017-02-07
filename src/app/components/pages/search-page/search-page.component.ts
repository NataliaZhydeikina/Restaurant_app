import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { DatabaseService } from '../../../services/database/database.service';
import { ShareService } from '../../../services/share/share.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

  constructor(private ss: ShareService, private router: Router, private ds: DatabaseService) {
    this.ds.onMain = true;
  }

  ngOnInit() {
  }
  routToList(dish, indexes) {
    if(!dish) return;
    let array = [];
    let itemsNameArray = [];
    let dishName = dish.toLowerCase();
    for(let i = 0; i < indexes.length; i++) {
      if (indexes[i].dishName.toLowerCase().indexOf(dishName) != -1) {
        array.push(indexes[i]);
      }
      
    }
    this.ss.dish = dish;
    this.ds.searchArray = array;
    this.router.navigateByUrl('/list');
  }

}
