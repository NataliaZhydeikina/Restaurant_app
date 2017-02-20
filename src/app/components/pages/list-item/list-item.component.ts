import { Directive, Component, OnInit, NgZone } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { RatingModule } from "ng2-rating";

import { ListReviewsComponent } from '../list-reviews/list-reviews.component'

import { AuthService } from '../../../services/auth/auth.service';
import { DatabaseService } from '../../../services/database/database.service';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {

  isClassVisible: false;
  errorMessage: string;
  items: any;
  photos: any;
  public isRequesting: boolean;


  ngOnInit() {
  }
  constructor(private router: Router, private as: AuthService,
    private ds: DatabaseService, private zone: NgZone) {
      this.items = this.ds.getItems();
    }
  some() {
    this.zone.run(()=> {
      this.items = this.ds.getItems();
    })
  }

  addClass(thisItem, allItems) {
    if (thisItem.open == false) {
      for (let i = 0; i < allItems.length; i++) {
        allItems[i].open = false;
      }
      thisItem.open = true;
    } else {
      thisItem.open = false;
    }
  }
  redirectTo(item) {
    let reviewIndex;
    let foodPhotoIndex;
    if (this.as.checkAuth()) {
      if (!item.reviews) {
        reviewIndex = 0;
      } else {
        reviewIndex = item.reviews.length;
      };
      if (!item.photo) {
        foodPhotoIndex = 0;
      } else {
        foodPhotoIndex = item.photo.length;
      };
      this.ds.pushInfo(item.uid, item.index, reviewIndex, item.place, item.name, foodPhotoIndex);
      this.router.navigateByUrl('/write-review')
    } else {
      this.router.navigateByUrl('/login');
    }
  }
  routToItemPage(item) {
    this.ds.itemForItemPage = item;
    this.router.navigateByUrl('/item');
  }
  mapNavigation(item) {
    this.ds.itemLoc = item.location;
    this.ds.itemForMap = item;
    this.ds.forNav = true;
    this.router.navigateByUrl('/map');
  }
}
