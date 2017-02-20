import { Component, OnInit, Input, NgZone} from '@angular/core';

import { DatabaseService } from '../../../services/database/database.service';

@Component({
  selector: 'app-list-reviews',
  templateUrl: './list-reviews.component.html',
  styleUrls: ['./list-reviews.component.scss']
})

export class ListReviewsComponent implements OnInit{

  errorMessage: string;
  reviews: any;
  openAll: boolean = false;
  noReviews: boolean = true;
  moreReviews: any = 0;
  reviewsToShow: any = 2;
  @Input('reviews') allReviews;
  
  constructor (private ds: DatabaseService, private zone: NgZone) {
  }

  ngOnInit() { this.getReviews(); }

  getReviews() {
      let reviews = this.allReviews;
      if(reviews != undefined && this.openAll == false && reviews.length >= 2 ) {
        this.reviews = reviews.slice(0, this.reviewsToShow);
        this.countReviews(reviews.length, this.reviewsToShow)
      } else {
        this.noReviews = false;
        this.reviews = reviews;
      }
      
  }

  countReviews(allReviews, shownReviews) {
    if(allReviews - shownReviews >= 5) {
      this.reviewsToShow += 5;
      this.moreReviews = 5
    } else {
      this.reviewsToShow += allReviews - shownReviews;
      this.moreReviews = allReviews - shownReviews;
    }
    if (allReviews - shownReviews == 0) {
      this.noReviews = false;
      this.openAll = true;
    }
    
  }

  addClass(allReviews) {
    this.zone.run(()=> {
      this.getReviews();
    })
  }
}
