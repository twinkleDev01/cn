import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { Router } from '@angular/router';
import { StatusSetting } from 'src/app/commons/setting/status_setting';
import * as _moment from 'moment';
import { AlertService } from 'src/app/commons/service/alert.service';
import { Location } from '@angular/common';

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
  weekdays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  AutoCompleteOptions: any[] = [];
  AutoCompleteOptionsDesc: any[] = [];
  filteredOptions:  any[] = [];
  filteredOptionsDestination:  any[] = [];
  dataToEdit:any
  isEdit=false
  rowData:any
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    public alertService: AlertService,
    private cdr:ChangeDetectorRef,
    private location: Location
  ) {
    this.equipmentType = StatusSetting.equipmentType.map(item => ({
      ...item,
      id: Number(item.id)
    }));
      this.minDate = new Date();
      this.minNextDate = null;
      this.addAvailabilityForm = this.formBuilder.group({
        sourceLocation: ['', [Validators.required, Validators.maxLength(64)]],
        destinationLocation: ['', [Validators.required, Validators.maxLength(64)]],
        sourceDate: [''],
        destinationDate: [''],  
        sourceDay: [''],
        destinationDay: [''], 
        sourceTime: [''],
        destinationTime: [''],     
        shipmentTypes: ['',[Validators.required]],
        equipmentType: ['',[Validators.required]],      
        miles: ['', [Validators.required,Validators.pattern(/^[.\d]+$/)]],
        costPerMile:['',[Validators.required,Validators.pattern(/^[.\d]+$/)]],
        notes:['',Validators.maxLength(516)],
        truckName: ['',[Validators.required]],
        frequency: ['',[Validators.required]],
        weight: ['',[Validators.required]],
        length: ['',[Validators.required]],
        loadExpiryDate:['',[Validators.required]]
      });
      
      const navigation = this.router.getCurrentNavigation();
    this.rowData = navigation?.extras?.state?.['data'];// The full row data
    
    console.log(this.rowData ,'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
    if(this.rowData ){
      this.isEdit=true;
      this.addAvailabilityForm.patchValue({
        sourceLocation: `${this.rowData.sourceLocationCity}, ${this.rowData.sourceLocationState}, ${this.rowData.sourceLocationCountry}`,
        destinationLocation: `${this.rowData.destinationLocationCity}, ${this.rowData.destinationLocationState}, ${this.rowData.destinationLocationCountry}`,
        sourceDate: this.rowData.sourceDate, // no value in API
        destinationDate: this.rowData.destinationDate, // no value in API
        sourceDay: this.rowData.sourceDay,
        destinationDay: this.rowData.destinationDay,
        sourceTime: this.rowData.sourceTime,
        destinationTime: this.rowData.destinationTime,
        shipmentTypes: this.rowData.shipmentTypes,
        equipmentType: this.rowData.equipmentType?.[0]?.equipmentTypeId ?? '', // take ID
        miles: this.rowData.miles,
        costPerMile: this.rowData.costPerMile,
        notes: this.rowData.notes,
        truckName: this.rowData.truckName,
        frequency: this.rowData.frequency,
        weight: this.rowData.weight,
        length: this.rowData.length,
        loadExpiryDate: this.rowData.loadExpiryDate
      });
    }
   }

  ngOnInit(): void {
   
    this.shipmentType = StatusSetting.shipmentType;
    this.information=StatusSetting.information;
    
  
    this.addAvailabilityForm.get('frequency')?.valueChanges.subscribe(value => {
      this.setValidatorsBasedOnFrequency(value);
    });
  }

  setValidatorsBasedOnFrequency(frequency: string) {
    const sourceDate = this.addAvailabilityForm.get('sourceDate');
    const destinationDate = this.addAvailabilityForm.get('destinationDate');
    const sourceDay = this.addAvailabilityForm.get('sourceDay');
    const destinationDay = this.addAvailabilityForm.get('destinationDay');
    const sourceTime = this.addAvailabilityForm.get('sourceTime');
    const destinationTime = this.addAvailabilityForm.get('destinationTime');

  
  
    // First clear all validators
    sourceDate?.clearValidators();
    destinationDate?.clearValidators();
    sourceDay?.clearValidators();
    destinationDay?.clearValidators();
    sourceTime?.clearValidators();
    destinationTime?.clearValidators();

    
  
    // Apply conditional validators
    if (frequency === 'monthly') {
      sourceDate?.setValidators([Validators.required]);
      destinationDate?.setValidators([Validators.required]);
      sourceTime?.setValidators([Validators.required]);
      destinationTime?.setValidators([Validators.required]);
    }
  
    if (frequency === 'weekly') {
      sourceDay?.setValidators([Validators.required]);
      destinationDay?.setValidators([Validators.required]);
      sourceTime?.setValidators([Validators.required]);
      destinationTime?.setValidators([Validators.required]);
    }
    if (frequency === 'daily') {
      sourceTime?.setValidators([Validators.required]);
      destinationTime?.setValidators([Validators.required]);
    }
    if (frequency === 'oneTime') {
      sourceDate?.setValidators([Validators.required]);
      destinationDate?.setValidators([Validators.required]);
      sourceTime?.setValidators([Validators.required]);
      destinationTime?.setValidators([Validators.required]);
    }
  
    // Update validity after changing validators
    sourceDate?.updateValueAndValidity();
    destinationDate?.updateValueAndValidity();
    sourceDay?.updateValueAndValidity();
    destinationDay?.updateValueAndValidity();
    sourceTime?.updateValueAndValidity();
    destinationTime?.updateValueAndValidity();
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

    var loadExpiryDate = value.loadExpiryDate;
    var date = new Date(loadExpiryDate);
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
    var day = date.getDate().toString().padStart(2, '0');
    var year = date.getFullYear();
    value.loadExpiryDate = month + '/' + day + '/' + year;

    const formValue = this.addAvailabilityForm.value
    const frequency = this.addAvailabilityForm.get('frequency')?.value;
  const dataToSend: any = {
  sourceLocation: this.isEdit? this.rowData.sourceLocation : this.AutoCompleteOptions.find((item)=>formValue.sourceLocation === item?.formattedLocation)?.id,
  destinationLocation: this.isEdit? this.rowData.destinationLocation : this.AutoCompleteOptionsDesc.find((item)=>formValue.destinationLocation === item?.formattedLocation)?.id,
  shipmentTypes: formValue.shipmentTypes,
  miles: formValue.miles,
  costPerMile: formValue.costPerMile,
  notes: formValue.notes,
  equipmentType: formValue.equipmentType,
  frequency: formValue.frequency,
  loadExpiryDate:  value.loadExpiryDate,
  truckName: formValue.truckName,
  weight: formValue.weight,
  length: formValue.length,
  ...(this.isEdit && { id: this.rowData.id })
};

if (frequency === 'monthly' || frequency === 'oneTime') {
  dataToSend.sourceDate = value.sourceDate;
  dataToSend.destinationDate = value.destinationDate;
  dataToSend.sourceTime=this.isEdit?  formValue.sourceTime : formValue.sourceTime ? `${formValue.sourceTime}:00` : null;
  dataToSend.destinationTime=this.isEdit?  formValue.destinationTime : formValue.destinationTime ? `${formValue.destinationTime}:00` : null;
} else if (frequency === 'weekly') {
  dataToSend.sourceDay = formValue.sourceDay;
  dataToSend.destinationDay = formValue.destinationDay;
  dataToSend.sourceTime= this.isEdit?  formValue.sourceTime : formValue.sourceTime ? `${formValue.sourceTime}:00` : null;
  dataToSend.destinationTime= this.isEdit?  formValue.destinationTime : formValue.destinationTime ? `${formValue.destinationTime}:00` : null;
} else if (frequency === 'daily') {
  dataToSend.sourceTime=this.isEdit?  formValue.sourceTime : formValue.sourceTime ? `${formValue.sourceTime}:00` : null;
  dataToSend.destinationTime=this.isEdit?  formValue.destinationTime : formValue.destinationTime ? `${formValue.destinationTime}:00` : null;
}
    
    if (valid) {
      this.loading = true;
      let APIparams = {
        apiKey:this.isEdit ? AppSettings.APIsNameArray.AVAILIBILITY.EDIT : AppSettings.APIsNameArray.AVAILIBILITY.ADD,
        uri: '',
        postBody: dataToSend,
      };
      const methodType = this.isEdit?'put':'post';
      (this.commonService as any)[methodType](APIparams).subscribe(
        (success) => {
          this.loading=false;
        if (success.success === true) {
          this.router.navigateByUrl('my-truck-availability/post-new');
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            this.isEdit ? 'Edit Load Availability' : 'Add Load Availability',
            this.isEdit
              ? 'You have successfully updated Load Availability details.'
              : 'You have successfully added Load Availability details.'
          );
          this.location.back();
          if(!this.isEdit){
            this.submitted=false;
            this.addAvailabilityForm.reset();
            this.addAvailabilityForm.markAsPristine();
            this.addAvailabilityForm.markAsUntouched();
            this.addAvailabilityForm.updateValueAndValidity();
          }
        } else if (success.success === false) {
          this.loading = false;
          this.submitted=false;
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_d',
            'check_circle',
            this.isEdit ? 'Edit Load Availability' : 'Add Load Availability',
  this.isEdit
    ? 'Failed to update Load Availability details.'
    : 'Failed to add Load Availability details.'
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
      this.sourceCityData = ServerRes?.response?.cityData;
      this.destinationCityData = ServerRes?.response?.cityData;
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
  onDotInputChange(value: string) {
    this.autocompleteSearchData(value,false);
  }

  onDotInputChangeDesc(value: string) {
    this.autocompleteSearchData(value,true);
  }
  autocompleteSearchData(searchdata?:any, isDestination = false): void {
    let newParams = {
      search: searchdata,
      onlyCities:true
    };
    const apiKey =  AppSettings.APIsNameArray.EXTRA.AUTOCOMPLETE;

    if (apiKey) {
      let APIparams = {
        apiKey: apiKey,
        uri: this.commonService.getAPIUriFromParams(newParams),
      };
      this.commonService.getList(APIparams).subscribe(
        (response) => {
        

          response.response.cityData = response.response.cityData.map(element => ({
            ...element,
            formattedLocation: `${element.city}, ${element.state}, ${element.country}`
          }));
          if(isDestination){
            this.AutoCompleteOptionsDesc = response.response.cityData;
            this.filteredOptionsDestination = this.AutoCompleteOptionsDesc;}
          else{
            this.AutoCompleteOptions = response.response.cityData;
            this.filteredOptions = this.AutoCompleteOptions;
          }
        },
        (error) => {
          console.error('Error fetching carriers:', error);
        }
      );
    }
  }

 
}
