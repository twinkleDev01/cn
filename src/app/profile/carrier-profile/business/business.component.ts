import { Component, OnInit,ChangeDetectorRef,AfterContentChecked } from '@angular/core';
import { FormGroup, Validators, FormBuilder,FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionPopupComponent } from 'src/app/shared/subscription-popup/subscription-popup.component';
import { CommonService } from 'src/app/commons/service/common.service';
import { AlertService } from 'src/app/commons/service/alert.service';
import { StatusSetting } from 'src/app/commons/setting/status_setting';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { PopupComponent } from 'src/app/shared/popup/popup.component';
@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})

export class BusinessComponent implements OnInit {
  public businessEdit : FormGroup;
  public targetJobMarket : any = [];
  public availability : any = [];
  public carrierOperation : any = [];
  public shipmentType :  any = [];
  public equipmentType : any = [];
  public fuelConsump : any = [];
  public getUserData : any;
  public electronicValue : any= [];
  public equipmentTypeId :any =[];
  public equipmentTypeName :any =[];
  public loading = false;
  public fuelData : any = {};
  public skeletonLoader=false;
  public checkPlan = false;
  public profileImage: any;
  public information:any;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    public alertService: AlertService,
    public dialog: MatDialog,
   ){}

  ngOnInit(): void {
    this.targetJobMarket = StatusSetting.targetJobMarket;
    this.availability = StatusSetting.availability;
    this.carrierOperation = StatusSetting.carrierOperation;
    this.shipmentType = StatusSetting.shipmentType;
    this.equipmentType = StatusSetting.equipmentType;
    this.fuelConsump = StatusSetting.fuelConsump;
    this.information=StatusSetting.information;
    
    this.businessEdit = this.formBuilder.group({
      driversNumbers: ['', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,3})?$'),
      Validators.maxLength(8),]],
      trucksNumbers: ['', [Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,3})?$'),
      Validators.minLength(8),
      Validators.maxLength(8),]],
      electronicTracking: ['', [Validators.required]],
      providerDetails: ['', Validators.maxLength(64),],
      equipmentType: ['',[Validators.required]],      
      targetJobMarket: ['', ],
      availability: ['', ],
      shipmentTypes: ['',],
      fuelType:['',],
      ratePerMiles:['',],
    });
    if(localStorage.getItem("access_token")){
      this.skeletonLoader=true;
      this.getUserProfile();
    }
  }

 

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  getUserProfile() {
    this.skeletonLoader=true
    let uri = null;
    let newParams = {};
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.USER.GET,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      
      if (ServerRes.success === true) {
        this.getUserData = ServerRes.response;       
        if (this.getUserData && this.getUserData.subscriptionPlanType =='1' ) {
          this.checkPlan=true;
        } else {
          this.checkPlan=false;
        }
        this.skeletonLoader=false;
        this.electronicChang(this.getUserData.electronicTracking);

        if(this.getUserData && this.getUserData.equipmentType.length > 0){
          this.getUserData.equipmentType.forEach(element => {
           this.equipmentTypeId.push(element.equipmentId.toString());  
           this.equipmentTypeName.push(element.equipmentName);   
          });  
        }
        this.getValueForm();
        this.equipmentTypeName = this.equipmentTypeName.toString(); 
         this.equipmentTypeName = this.equipmentTypeName.split(',');
    this.equipmentTypeName = this.equipmentTypeName.map(state => state.trim());
    if(this.equipmentTypeName[0]==""){
      this.equipmentTypeName=[]

    }

        if(this.getUserData && this.getUserData.fuel && this.getUserData.fuel.length > 0){
          this.alredyFuel();
        }
      }
    });
  }

  alredyFuel() {
    for (let v = 0; v < this.fuelConsump.length; v++) {
        for (let j = 0; j < this.getUserData.fuel.length; j++) {
          if (this.getUserData.fuel[j].fuelId == this.fuelConsump[v].fuelId) {
            this.fuelConsump[v].Ischecked = true;
            this.fuelConsump[v].ratePerMiles = this.getUserData.fuel[j].fuelPerMilesRate;
            break;
          } else {
            this.fuelConsump[v].Ischecked = false;
          }
        }
    }
    this.fuelConsump = this.fuelConsump;
  }

  getValueForm(){
    this.businessEdit = this.formBuilder.group({
      driversNumbers: [this.getUserData.driversNumbers, [Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,3})?$')]],
      trucksNumbers: [this.getUserData.trucksNumbers, [Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,3})?$')]],
      electronicTracking: [this.getUserData.electronicTracking ? this.getUserData.electronicTracking : false, [Validators.required]],
      providerDetails: [this.getUserData.providerDetails,],
      equipmentType: [this.equipmentTypeId, [Validators.required]],
      targetJobMarket: [this.getUserData.targetJobMarket ? this.getUserData.targetJobMarket.id : '', this.checkPlan
      ? []
      : [Validators.required]],
      availability: [this.getUserData.availability ? this.getUserData.availability.id : '', this.checkPlan
      ? []
      : [Validators.required]],
      shipmentTypes: [this.getUserData.shipmentTypes ? this.getUserData.shipmentTypes.id : '', this.checkPlan
      ? []
      : [Validators.required]],
      fuelType:['',],
      ratePerMiles:['',],
    });
  }

  electronicChange($event){
    this.electronicValue=$event.value;
    this.checkValidation($event.value); 
  }

  electronicChang(value:any){
    this.electronicValue=value;
    this.checkValidation(value);
  }
  checkValidation(value:any){
    if(value==true){
      this.businessEdit.get('providerDetails').setValidators([Validators.required]);
      this.businessEdit.get('providerDetails').updateValueAndValidity();
    }else{
      this.businessEdit.get('providerDetails').clearValidators();
      this.businessEdit.get('providerDetails').setValue('');
    }    
  }

  equipmentTypeSelect(event){
    this.equipmentTypeName = event.source.triggerValue;
      this.equipmentTypeName = this.equipmentTypeName.split(',');
    this.equipmentTypeName = this.equipmentTypeName.map(state => state.trim());
    if(this.equipmentTypeName[0]==""){
      this.equipmentTypeName=[]
    }
  }

  fuleComsuption(id: any, checked: any) {
    for (let v = 0; v < this.fuelConsump.length; v++) {
      if (this.fuelConsump[v].fuelId == id && checked ==true) {
        this.fuelConsump[v].Ischecked = true;
        break;
      } else if (this.fuelConsump[v].fuelId == id && checked==false) {
        this.fuelConsump[v].Ischecked = false;
      }
    }
    this.fuelConsump=this.fuelConsump;
  }

  profileUpdate({ value, valid }) {   
      if (valid) {
      this.loading=true;
      if(value && value.equipmentType.length > 0){
        value.equipmentType=value.equipmentType.toString(',');
      }
      let fuelData=[];
   
     for (let v = 0; v < this.fuelConsump.length; v++) {
        if(this.fuelConsump[v].Ischecked==true){
                  if(this.fuelConsump[v].ratePerMiles !== '' && this.fuelConsump[v].ratePerMiles > 0) {
            fuelData.push({fuelId:this.fuelConsump[v].fuelId,fuelPerMilesRate:this.fuelConsump[v].ratePerMiles,})
          }
        }
      }    
      if(fuelData.length>0){
        value.fuel = fuelData;
      }
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.USER.UPDATE,
        uri: '',
        postBody: value,
      };
      this.commonService.put(APIparams).subscribe(
        (success) => {
          this.loading=false;
          if (success.success === true) {
            this.alertService.showNotificationMessage(
              'success',
              'bottom',
              'left',
              'txt_s',
              'check_circle',
              'Business Information',
              'You have successfully updated business information.'
            );
          } else if (success.success === false) {

            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'Business Information',
              'You have not successfully updated business information.'
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
}

onlyNumberKey(event) {
   // If the input value is empty and the user is trying to input 0 as first letter 
  if (event.target.value === '' && event.charCode === 48) {
    event.preventDefault();
    return false;
  }
  // Only allow digits
  return (event.charCode == 8 || event.charCode == 0) ? null :  event.charCode >= 48 && event.charCode <= 57;
}

subsciptionPlanCheck(){
 if(this.checkPlan){
  this.subscriptionUpgrade();
 }
}

subscriptionUpgrade(){
  const dialogRef = this.dialog.open(SubscriptionPopupComponent, {
    disableClose: true,
    backdropClass: 'cn_custom_popup',
    width: '1000px',
    data: { openPop: 'freePlan', type:'checkPremium'},
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result.event === 'ok') {
    }
  });
 }

updateProfileImage(type) {
  const dialogRef = this.dialog.open(PopupComponent, {
    disableClose: true,
    backdropClass: 'cn_custom_popup',
    width: "670px",
    data: { openPop: type },
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result.event === "ok") {
      this.getUserProfile();
    }
  });
}
}
