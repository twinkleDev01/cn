import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService } from 'src/app/commons/service/shared.service';
import { DotNumberPopupComponent } from 'src/app/shared/dot-number-popup/dot-number-popup.component';
import { AlertService } from '../../commons/service/alert.service';
import { CommonService } from '../../commons/service/common.service';
import { AppSettings } from '../../commons/setting/app_setting';

@Component({
  selector: 'app-broker-profil-claim',
  templateUrl: './broker-profile-claim.component.html',
  styleUrls: ['./broker-profile-claim.component.css']
})

export class BrokerProfileClaim implements OnInit {
  public skeletonLoader = false;
  public spinnerLoader = false;
  public userSearchRecord : any ;
 public averageRating:any;

  public matSelect=true
  public srcPrtBox ="active_src_rslt";
  public emtpyData=false;
  public loaderSearch=true;
  // public carrierData:any;
  public userNotFound=false;
  public dotNumber:any;
  public cancelRequestUser: any = null;
  public premium:any
  private searchSubject: Subject<string> = new Subject();
 public errorMesage:any;


  constructor(
    private commonService: CommonService,
    private router: Router,
    public alertService: AlertService,
    private route: ActivatedRoute,
    public dialog: MatDialog){
      this.searchSubject.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe(value => {
        // Call your search function here
        this.searchRecord(value);
      });
        }

  ngOnInit(): void {
    // this.premium =this.route.snapshot.routeConfig['path'].slice(22, 29);
    // if(this.route.snapshot.routeConfig['path'].slice(22, 29) =='premium'){
    //   localStorage.setItem('isPremium',this.premium)
    // }
    if(localStorage.getItem('login_type') == 'after_login'){
      this.skeletonLoader = true;
    }
  }
   
  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  searchUserType(event: any) {
     this.spinnerLoader=true;
    if (this.cancelRequestUser) {
      this.cancelRequestUser.unsubscribe();
    }
    this.userSearchRecord=[];
    this.matSelect=true
    this.srcPrtBox ="active_src_rslt";
    this.emtpyData=false;
    let searchStr = event.target.value;
    this.dotNumber=event.target.value;
    if(searchStr && searchStr.length >= 2){
      this.errorMesage=null
      this.searchSubject.next(searchStr);
    }else{
      this.errorMesage='The minimum length should be 2 characters'
      this.spinnerLoader=false;
      this.userSearchRecord = [];
    }
  }

  getAPIInParam(searchStr) {
    let APIparams, params;
    if (searchStr) params = { search: searchStr };
    else params = {  };
    APIparams = {
      apiKey: AppSettings.APIsNameArray.EXTERNAL.BROKERSEARCHDOT,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }
  
  searchRecord(searchStr:any){
      this.spinnerLoader=true;
      var APIparams = this.getAPIInParam(searchStr);
      this.cancelRequestUser=this.commonService.getList(APIparams).subscribe((ServerRes) => {
        this.spinnerLoader=false;
        if(ServerRes.success==true){
          this.loaderSearch = false;
          if(ServerRes.response.brokerData.length > 0){
            this.userNotFound=false;
            this.userSearchRecord = ServerRes.response.brokerData;
            for(let data of this.userSearchRecord){
              this.averageRating = Math.round(data.averageRating)
            }            
          }else{
            this.userNotFound=true;
            this.userSearchRecord = ServerRes.response.brokerData;
          }
        }else{
          this.userNotFound=false;
          this.userSearchRecord = [];
        }
      });
  }

  requestAddDotNumber(userSearchRecord) {
    const dialogRef = this.dialog.open(DotNumberPopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: { openPop: 'requestDot',dotNumber : this.dotNumber},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event=='ok') {

      }
    });
  }
 brokerSignUp(dotNumber:any){
    this.router.navigateByUrl('/broker-sign-up?dotNumber='+dotNumber);
  }
}

