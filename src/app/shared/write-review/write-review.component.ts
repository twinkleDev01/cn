import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../commons/service/alert.service';
import { AppSettings } from '../../commons/setting/app_setting';
import { CommonService } from '../../commons/service/common.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.component.html',
  styleUrls: ['./write-review.component.css']
})
export class WriteReviewComponent implements OnInit {
  public matSelect =false;
  public srcPrtBox="";
  public emtpyData=false;
  public loaderSearch :boolean = false;
  public cityData : any = [];
  public carrierData : any = [];
  public reviewData: any;
  public skeletonLoader = false;
  public loading =false;
  private searchSubject: Subject<string> = new Subject();
  public cancelRequestUser: any = null;


  constructor( 
    public alertService: AlertService,
    private commonService: CommonService,) { 
      this.searchSubject.pipe(
        debounceTime(2000),
        distinctUntilChanged()
      ).subscribe(value => {
        // Call your search function here
        this.searchRecord(value);
      });
    }

  ngOnInit(): void {
    this.skeletonLoader =true;

  }
  submitReview({value ,valid}){
    if(valid){
    
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.REVIEW.REVIEWADD,
        uri: '',
        postBody: value,
        
      };
      this.commonService.put(APIparams).subscribe(
        (success) => {
          // this.loading=false;
          if (success.success === true) {
            this.alertService.showNotificationMessage(
              'success',
              'bottom',
              'left',
              'txt_s',
              'check_circle',
              'User Business',
              'You have successfully updated user business information.'
            );
          } else if (success.success === false) {

            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'User Business',
              'You have not successfully updated user business information.'
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
        }
      );
    }

  }

  searchUserType(event: any) {
    if (this.cancelRequestUser) {
      this.cancelRequestUser.unsubscribe();
    }
    this.matSelect=true
    this.srcPrtBox ="active_src_rslt";
    this.emtpyData=false;
    this.loaderSearch=true;
    let searchStr = event.key;
    if(searchStr.length > 0){
      this.searchSubject.next(searchStr);

    }else{
      // this.searchRecord(null);
      this.loaderSearch=false;
      this.cityData = [];
      this.carrierData = []
    }
  }

  getAPIInParam(searchStr) {
    let APIparams, params;
    if (searchStr) params = { search: searchStr };
    else params = {  };
    APIparams = {
      apiKey: AppSettings.APIsNameArray.EXTERNAL.CARRIERSEARCH,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }
  
  searchRecord(searchStr:any){
      var APIparams = this.getAPIInParam(searchStr);
      this.commonService.getList(APIparams).subscribe((ServerRes) => {
        this.loaderSearch = false;
        this.emtpyData=true;
        this.reviewData = ServerRes.response;
      });
  }

}
