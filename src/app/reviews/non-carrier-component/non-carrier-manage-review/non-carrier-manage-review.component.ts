//changeed the api CARRIERBROKERREVIEWLIST
// did the configuration for broker
import {Component, ElementRef, ViewChild,OnInit,HostListener} from '@angular/core';
import { FormControl } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog,MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PopupComponent } from 'src/app/shared/popup/popup.component';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/commons/service/common.service';
import { AlertService } from 'src/app/commons/service/alert.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';

@Component({
  selector: 'app-non-carrier-manage-review',
  templateUrl: './non-carrier-manage-review.component.html',
  styleUrls: ['./non-carrier-manage-review.component.css']
})
export class NonCarrierManageReviewComponent implements OnInit {
  public reviewList : any = [];
  public carrierId:any
  public averageRating:any;
  public laneLoadMore:any=5
  public skeletonLoader=false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keyPointCtrl = new FormControl();
  filteredkeyPoints: Observable<string[]>;
  keyPoints: string[] = ['On Time Delivery'];
  allkeyPoints: string[] = ['On Time Delivery', 'Consistent Tracking', 'Easy to Work With'];
  showAll: boolean[] = []
  public showSummeryInfo:boolean[]=[];

  @ViewChild('keyPointInput') keyPointInput: ElementRef<HTMLInputElement>;
  public getTotalHeight: any;
  public loading:boolean=false
  public page = 1;
  public editReviewId:any;
  public totalPage = 1;
  public totalRecords:any;
  public spinnerLoader = false;
  public dataNotFound = false;
  public totallReview:any;
  constructor(private commonService: CommonService,
    private router: Router,
    public alertService: AlertService,
    private route: ActivatedRoute,
    public dialog: MatDialog,) {this.filteredkeyPoints = this.keyPointCtrl.valueChanges.pipe(
    startWith(null),
    map((keyPoint: string | null) => (keyPoint ? this._filter(keyPoint) : this.allkeyPoints.slice())),
  ); }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    this.getTotalHeight = window.innerHeight + window.scrollY;
    if ($(window).scrollTop() + 1 >=$(document).height() - $(window).height()) {
      if (this.page !== this.totalPage && this.page >= 1 && this.totalPage && this.reviewList.length > 0) {
        this.page = this.page + 1;
        this.spinnerLoader = true;
        this.dataNotFound = false;
        this.getMoreData();
      } else if (this.spinnerLoader === false) {
        this.dataNotFound = true;
      }
    }
  }

  ngOnInit(): void {
    this.showAll = this.showAll.map(value => !value);

    if(localStorage.getItem("access_token")){
      this.skeletonLoader=true;
      this.getReviewList();
    }
  }

  getReviewList() {
    this.skeletonLoader=true
    this.page=1
    let uri = null;
    let APIparams, params;
    params = { limit: 5, page: 1,};
    if (params) uri = this.commonService.getAPIUriFromParams(params);
    APIparams = {
      apiKey: AppSettings.APIsNameArray.REVIEW.CARRIERBROKERREVIEWLIST,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        if(ServerRes.response.reviews){
          this.reviewList = ServerRes.response.reviews;
          // this.averageRating = ServerRes.response.review.carrier.averageRating
          this.totalPage = ServerRes.response.totalPages;
          this.totalRecords = ServerRes.response.totalReviews;
          for(let data of this.reviewList){
            if(data?.carrier){
              this.averageRating = Math.round(data.carrier.averageRating)
            } else if(data?.broker)
              this.averageRating = Math.round(data.broker.averageRating)
            
          }
          for(let v=0; v < this.reviewList.lane?.length; v++){
            if (this.reviewList.lane[v].length > 4) {
              this.laneLoadMore=this.reviewList.lane?.length;
            } else {
              this.laneLoadMore=5;
            }
          }
         
          
          this.skeletonLoader=false;
        }else{
          this.reviewList = ServerRes.response;
          this.totalPage = 0;
          this.skeletonLoader=false;
        }
      }else{
        this.reviewList = []
        this.totalPage = 0;
        this.skeletonLoader=false;
      }    
    });
  }

  getAPIParam() {
    let APIparams, params;
    params = { limit: 3, page: this.page,};
    let url;
    url = AppSettings.APIsNameArray.REVIEW.CARRIERBROKERREVIEWLIST;
    APIparams = {
      apiKey: url,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }

  getMoreData() {
    var APIparams = this.getAPIParam();
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      let result = ServerRes.response.reviews;
      this.spinnerLoader = false;
      if (
        ServerRes.response.reviews &&
        ServerRes.response.reviews.length > 0
      ) {
        for (let v = 0; v < result.length; v++) {
          if (result[v]) this.reviewList.push(result[v]);
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

  
  editReview(editReviewData:any,dotNumber:any){
    localStorage.setItem('carrierEditId',editReviewData?.carrierId)
    this.router.navigateByUrl('/review/edit-a-review-for-carrier' + '/' +dotNumber)
  }

  editReviewForBroker(editReviewData:any,dotNumber:any){
    localStorage.setItem('carrierEditId',editReviewData?.brokerId)
    this.router.navigateByUrl('/review/edit-a-review-for-broker' + '/' +dotNumber)
  }

  delete(index){
    this.loading=true;
    let uri =null;
    let newParams = {
      id:  this.editReviewId ,
      carrierId : this.carrierId
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.REVIEW.DELETE,
      uri: uri,
    };
    this.commonService.delete(APIparams).subscribe(
      (success) => {
        this.loading=false;
        this.reviewList.splice(index,1);
        if (success.success === true) {
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            'Remove Review',
            'You have successfully removed review.'
          );
          this.page = 1; 
        this.reviewList = []

          this.getReviewList()
         
        } else if (success.success === false) {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_d',
            'cancel',
            'Remove Review',
            'There is some issue, Please try again'
          );
        }
        this.loading=false;

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
        this.loading=false;
      }
    );
  }
  deleteBroker(index){
    this.loading=true;
    let uri =null;
    let newParams = {
      id:  this.editReviewId ,
      brokerId : this.carrierId
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.REVIEW.DELETEBroker,
      uri: uri,
    };
    this.commonService.delete(APIparams).subscribe(
      (success) => {
        this.loading=false;
        this.reviewList.splice(index,1);
        if (success.success === true) {
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            'Remove Review',
            'You have successfully removed review.'
          );
          this.page = 1; 
        this.reviewList = []

          this.getReviewList()
         
        } else if (success.success === false) {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_d',
            'cancel',
            'Remove Review',
            'There is some issue, Please try again'
          );
        }
        this.loading=false;

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
        this.loading=false;
      }
    );
  }


 
  deleteReview(deleteReviewData:any,index:any){
    this.editReviewId = deleteReviewData.id
    this.carrierId=deleteReviewData.carrier.id
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      // backdropClass: AppSettings.backdropClass,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: { openPop: 'reviewConfirmation' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'ok') {
        this.loading=true
        this.delete(index);
      }
     });
  }

  deleteBrokerReview(deleteReviewData:any,index:any){
    this.editReviewId = deleteReviewData.id
    this.carrierId=deleteReviewData.broker.id
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      // backdropClass: AppSettings.backdropClass,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: { openPop: 'reviewConfirmation' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'ok') {
        this.loading=true
        this.deleteBroker(index);
      }
     });
  }
  

  writeReview(){
    this.router.navigate(['profile/write-a-review']);
  }

  loadMore(index) {
    this.laneLoadMore = this.reviewList.lane?.length;
  }

  showLess(index){
    this.laneLoadMore=5;
  }
  toggleShowAll(index) {
    this.showAll[index] = !this.showAll[index];
  }

  redirectPageCarrier(dotNumber:any,companyName:any){
    let newCompanyName = companyName.replace(/\s/g, '-').toLowerCase();
    window.location.href = environment.domain+"/carrier-profile/" + dotNumber +"/"+ newCompanyName + "/#review";
  }


  showSummery(type:any,index:any){
    if(type=='showSummery'){
      this.showSummeryInfo[index]=true;
    }
    if(type=='hideSummery'){
      this.showSummeryInfo[index]=false;
    }
    }

    getRating(rating){
      return  Math.round(rating)

    }
}
