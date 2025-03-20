import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { Router } from '@angular/router';
import { StatusSetting } from 'src/app/commons/setting/status_setting';
import * as _moment from 'moment';
import { AlertService } from 'src/app/commons/service/alert.service';

@Component({
  selector: 'app-post-truck-availability',
  templateUrl: './post-truck-availability.component.html',
  styleUrls: ['./post-truck-availability.component.scss']
})
export class PostTruckAvailabilityComponent implements OnInit {
  public addAvailabilityForm : FormGroup;
  public skeletonLoader=false;
  public loading = false;
  public submitted = false;
  public shipmentType :  any = [];
  public loaderSearch :boolean = false;
  public emtpyData=false;
  public equipmentType : any = [];
  public equipmentTypeName :any =[];
  public searchStr: any;
  public sourceCityData : any = [];
  public destinationCityData : any = [];
  public minNextDate: Date;
  public minDate: any = Date;
  public destinationSearch = false;
  public sourceLocSearch = false;
  public sourceLoc: any = {};
  public destinyLoc: any = {};
  public information:any;
  public dropTimedisabled = true;
  public errorSource = false;
  public errorDestination = false;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    public alertService: AlertService,
  ) {
      this.minDate = new Date();
      this.minNextDate = null;
   }

  ngOnInit(): void {
    this.shipmentType = StatusSetting.shipmentType;
    this.information=StatusSetting.information;
    this.equipmentType = StatusSetting.equipmentType;
    this.addAvailabilityForm = this.formBuilder.group({
      sourceLocation: ['', [Validators.required, Validators.maxLength(64)]],
      sourceDate: ['', [Validators.required]],
      destinationLocation: ['', [Validators.required, Validators.maxLength(64)]],
      destinationDate: ['',[Validators.required, this.validateDropDate]],      
      shipmentTypes: ['',[Validators.required]],
      equipmentType: ['',[Validators.required]],      
      miles: ['', [Validators.required,Validators.pattern(/^[.\d]+$/)]],
      costPerMile:['',[Validators.required,Validators.pattern(/^[.\d]+$/)]],
      notes:['',Validators.maxLength(516)],
    });
  }

  updateMinNextDate(selectedDate: Date) {
    this.dropTimedisabled = false;
    this.addAvailabilityForm.get('destinationDate').setValue('');
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    this.minNextDate = nextDay;
  }

  addFormSubmit({ value, valid }) {
    this.submitted = true;
    var sourceDate = value.sourceDate;
    var date = new Date(sourceDate);
    var day = date.getDate().toString().padStart(2, '0');
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
    var year = date.getFullYear();
    value.sourceDate = month + '/' + day + '/' + year;
    var destinationDate = value.destinationDate;
    var date = new Date(destinationDate);
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
    var day = date.getDate().toString().padStart(2, '0');
    var year = date.getFullYear();
    value.destinationDate = month + '/' + day + '/' + year;

    value.sourceLocation = this.sourceLoc.id;
    value.destinationLocation = this.destinyLoc.id;
    if (valid) {
      this.loading = true;
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.AVAILIBILITY.ADD,
        uri: '',
        postBody: value,
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {
          this.loading=false;
        if (success.success === true) {
          this.router.navigateByUrl('forecastAvailibilty/manage-availability');
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            'Add Load Availibility',
            'You have successfully Added Load Availibility detials.'
          );
        } else if (success.success === false) {
          this.loading = false;
          this.submitted=false;
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_d',
            'check_circle',
            'Add Load Availibility',
            'You have not successfully added Load Availibility detials.'
          );
        }
      },
      (error) => {
        this.loading = false;
        this.submitted=false;
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
   
    this.loaderSearch=true;
    // this.srcPrtBox ="active_src_rslt";
    this.emtpyData=false;
    this.searchStr = event.target.value;
    if(this.searchStr.length > 0){
      this.sourceLocSearch = true;
      this.searchRecord(this.searchStr);
    }else{
      this.searchRecord(null);
      this.loaderSearch=false;
      this.sourceLocSearch = false;
      this.sourceCityData = [];
    }
  }

  // onlyNumberKey(event) {
  //   return (event.charCode == 8 || event.charCode == 0) ? null :  event.charCode >= 48 && event.charCode <= 57;
  // }

//this fuction allow user to enter only number . and only allow single . 
  onlyNumberKey(event) {
    const charCode = event.charCode || event.keyCode;
      const inputElement = event.target as HTMLInputElement;
    if (charCode === 8 || charCode === 0) { // Allow backspace and null
      return true;
    }
    if (charCode === 46) { // Allow decimal point
      if (inputElement.value.includes('.')) {
        return false;
      }
      return true;
    }
    return charCode >= 48 && charCode <= 57; // Allow numbers
  }
  getAPIInParam(searchStr) {
    let APIparams, params;
    if (searchStr) params = { search: searchStr, onlyCities: true };
    else params = {  };
    APIparams = {
      apiKey: AppSettings.APIsNameArray.USER.SEARCH,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }

    
  searchRecord(searchStr:any){
    var APIparams = this.getAPIInParam(searchStr);
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      this.sourceCityData = ServerRes.response.cityData;
      this.destinationCityData = ServerRes.response.cityData;
      this.loaderSearch = false;
      this.emtpyData=true;
    });
  }

  searchUserTypeForDestination(event: any) {
    this.loaderSearch=true;
    // this.srcPrtBox ="active_src_rslt";
    this.emtpyData=false;
    this.searchStr = event.target.value;
    if(this.searchStr.length > 0){
      this.destinationSearch = true;
      this.searchRecord(this.searchStr);
    }else{
      this.searchRecord(null);
      this.loaderSearch=false;
      this.destinationSearch = false;
      this.destinationCityData = [];
    }
  }

  validateDropDate(control: any) {
    const effectiveDate = new Date(control.parent?.controls?.effectiveDate?.value);
    const expiryDate = new Date(control.value);
    if (expiryDate < effectiveDate) {
      return { 'invalidDropDate': true };
    }
    return null;
  }

  getSourceLoc(sourceLoc: any) {
    this.sourceLoc = {location: sourceLoc?.city+', '+sourceLoc?.state, id: sourceLoc?.id};
    this.sourceLocSearch = false;
  }

  getDestinyLoc(destinyLoc: any) {
    this.destinyLoc = {location: destinyLoc?.city+', '+destinyLoc?.state, id: destinyLoc?.id}; 
    this.destinationSearch = false;
  }

  onBlur(type:any)
  {
    if(type=='source' && this.searchStr && !Object.keys(this.sourceLoc).length)
      {
        this.errorSource = true;
      }
      else 
      {
        this.errorSource = false;
      }
      if(type=='destination' && this.searchStr && !Object.keys(this.destinyLoc).length)
        {
          this.errorDestination = true;
        }
        else 
        {
          this.errorDestination = false;
        }
  }
}
