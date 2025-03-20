//changed the api CARRIERBROKERREVIEWLIST
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { SharedService } from 'src/app/commons/service/shared.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { PopupComponent } from 'src/app/shared/popup/popup.component';
import { SubscriptionPopupComponent } from 'src/app/shared/subscription-popup/subscription-popup.component';
@Component({
  selector: 'app-manage-review',
  templateUrl: './manage-review.component.html',
  styleUrls: ['./manage-review.component.css']
})
export class ManageReviewComponent implements OnInit {
  public reviewList: any = [];
  public params: any = {};
  public noData: boolean;
  showAll: boolean[] = [];
  public showSummeryInfo: boolean[] = [];
  public loading = false;
  public skeletonLoader = false;
  keyPointCtrl = new FormControl();
  filteredkeyPoints: Observable<string[]>;
  keyPoints: string[] = ['On Time Delivery'];
  allkeyPoints: string[] = ['On Time Delivery', 'Consistent Tracking', 'Easy to Work With'];

  @ViewChild('keyPointInput') keyPointInput: ElementRef<HTMLInputElement>;
  public getTotalHeight: any;
  public sortingValue = 'ratingHighToLow';
  public sortingValueNew = 'newest';
  public queryParamClearFilter;
  public orderDir = 'ratingHighToLow';
  public newOld = 'newest'

  public page = 1;
  public totalPage = 1;
  public totalRecords: any;
  public spinnerLoader = false;
  public dataNotFound = false;
  public totallReview: any;
  public message: any;

  constructor(private commonService: CommonService,
    private router: Router,
    public alertService: AlertService,
    private route: ActivatedRoute,
    public sharedService: SharedService,
    public dialog: MatDialog,) {
    this.filteredkeyPoints = this.keyPointCtrl.valueChanges.pipe(
      startWith(null),
      map((keyPoint: string | null) => (keyPoint ? this._filter(keyPoint) : this.allkeyPoints.slice())),
    );
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    

    this.getTotalHeight = window.innerHeight + window.scrollY;
    if (
      $(window).scrollTop() + 1 >=
      $(document).height() - $(window).height()
    ) {
      if (
        this.page !== this.totalPage &&
        this.page >= 1 &&
        this.totalPage &&
        this.reviewList.length > 0
      ) {
        this.page = this.page + 1;
        this.spinnerLoader = true;
        this.dataNotFound = false;
        this.getMoreData(null);
      

      } else if (this.spinnerLoader === false) {
        this.dataNotFound = true;
      }
    }
  }

  ngOnInit(): void {
    this.showAll = this.showAll.map(value => !value);
    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length === 0) {
        let queryPa = { sort: 'ratingHighToLow' };
        this.queryParamClearFilter = queryPa;
        this.sortingValue = 'ratingHighToLow';
        this.sortingValueNew = 'newest'
      }
    });
    this.skeletonLoader = true;
    this.getReviewList();

  }
  addToFavoritesPopup(type, reviewId: any, isFeatured: string) {
    let planType = localStorage.getItem('subscriptionPlanType')

    if (planType === '1') {
      this.subscriptionUpgrade();
    }
    else {
      const dialogRef = this.dialog.open(PopupComponent, {
        disableClose: true,
        backdropClass: 'cn_custom_popup',
        width: "460px",
        data: { openPop: type },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.event === "ok") {
          if (isFeatured === "true") {
            this.addToFavorites(reviewId, isFeatured);
            // this.getReviewList();
          } else {

            this.removeFromFavorites(reviewId, isFeatured)
            // this.getReviewList();

          }

        }
      });
    }
  }
  addToFavorites(reviewId: any, isFeatured: any) {

    if (reviewId) {
      this.loading = true;
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.REVIEW.FEATUREDREVIEW,
        uri: '',
        postBody: {
          "reviewId": reviewId,
          "isFeatured": isFeatured
        },
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {

          if (success.success === true) {
            this.loading = false;
            this.page = 1;
            this.reviewList = [];

            this.getReviewList();
            this.alertService.showNotificationMessage(
              'success',
              'bottom',
              'left',
              'txt_s',
              'check_circle',
              'User Profile',
              'You have successfully made this review your featured review.'
            );
          } else if (success.success === false) {
            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'User Profile',
              'You have not successfully made this review your featured review'
            );
          }
        },
        (error) => {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_g',
            'error',
            'Unexpected Error',
            AppSettings.ERROR
          );
          this.loading = false;
        }
      );
    }
  }

  removeFromFavorites(reviewId: any, isFeatured: any) {
    if (reviewId) {
      this.loading = true;
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.REVIEW.FEATUREDREVIEW,
        uri: '',
        postBody: {
          "reviewId": reviewId,
          "isFeatured": isFeatured
        },
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {

          if (success.success === true) {
            this.loading = false;

            this.page = 1;
            this.reviewList = [];

            this.getReviewList();
            this.alertService.showNotificationMessage(
              'success',
              'bottom',
              'left',
              'txt_s',
              'check_circle',
              'User Profile',
              'You have successfully removed this review from your featured reviews.'
            );
          } else if (success.success === false) {
            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'User Profile',
              'You have not successfully removed this review from your featured reviews.'
            );
          }
        },
        (error) => {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_g',
            'error',
            'Unexpected Error',
            AppSettings.ERROR
          );
          this.loading = false;
        }
      );
    }
  }

  getReviewList() {
    this.skeletonLoader = true;
    let uri = null;
    this.orderDir = this.sortingValue;
    this.newOld = this.sortingValueNew
    let APIparams, params; 
    
    if(localStorage.getItem('user_type') == 'BROKER'){
      params = { limit: 5, page: this.page,brokerId : localStorage.getItem('BrokerID')};
      (this.params.limit = 5), (this.params.page = this.page), (this.params.sort = this.orderDir), (this.params.brokerId = localStorage.getItem('BrokerID') );
  
    }
    if(localStorage.getItem('user_type') == 'CARRIER'){
      params = { limit: 5, page: this.page,carrierId : localStorage.getItem('carrierID')};
      (this.params.limit = 5), (this.params.page = this.page), (this.params.sort = this.orderDir), (this.params.carrierId = localStorage.getItem('carrierID'));
  
    }
  
  
    if (this.params) uri = this.commonService.getAPIUriFromParams(this.params);
    APIparams = {
      apiKey: AppSettings.APIsNameArray.REVIEW.CARRIERBROKERREVIEWLIST,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        // if (ServerRes.response.review) {
        this.reviewList = ServerRes?.response?.reviews;
        this.totalPage = ServerRes?.response?.totalPages;
        this.totalRecords = ServerRes?.response?.totalReviews;
        this.skeletonLoader = false;
        // } else {
        //   this.reviewList = ServerRes.response;
        //   this.totalPage = 0;
        //   this.skeletonLoader = false;
        // }
      } else {
        this.reviewList = [];
        this.totalPage = 0;
        this.skeletonLoader = false;
      }
    }, (error) => {
      this.message = error.error.message
      this.reviewList = [];

      this.skeletonLoader = false;
    });
  }

  getAPIParam(str) {
    let APIparams, params;

    if(localStorage.getItem('user_type') == 'BROKER'){
    if (str) params = { limit: 5, page: this.page, sort: this.orderDir,brokerId : localStorage.getItem('BrokerID')};
    else params = { limit: 5, page: this.page, sort: this.orderDir,brokerId : localStorage.getItem('BrokerID') };
    params = { limit: 5, page: this.page, sort: this.orderDir,brokerId : localStorage.getItem('BrokerID') };
  
    }
    else if(localStorage.getItem('user_type') == 'CARRIER'){
       
      if (str) params = { limit: 5, page: this.page, sort: this.orderDir,carrierId : localStorage.getItem('carrierID')};
    else params = { limit: 5, page: this.page, sort: this.orderDir,carrierId : localStorage.getItem('carrierID') };
    params = { limit: 5, page: this.page, sort: this.orderDir,carrierId : localStorage.getItem('carrierID') };
    }
   
    let url;
    url = AppSettings.APIsNameArray.REVIEW.CARRIERBROKERREVIEWLIST;
    APIparams = {
      apiKey: url,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }

  getMoreData(str) {
    var APIparams = this.getAPIParam(str);
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      let result = ServerRes.response.review;
     
      this.spinnerLoader = false;
      if (
        ServerRes.response.review &&
        ServerRes.response.review.length > 0
      ) {
        for (let v = 0; v < result.length; v++) {
          if (result[v]) {
            this.reviewList.push(result[v]);
          }

        }

      }

    });
  }

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our keyPoint
    if (value) {
      this.keyPoints.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.keyPointCtrl.setValue(null);
  }

  remove(keyPoint: string): void {
    const index = this.keyPoints.indexOf(keyPoint);

    if (index >= 0) {
      this.keyPoints.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.keyPoints.push(event.option.viewValue);
    this.keyPointInput.nativeElement.value = '';
    this.keyPointCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allkeyPoints.filter(keyPoint => keyPoint.toLowerCase().includes(filterValue));
  }


  sorting(sorting: any) {
    if (sorting && !this.noData) {
      this.sortingValue = sorting;
      this.dataNotFound = false;
      this.page = 1
      this.getReviewList();
    }
  }

  toggleShowAll(index) {
    this.showAll[index] = !this.showAll[index];
  }


  showSummery(type: any, index: any) {
    if (type == 'showSummery') {
      this.showSummeryInfo[index] = true;
    }
    if (type == 'hideSummery') {
      this.showSummeryInfo[index] = false;
    }
  }

  getFullName(firstName, lastName) {
    return firstName.concat(' ' + lastName)
  }

  respondReview(reviewDataReview) {
    localStorage.setItem('userReview', JSON.stringify(reviewDataReview));
    this.router.navigateByUrl('review/manage-my-reviews/respond/' + reviewDataReview?.id)
  }

  subscriptionUpgrade() {
    const dialogRef = this.dialog.open(SubscriptionPopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: '1000px',
      data: { openPop: 'freePlan', type: 'checkPremium' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'ok') {
      }
    });
  }

}
