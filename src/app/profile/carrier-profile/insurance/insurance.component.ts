
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { SharedService } from 'src/app/commons/service/shared.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { PopupComponent } from 'src/app/shared/popup/popup.component';


@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent implements OnInit {
  public skeletonLoader:boolean=false;
  public insurenceList:any=[];
  public countryList:any=[];
  public countryFlag:any;
  public message:any;
  public showCountryCode:any;
  public loading:boolean=false;
  constructor(
    public dialog: MatDialog,
    private commonService:CommonService,
    public sharedService:SharedService,
    public alertService: AlertService,private formBuilder: FormBuilder


  ) {}

  ngOnInit(): void {
    this.skeletonLoader=true
    let configValue = this.sharedService.getConfig();
    if (configValue !== undefined) {
      this.getConfigSet(configValue);
    }
    this.commonService.configData.subscribe((userData) => {
      this.getConfigSet(userData);
    });
    this.getCarrierInsurece()   
  }

  userPopup(type: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: "460px",
      data: { openPop: type },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "Ok") {
        this.getCarrierInsurece()
      }
    });
  }

  getConfigSet(configValue: any) {
    this.countryList = configValue.countryArrayObject;
  }

  deleteInsurence(insuranceID:any,type: any,index:any) {
      const dialogRef = this.dialog.open(PopupComponent, {
        disableClose: true,
      backdropClass: 'cn_custom_popup',
        width: "460px",
        data: { openPop: type },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.event === "ok") {
          this.removeInsurence(insuranceID,index)
      }
      });
    }

  editInsurence(insuranceData:any,type:any){
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: "460px",
      data: {
        insuranceType : insuranceData?.insuranceTypeIdName?.insuranceTypeId,
        policyNumber : insuranceData?.policyNumber,
        effectiveDate : insuranceData?.effectiveDate,
        expiryDate : insuranceData?.expiryDate,
        policyLimit : insuranceData?.policyLimit,
        phone : insuranceData?.phone,
        insuranceCompanyName : insuranceData?.insuranceCompanyName,
        countryCodeIC : insuranceData?.countryCode,
        address : insuranceData?.address,
        insuranceId:insuranceData.id,
        openPop: type },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "Ok") {
        this.getCarrierInsurece()
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

  getCarrierInsurece(){
    this.skeletonLoader=true
    let uri = null;
    let newParams = {
      'carrierId':localStorage.getItem('carrierID')
    };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.INSURENCE.GET,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.insurenceList = ServerRes.response;
        this.insurenceList.forEach(element => {
          this.selecteCountryFlag(element?.countryCode)
        });
        this.skeletonLoader=false;
      }else{
        this.insurenceList= [];
        this.skeletonLoader=false;
      }
    },(error) => {
      this.message=error.error.message
      this.insurenceList = [];
      this.skeletonLoader=false;
    });
  }

  removeInsurence(insuranceId,index){
    this.loading=true;
    let uri =null;
    let newParams = {
      'insuranceId' : insuranceId
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.INSURENCE.DELETE,
      uri: uri,
    };
    this.commonService.delete(APIparams).subscribe(
      (success) => {
        if (success.success === true) {
          this.loading=false;
          this.insurenceList.splice(index,1);
          this.getCarrierInsurece();
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            'Insurence',
            'You have successfully removed carrier insurence.'
          );

         
        } else if (success.success === false) {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_d',
            'cancel',
            'Insurence',
            'There is some issue, Please try again'
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
        this.loading=false;
      }
    );
  }

  selecteCountryFlag(event: any) {
    const getRecord = this.countryList?.filter((item) => item.code == event);
    if (getRecord) {
      this.countryFlag = getRecord[0]?.flag;
      this.showCountryCode=getRecord[0]?.countryCode;
    }

  }

  isPastDate(expireDate): boolean {
    let currentDate: Date = new Date();
     const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    let todayDate= `${year}-${month}-${day}`;
    return expireDate < todayDate;
  }
}
