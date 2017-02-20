import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DatabaseService } from '../../../services/database/database.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.scss']
})
export class ItemPageComponent implements OnInit {

  item: any

  constructor(private ds: DatabaseService, private as: AuthService, private router: Router) {
    this.item = this.ds.itemForItemPage;
  }

  ngOnInit() {
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
      if(!item.photo) {
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

}
