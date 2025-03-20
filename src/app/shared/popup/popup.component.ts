// Oct 2024 I have dynamic the carrier/ broker contect information api

import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ImageCroppedEvent, LoadedImage, base64ToFile } from 'ngx-image-cropper';
import { SharedService } from 'src/app/commons/service/shared.service';
import { AlertService } from '../../commons/service/alert.service';
import { CommonService } from '../../commons/service/common.service';
import { AppSettings } from '../../commons/setting/app_setting';
import { StatusSetting } from '../../commons/setting/status_setting';
import { SubscriptionPopupComponent } from '../subscription-popup/subscription-popup.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, map, startWith } from 'rxjs';
export interface DialogData {
  openPop: string;
  email: any;
  belongFor: any;
  index: any;
  allowWhatsAppChat: any;
  mobileCountryCode: any;
  mobile: any;
  emailId: any;
  phoneId: any;
  carrierId: any,
  note: any,
  noteId: any,
  userId: any,
  listName: any,
  listId: any,
  countryCodeIC: any,
  insuranceCompanyName: any,
  phone: any,
  policyLimit: any,
  expiryDate: any,
  effectiveDate: any,
  policyNumber: any,
  address: any,
  insuranceType: any,
  insuranceId: any;
  loadData: any;
}

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  @Output() removeEmailIfo = new EventEmitter();
  filteredOptions: Observable<string[]>;
  public emailID: any;
  public minDate: any = new Date();
  public cargoTypes: any;
  laneRegion: any;
  calculatorName: any;
  carrierList: any = [];
  laneCity_one: any;
  public selectCheckedValue = [];
  public page = 1;
  public totalPage = 1;
  public totalRecords: any;
  public maxDate: any;
  public maxDateEffective: any;
  public errorAlreadyEmailMeg: any;
  public emtpyData = false;
  public multiUploadErrorMsg = false;
  public submitted = false;
  public multiUploadDisableIndicator = false;
  public showCreateNewList: boolean = false;
  public showSaveButton: boolean = false;
  public saveCarrierId: any;
  public InsuranceTypesData: any = []
  public shipmentType: any = [];
  public loaderSearch: boolean = false;
  public searchStr: any;
  public sourceCityData: any = [];
  public destinationCityData: any = [];
  destinationSearch = false;
  sourceLocSearch = false;
  sourceLoc: any = {};
  destinyLoc: any = {};
  public defualtCountryFlag: any;
  public videoName: any
  public MultiFileArray: any;
  public removeEmail: any;
  public profileImageForm: FormGroup;
  public createlistFormGroup: FormGroup;
  public downloadReportFilterForm: FormGroup;
  public imgURL: any;
  selectedFile: File | null = null;
  public message: any;
  public submit = false;
  public configData: any
  public phoneID: any;
  public emailFormGroup: FormGroup;
  public phoneFormGroup: FormGroup;
  public noteFormGroup: FormGroup;
  public listFormGroup: FormGroup;
  public filterForm: FormGroup;
  public scheduleForm: FormGroup;
  public countryList: any;
  public loading = false;
  public defualtPickupCountryFlag: any;
  public getRecord: any;
  public certifcateInsurence: FormGroup
  public editAvailabilityForm: FormGroup
  public emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
  public userProfleImage: FormGroup;
  // crop image
  public imagmessage: any;
  public imagePath: any;
  public disbu: boolean = true;
  public name: any;
  public imgName: any;
  public pdfName: any;
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public showCropper: boolean = false;
  public showImgName: boolean = false;
  public showProfileCropper: boolean = true;
  public showCoverCropper: boolean = true;
  public onlyCropper: boolean = false;
  datePipe: any;
  public emailOtpVerify: FormGroup;
  public equipmentType: any = [];
  public equipmentTypeId: any = [];
  public equipmentTypeName: any = [];
  public successMessage: string;
  public checkPlan: boolean = false;
  public getUserData: any;
  skeletonLoader: boolean;
  public massege: any;
  public errorMassege: any;
  dropTimedisabled = true;
  public minSourceDate: any = Date;
  public minNextDate: Date;
  public carrierOperation: any;
  states = ['california', 'Navada', 'Mexico'];
  targetJobMarketList = [];
  availabilityList = [];
  operation = [];
  fuelConsumption: any = [];


  public errorMessageInsurance: string = '';
  public information: any;
  public errorAlreadyexitPhone: any;

  constructor(
    private sharedService: SharedService,
    private sanitizer: DomSanitizer,
    public alertService: AlertService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router,
  ) {
    this.minSourceDate = new Date();
    this.minNextDate = null;
  }

  ngOnInit(): void {
    this.information = StatusSetting.information;

    if (this.data.openPop == 'saveCarrier') {
      this.getSaveCarrierList();
    }

    if (this.data.openPop == 'carrierFilter') {
      this.initializeFilterForm()
    }

    if (this.data.openPop == 'scheduleReportForm') {
      this.initializeScheduleForm()
    }

    if (this.data.openPop == 'downloadReportFilter') {
      this.initilizeDownloadReports()
    }

    this.calculatorName = this.data.loadData ?? ''

    this.shipmentType = StatusSetting.shipmentType;
    this.equipmentType = StatusSetting.equipmentType;
    this.maxDateEffective = new Date();
    this.emailOtpVerify = this.formBuilder.group({
      email: [this.data?.email, [Validators.required]],
      otp: ['', [Validators.required, Validators.pattern(/^-?([1-9]\d*)?$/)]],
    });
    this.noteFormGroup = this.formBuilder.group({
      note: [this.data ? this.data?.note : '', [Validators.required]],
    });

    this.profileImageForm = this.formBuilder.group({
      media: ['', [Validators.required]],
      mediaName: ['', [Validators.required, Validators.maxLength(64)]],
    });
    this.userProfleImage = this.formBuilder.group({
      profileImage: [''],
      coverImage: ['']
    })

    this.certifcateInsurence = this.formBuilder.group({
      insuranceType: [this.data?.insuranceType ? this.data?.insuranceType : '', Validators.required],
      policyNumber: [this.data?.policyNumber ? this.data?.policyNumber : '', Validators.required],
      effectiveDate: [this.data?.effectiveDate ? this.data?.effectiveDate : '', [Validators.required]],
      expiryDate: [this.data?.expiryDate ? this.data?.expiryDate : '', [Validators.required, this.validateDropDate]],
      address: [this.data?.address ? this.data?.address : '', [Validators.required]],
      policyLimit: [this.data?.policyLimit ? this.data?.policyLimit : '', [
        Validators.required,
        Validators.pattern(/^[0-9]*(\.[0-9]{0,2})?$/),
        Validators.maxLength(7),
      ]
      ],
      phone: [this.data?.phone ? this.data?.phone : '', [
        Validators.required,
        Validators.pattern(/^[0-9]{0,}$/),
        Validators.minLength(10),
      ]
      ],
      insuranceCompanyName: [this.data?.insuranceCompanyName ? this.data?.insuranceCompanyName : '', [Validators.required, Validators.maxLength(32)]],
      countryCode: [this.data?.countryCodeIC ? this.data?.countryCodeIC : 'US']
    });

    if (this.data.openPop != 'carrierFilter')
      this.editAvailabilityForm = this.formBuilder.group({
        sourceLocation: [this.data?.loadData?.sourceLocationCity ? (this.data?.loadData?.sourceLocationCity + ', ' + this.data?.loadData?.sourceLocationState + ', ' + this.data?.loadData?.sourceLocationCountry) : '', [Validators.required, Validators.maxLength(64)]],
        sourceDate: [this.data?.loadData?.sourceDate ? this.data?.loadData?.sourceDate : '', [Validators.required, this.validateSourceDate]],
        destinationLocation: [this.data?.loadData?.destinationLocationCity ? (this.data?.loadData?.destinationLocationCity + ', ' + this.data?.loadData?.destinationLocationState + ', ' + this.data?.loadData?.destinationLocationCountry) : '', [Validators.required, Validators.maxLength(64)]],
        destinationDate: [this.data?.loadData?.destinationDate ? this.data?.loadData?.destinationDate : '', [Validators.required, this.validateDropDate]],
        shipmentTypes: [this.data?.loadData?.shipmentTypes ? this.data?.loadData?.shipmentTypes : '', [Validators.required]],
        equipmentType: [this.data?.loadData?.equipmentType ? (this.data?.loadData?.equipmentType[0]?.equipmentTypeId).toString() : '', [Validators.required]],
        miles: [this.data?.loadData?.miles ? this.data?.loadData?.miles : '', [Validators.required,Validators.pattern(/^[.\d]+$/)]],
        costPerMile: [this.data?.loadData?.costPerMile ? this.data?.loadData?.costPerMile : '', [Validators.required, Validators.pattern(/^[.\d]+$/)]],
        notes: [this.data?.loadData?.notes ? this.data?.loadData?.notes : '', Validators.maxLength(516)],
      });

    this.listFormGroup = this.formBuilder.group({
      listName: [this.data ? this.data?.listName : '', [Validators.required]],
    });

    this.createlistFormGroup = this.formBuilder.group({
      listName: ['', [Validators.required]],
    });

    let configValue = this.sharedService.getConfig();
    if (configValue !== undefined) {
      this.getConfigSet(configValue);
    }
    this.commonService.configData.subscribe((userData) => {
      this.getConfigSet(userData);
    });
    if (this.data.openPop == 'editEmail' || this.data.openPop == 'addEmail') {
      this.emailFormGroup = this.formBuilder.group({
        email: [this.data ? this.data?.email : '', [Validators.required, Validators.pattern(AppSettings.emailPattern)]],
        belongFor: [this.data ? this.data.belongFor : '', [Validators.required]],
      });
    }

    if (this.data.openPop == 'editPhone' || this.data.openPop == 'addPhone') {
      this.phoneFormGroup = this.formBuilder.group({
        mobileCountryCode: [this.data?.mobileCountryCode ? this.data?.mobileCountryCode : 'US', [Validators.required]],
        mobile: [this.data ? this.data?.mobile : '', [Validators.required,Validators.pattern(/^[0-9]{0,}$/), Validators.minLength(10)]],
        belongFor: [this.data ? this.data?.belongFor : '', [Validators.required]],
        allowWhatsappChat: [this.data ? this.data.allowWhatsAppChat : '', []],
      });
    }
    this.selectPickCountryCode(this.data?.mobileCountryCode)
    this.selectCountryCode(this.data?.countryCodeIC)
    if (localStorage.getItem('user_type') == 'CARRIER') {
      this.getUserProfile()
    }

  }

  private _filter(value: any): any {
    throw new Error('Method not implemented.');
  }
  getConfigSet(configValue: any) {
    this.configData = configValue;
    this.InsuranceTypesData = configValue.InsuranceTypes
  }
  onNoClick(): void {
    this.dialogRef.close({ event: 'fail' });
  }
  onYesClick(): void {
    this.dialogRef.close({ event: 'ok' });
  }

  updateMinNextDate(selectedDate: Date) {
    this.dropTimedisabled = false;
    this.editAvailabilityForm.get('destinationDate').setValue('');
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    this.minNextDate = nextDay;
  }

  emailFormSubmit({ value, valid }) {
    this.errorAlreadyEmailMeg = null;

    if (valid) {
      this.loading = true;
      let APIparams;
      let APIContactInfoAdd
      if(localStorage.getItem('user_type') == 'CARRIER'){
        APIContactInfoAdd = AppSettings.APIsNameArray.CARRIERSCONTACTINFOR.ADDEMAIL;
     }
     else if(localStorage.getItem('user_type') == 'BROKER'){
      APIContactInfoAdd = AppSettings.APIsNameArray.CARRIERSCONTACTINFOR.BROKERADDEMAIL;
     }
      if (this.data.openPop === 'addEmail') {
        APIparams = {
          apiKey: APIContactInfoAdd,
          uri: '',
          postBody: value,
        };
        this.commonService.post(APIparams).subscribe(
          (success) => {
            this.loading = false;
            if (success.success === true) {
              this.errorAlreadyEmailMeg = null
              this.alertService.showNotificationMessage(
                'success',
                'bottom',
                'left',
                'txt_s',
                'check_circle',
                'Email',
                'Contact information added successfully.'
              );
              this.dialogRef.close({ event: 'ok' });

            } else if (success.success === false) {
              this.loading = false;

              this.errorAlreadyEmailMeg = success?.message

              this.alertService.showNotificationMessage(
                'danger',
                'bottom',
                'left',
                'txt_d',
                'check_circle',
                'Email',
                'You have not successfully updated Contact information.'
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
            // this.errorMessage=error.error.message;
          }
        );
      } else {
        let APIContactInfoUpdate
      if(localStorage.getItem('user_type') == 'CARRIER'){
        value.carrierContactInformationId = this.data.emailId

        APIContactInfoUpdate = AppSettings.APIsNameArray.CARRIERSCONTACTINFOR.UPDATE;
     }
     else if(localStorage.getItem('user_type') == 'BROKER'){
      value.brokerContactInformationId = this.data.emailId

      APIContactInfoUpdate = AppSettings.APIsNameArray.CARRIERSCONTACTINFOR.BROKERUPDATE;
     }
        APIparams = {
          apiKey: APIContactInfoUpdate,
          uri: '',
          postBody: value,
        };
        this.commonService.put(APIparams).subscribe(
          (success) => {
            this.loading = false;
            if (success.success === true) {
              this.errorAlreadyEmailMeg = null
              this.alertService.showNotificationMessage(
                'success',
                'bottom',
                'left',
                'txt_s',
                'check_circle',
                'Carrier Email',
                'Contact information added successfully.'
              );
              this.dialogRef.close({ event: 'ok' });

            } else if (success.success === false) {
              this.errorAlreadyEmailMeg = success?.message
              this.alertService.showNotificationMessage(
                'danger',
                'bottom',
                'left',
                'txt_d',
                'check_circle',
                'Carrier Email',
                'You have not successfully updated Contact information.'
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

  }

  phoneFormSubmit({ value, valid }) {
    this.submit = true
    this.errorAlreadyexitPhone = null;

    if (valid) {
      this.loading = true;
      let APIparams
      let APIContactInfoAdd
      if(localStorage.getItem('user_type') == 'CARRIER'){
        APIContactInfoAdd = AppSettings.APIsNameArray.CARRIERSCONTACTINFOR.ADDPHONE;
     }
     else if(localStorage.getItem('user_type') == 'BROKER'){
      APIContactInfoAdd = AppSettings.APIsNameArray.CARRIERSCONTACTINFOR.BROKERADDPHONE;
     }
      if (this.data.openPop === 'addPhone') {
        APIparams = {
          apiKey: APIContactInfoAdd,
          uri: '',
          postBody: value,
        };
        this.commonService.post(APIparams).subscribe(
          (success) => {
            if (success.success === true) {
              this.loading = false;
              this.submit = false
              this.alertService.showNotificationMessage(
                'success',
                'bottom',
                'left',
                'txt_s',
                'check_circle',
                'Phone',
                'Contact information added successfully.'
              );
              this.dialogRef.close({ event: 'ok' });


            } else if (success.success === false) {
              this.submit = false

              this.errorAlreadyexitPhone = success.message;
              this.loading = false;
              this.alertService.showNotificationMessage(
                'danger',
                'bottom',
                'left',
                'txt_d',
                'check_circle',
                'Carrier Phone',
                'You have not successfully updated Contact information.'
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
            this.submit = false
            // this.errorMessage = error?.error?.message;


          }
        );
      }
      else {
        let APIContactInfoUpdate
      if(localStorage.getItem('user_type') == 'CARRIER'){
        value.carrierContactInformationId = this.data.phoneId

        APIContactInfoUpdate = AppSettings.APIsNameArray.CARRIERSCONTACTINFOR.UPDATE;
     }
     else if(localStorage.getItem('user_type') == 'BROKER'){
      value.brokerContactInformationId = this.data.phoneId

      APIContactInfoUpdate = AppSettings.APIsNameArray.CARRIERSCONTACTINFOR.BROKERUPDATE;
     }
        APIparams = {
          apiKey: APIContactInfoUpdate,
          uri: '',
          postBody: value,
        };
        this.commonService.put(APIparams).subscribe(
          (success) => {
            this.loading = false;
            if (success.success === true) {

              this.alertService.showNotificationMessage(
                'success',
                'bottom',
                'left',
                'txt_s',
                'check_circle',
                'Carrier Phone',
                'Contact information added successfully.'
              );
              this.dialogRef.close({ event: 'ok' });

            } else if (success.success === false) {
              this.errorAlreadyexitPhone = success?.message;
              this.alertService.showNotificationMessage(
                'danger',
                'bottom',
                'left',
                'txt_d',
                'check_circle',
                'Phone',
                'You have not successfully updated contact information.'
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

  }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
  //only for miles and cost as where . is required  
  onlyNumberKeyCost(event: KeyboardEvent): boolean {
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
  selectPickCountryCode(event: any) {
    this.countryList = this.configData?.countryArrayObject;
    this.getRecord = this.countryList?.filter((item) => item.code == event);
    this.defualtPickupCountryFlag = this?.getRecord[0]?.flag;
  }

  selectCountryCode(event: any) {
    this.countryList = this.configData?.countryArrayObject;
    this.getRecord = this.countryList?.filter((item) => item.code == event);
    this.defualtCountryFlag = this.getRecord[0]?.flag;
  }

  addNoteFormSubmit({ value, valid }) {
    this.submit = true
    if (valid) {
      this.loading = true;
      let APIparams;
      if (this.data.openPop === 'addNote') {
        value.carrierId = this.data?.carrierId
        APIparams = {
          apiKey: AppSettings.APIsNameArray.SAVECARRIRLIST.ADDNOTE,
          uri: '',
          postBody: value,
        };
        this.commonService.post(APIparams).subscribe(
          (success) => {
            this.loading = false;
            if (success.success === true) {
              this.alertService.showNotificationMessage(
                'success',
                'bottom',
                'left',
                'txt_s',
                'check_circle',
                'Add Note',
                'You have successfully added Note.'
              );
              this.dialogRef.close({ event: 'ok' });

            } else if (success.success === false) {
              this.alertService.showNotificationMessage(
                'danger',
                'bottom',
                'left',
                'txt_d',
                'check_circle',
                'Add Note',
                'You have not successfully added Note.'
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
      } else {

        this.loading = true
        value.noteId = this.data?.noteId;

          APIparams = {
            apiKey: AppSettings.APIsNameArray.SAVECARRIRLIST.UPDATENOTE,
            uri: '',
            postBody: value,
          };
        this.commonService.put(APIparams).subscribe(
          (success) => {
            this.loading = false;
            if (success.success === true) {
              this.alertService.showNotificationMessage(
                'success',
                'bottom',
                'left',
                'txt_s',
                'check_circle',
                'Update Note',
                'You have successfully Updated Note.'
              );
              this.dialogRef.close({ event: 'ok' });

            } else if (success.success === false) {
              this.alertService.showNotificationMessage(
                'danger',
                'bottom',
                'left',
                'txt_d',
                'check_circle',
                'Update Note',
                'You have not successfully updated Note.'
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
  }

  carrierListFormSubmit({ value, valid }) {
    this.submit = true
    if (valid) {
      this.loading = true;
      let APIparams;
      if (this.data?.openPop == 'editCarrierList') {
        value.listId = this.data?.listId;
        APIparams = {
          apiKey: AppSettings.APIsNameArray.SAVECARRIRLIST.UPDATELISTNAME,
          uri: '',
          postBody: value,
        };
      }
      else {
        APIparams = {
          apiKey: AppSettings.APIsNameArray.SAVECARRIRLIST.CREATESAVELIST,
          uri: '',
          postBody: value,
        };
      }
      if (this.data.openPop == 'editCarrierList') {
        this.commonService.put(APIparams).subscribe(
          (success) => {
            this.loading = false;
            if (success.success === true) {
              this.alertService.showNotificationMessage(
                'success',
                'bottom',
                'left',
                'txt_s',
                'check_circle',
                'Carrier Save List',
                'You have successfully updated carrier save List successfully.'
              );
              this.dialogRef.close({ event: 'ok' });

            } else if (success.success === false) {
              this.alertService.showNotificationMessage(
                'danger',
                'bottom',
                'left',
                'txt_d',
                'check_circle',
                'Carrier Save List',
                'You have not successfully updated carrier save List successfully.'
              );
            }
            this.loading = false;

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
      else {
        this.commonService.post(APIparams).subscribe(
          (success) => {
            this.loading = false;
            if (success.success === true) {
              this.alertService.showNotificationMessage(
                'success',
                'bottom',
                'left',
                'txt_s',
                'check_circle',
                'Carrier Save List',
                'You have successfully updated carrier save List successfully.'
              );
              if (this.data.openPop == 'saveCarrier') {
                this.showCreateNewList = false;
                this.getSaveCarrierList();
              }
              else {
                this.dialogRef.close({ event: 'ok' });

              }
            } else if (success.success === false) {
              this.alertService.showNotificationMessage(
                'danger',
                'bottom',
                'left',
                'txt_d',
                'check_circle',
                'Carrier Save List',
                'You have not successfully updated carrier save List successfully.'
              );
            }
            this.loading = false;

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
  }

  // crop image 
  fileChangeEvent(event: any) {
    this.selectedFile = event.target.files[0];
    this.videoName = event.target.files[0].name;
    let OneMB = 1024 * 1024;
    var totalSizeMB: any = (this.selectedFile?.size / (OneMB)).toFixed(2);
    if (totalSizeMB > 11) {
      this.multiUploadDisableIndicator = true;
      this.multiUploadErrorMsg = true;
    } else {
      this.multiUploadDisableIndicator = false;
      this.multiUploadErrorMsg = false;
    }
    this.imageChangedEvent = event;
    this.imagePath = event.target.files;
    this.name = event.target.files[0].name;
    this.disbu = false;
    this.onlyCropper = true;
    if (event.target.files.length === 0) return;
    if (
      event.target.files[0].type !== 'image/png' &&
      event.target.files[0].type !== 'image/jpeg' &&
      event.target.files[0].type !== 'image/jpg'
    ) {
      this.imagmessage = 'Only Images are allowed ( JPG | PNG | JPEG)';
      this.name = '';
      return;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    // this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    if (event?.blob) {
      let file = event?.blob;

      const myFile = new File([file], this.name, {
        type: file?.type,
      });
      this.imgName = myFile.name;
      this.showImgName = true;

      if (this.data.openPop === 'medialUpload') {
        this.showCoverCropper = false;
        this.showProfileCropper = true;
        this.profileImageForm.get('media').setValue(file);
      }
      if (this.data.openPop === 'profileImage') {
        this.showCoverCropper = false;
        this.showProfileCropper = true;
        this.userProfleImage.get('profileImage').setValue(file);
      }
      if (this.data.openPop === 'coverImage') {
        this.showCoverCropper = true;
        this.showProfileCropper = false;
        this.userProfleImage.get('coverImage').setValue(file);
      }
    } else {
    }
  }


  imageLoaded(image: LoadedImage) {
    this.showCropper = true;
  }

  profileImageSave({ value, valid }) {
    if (valid && this.checkPlan == true) {
      this.subscriptionUpgrade();
      this.dialogRef.close({ event: 'fail' });

    }
    else {
      this.submit = true
      if (valid) {
        this.loading = true;
        const formData = new FormData();

        if (this.data.openPop == 'medialUpload') {
          this.massege = 'You have successfully uploaded image.';
          this.errorMassege = 'You have not successfully uploaded image'
          formData.append('mediaName', this.profileImageForm.get("mediaName").value);
          formData.append('media', this.profileImageForm.get("media").value);
          formData.append('mediaType', 'CARRIER_IMAGE_FILE');
        }
        if (this.data.openPop == 'pdfUpload') {
          this.massege = 'You have successfully uploaded document.';
          this.errorMassege = 'You have not successfully uploaded document.'
          formData.append('mediaName', this.profileImageForm.get("mediaName").value);
          formData.append('media', this.profileImageForm.get("media").value);
          formData.append('mediaType', 'CARRIER_PDF_FILE');
        }
        if (this.data.openPop == 'videoUpload') {
          this.massege = 'You have successfully uploaded video.';
          this.errorMassege = 'You have not successfully uploaded video.';
          formData.append('mediaName', this.profileImageForm.get("mediaName").value);
          formData.append('media', this.profileImageForm.get("media").value);
          formData.append('mediaType', 'CARRIER_VIDEO_FILE');

        }
        let APIparams = {
          apiKey: AppSettings.APIsNameArray.MEDIA.ADD,
          uri: '',
          postBody: formData,
        };
        this.commonService.post(APIparams).subscribe(
          (success) => {
            // this.MultiFileArray=[];
            // this.getMedia();
            this.loading = false;
            if (success.success === true) {
              this.dialogRef.close({ event: 'ok' });

              this.alertService.showNotificationMessage(
                'success',
                'bottom',
                'left',
                'txt_s',
                'check_circle',
                'Media',
                this.massege
              );
            } else if (success.success === false) {
              this.dialogRef.close({ event: 'ok' });

              this.alertService.showNotificationMessage(
                'danger',
                'bottom',
                'left',
                'txt_d',
                'check_circle',
                'Media',
                this.errorMassege
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
  }
  /*Contract document uploda*/
  onSelectedContract(event) {
    if (event.target.files.length === 0) return;
    let mimeType = event.target.files[0].type;
    if (mimeType.match(/pdf\/*/) === null) {
      this.imagmessage = 'Only supported pdf file.';
      this.imgURL = '';
      return;
    }

    var reader = new FileReader();
    //this.imagePath = event.target.files;
    this.name = event.target.files[0].name;
    this.pdfName = event.target.files[0].name
    this.disbu = false;
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
    //this.imagmessage = '';
    if (event.target.files.length) {
      const file = event.target.files[0];
      this.profileImageForm.get('media').setValue(file);
    }
  }

  multiUpload(event) {
    this.selectedFile = event.target.files[0];
    this.profileImageForm.get('media').setValue(event.target.files[0]);
    this.videoName = event.target.files[0].name;
    let OneMB = 1024 * 1024;
    var totalSizeMB: any = (this.selectedFile?.size / (OneMB)).toFixed(2);
    if (totalSizeMB > 26) {
      this.multiUploadDisableIndicator = true;
      this.multiUploadErrorMsg = true;
    } else {
      this.multiUploadDisableIndicator = false;
      this.multiUploadErrorMsg = false;
    }
    var totalSize = 0;
    // for (var i = 0; i < event.target.files.length; i++) {
    //   this.profileImageForm.get('media').setValue(event.target.files[i]);
    //   this.videoName = event.target.files[i].name;
    //   // this.MultiFileArray.push(event.target.files[i]);
    //   totalSize = totalSize + event.target.files[i].size;
    //   if (i === event.target.files?.length - 1) {
    //     let OneMB=1024 * 1024
    //     var totalSizeMB = totalSize / OneMB;
    //     if (totalSizeMB > 26) {
    //       this.multiUploadDisableIndicator = true;
    //       this.multiUploadErrorMsg = true;
    //     } else {
    //       this.multiUploadDisableIndicator = false;
    //       this.multiUploadErrorMsg = false;
    //     }
    //   }
    // }
  }

  redirectToReview(type) {
    if (type == 'writeReview') {
      this.router.navigateByUrl('/review/write-a-review');
      this.dialogRef.close({ event: 'fail' });

    }
    else {
      this.router.navigateByUrl('/review/non-carrier-manage-reviews');
      this.dialogRef.close({ event: 'fail' });


    }
  }

  uploadProfileImage({ value, valid }) {
    this.submit = true
    // if (valid) {
    const formData = new FormData();
    if (this.data.openPop == 'profileImage') {
      formData.append('profileImage', this.userProfleImage.get("profileImage").value);
    }
    if (this.data.openPop == 'coverImage') {
      formData.append('coverImage', this.userProfleImage.get("coverImage").value);
    }
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.MEDIA.UPLOADIMAGE,
      uri: '',
      postBody: formData,
    };

    if (this.data?.openPop == 'profileImage') {

      this.loading = true;
      this.commonService.post(APIparams).subscribe(
        (success) => {
          // this.MultiFileArray=[];
          // this.getMedia();
          this.loading = false;
          if (success.success === true) {

            this.sharedService.userDataPass.next('updateImage')

            this.dialogRef.close({ event: 'ok' });

            this.alertService.showNotificationMessage(
              'success',
              'bottom',
              'left',
              'txt_s',
              'check_circle',
              'Business Information',
              'You have successfully uploaded logo.'
            );
          } else if (success.success === false) {
            this.dialogRef.close({ event: 'ok' });

            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'Business Information',
              'You have not successfully uploaded logo.'
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
    else if (this.data?.openPop == 'coverImage') {
      if (this.checkPlan == true) {
        this.subsciptionPlanCheck()
      } else {
        this.loading = true;
        this.commonService.post(APIparams).subscribe(
          (success) => {
            // this.MultiFileArray=[];
            // this.getMedia();
            this.loading = false;
            if (success.success === true) {
              this.sharedService.userDataPass.next('updateImage')

              this.dialogRef.close({ event: 'ok' });

              this.alertService.showNotificationMessage(
                'success',
                'bottom',
                'left',
                'txt_s',
                'check_circle',
                'User Business',
                'You have successfully uploaded banner image.'
              );

            } else if (success.success === false) {
              this.dialogRef.close({ event: 'ok' });

              this.alertService.showNotificationMessage(
                'danger',
                'bottom',
                'left',
                'txt_d',
                'check_circle',
                'User Business',
                'You have not successfully uploaded banner image.'
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

    // }
  }

  /*upload certificate of insurance*/
  certifcateUpload({ value, valid }) {
    var effectiveDate = value.effectiveDate;
    var date = new Date(effectiveDate);
    var day = date.getDate().toString().padStart(2, '0');
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
    var year = date.getFullYear();
    value.effectiveDate = year + '-' + month + '-' + day;
    var expiryDateDate = value.expiryDate;
    var date = new Date(expiryDateDate);
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
    var day = date.getDate().toString().padStart(2, '0');
    var year = date.getFullYear();
    value.expiryDate = year + '-' + month + '-' + day;
    if (valid) {
      this.loading = true;
      if (this.data?.openPop == 'certifcateInsurence') {
        let APIparams = {
          apiKey: AppSettings.APIsNameArray.INSURENCE.ADD,
          uri: '',
          postBody: value,
        };
        this.commonService.post(APIparams).subscribe(
          (success) => {
            if (success.success === true) {
              this.errorMessageInsurance = null;
              this.alertService.showNotificationMessage(
                'success',
                'bottom',
                'left',
                'txt_s',
                'check_circle',
                'Insurance',
                'You have successfully added Insurence Certificate .'
              );
              this.loading = false;
              this.dialogRef.close({ event: 'Ok' });
            } else if (success.success === false) {
              this.loading = false;
              this.errorMessageInsurance = success.message;
              this.alertService.showNotificationMessage(
                'danger',
                'bottom',
                'left',
                'txt_d',
                'check_circle',
                'Insurance',
                'You have not successfully added Insurence Certificate.'
              );
            }
          },
          (error) => {
            this.errorMessageInsurance = null;

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
      else if (this.data?.openPop == 'editInsurence') {
        value.insuranceId = this.data?.insuranceId
        let APIparams = {
          apiKey: AppSettings.APIsNameArray.INSURENCE.EDIT,
          uri: '',
          postBody: value,
        };
        this.commonService.put(APIparams).subscribe(
          (success) => {
            if (success.success === true) {
              this.alertService.showNotificationMessage(
                'success',
                'bottom',
                'left',
                'txt_s',
                'check_circle',
                'Insurance',
                'You have successfully updated Insurence Certificate.'
              );
              this.loading = false;
              this.dialogRef.close({ event: 'Ok' });
            } else if (success.success === false) {
              this.loading = false;
              this.alertService.showNotificationMessage(
                'danger',
                'bottom',
                'left',
                'txt_d',
                'check_circle',
                'Insurance',
                'You have not successfully updated Insurence Certificate.'
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
  }

  pickDateEvent($event, type) {

  }

  validateSourceDate(control: FormControl) {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    if (selectedDate < currentDate) {
      return { pastDate: true };
    }
    return null;
  }

  /*upload certificate of insurance*/
  editAvailabilityFormSubmit({ value, valid }) {
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

    value.sourceLocation = this.sourceLoc.id ? this.sourceLoc.id : this.data?.loadData?.sourceLocation;
    value.destinationLocation = this.destinyLoc.id ? this.destinyLoc.id : this.data?.loadData?.destinationLocation;
    value.id = this.data?.loadData?.id;
    if (valid) {
      this.loading = true;
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.AVAILIBILITY.EDIT,
        uri: '',
        postBody: value,
      };
      this.commonService.put(APIparams).subscribe(
        (success) => {
          if (success.success === true) {
            this.alertService.showNotificationMessage(
              'success',
              'bottom',
              'left',
              'txt_s',
              'check_circle',
              'Load Availibility',
              'You have successfully updated Load Availibility detials.'
            );
            this.loading = false;
            this.dialogRef.close({ event: 'Ok' });
          } else if (success.success === false) {
            this.loading = false;
            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'Load Availibility',
              'You have not successfully updated Load Availibility detials.'
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

  searchUserType(event: any) {
    this.loaderSearch = true;
    // this.srcPrtBox ="active_src_rslt";
    this.emtpyData = false;
    this.searchStr = event.target.value;
    if (this.searchStr.length > 0) {
      this.sourceLocSearch = true;
      this.searchRecord(this.searchStr);
    } else {
      this.searchRecord(null);
      this.loaderSearch = false;
      this.sourceLocSearch = false;
      this.sourceCityData = [];
    }
  }

  getAPIInParam(searchStr) {
    let APIparams, params;
    if (searchStr) params = { search: searchStr, onlyCities: true };
    else params = {};
    APIparams = {
      apiKey: AppSettings.APIsNameArray.USER.SEARCH,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }

  searchRecord(searchStr: any) {
    var APIparams = this.getAPIInParam(searchStr);
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      this.sourceCityData = ServerRes.response.cityData;
      this.destinationCityData = ServerRes.response.cityData;
      this.loaderSearch = false;
      this.emtpyData = true;
    });
  }

  searchUserTypeForDestination(event: any) {
    this.loaderSearch = true;
    // this.srcPrtBox ="active_src_rslt";
    this.emtpyData = false;
    this.searchStr = event.target.value;
    if (this.searchStr.length > 0) {
      this.destinationSearch = true;
      this.searchRecord(this.searchStr);
    } else {
      this.searchRecord(null);
      this.loaderSearch = false;
      this.destinationSearch = false;
      this.destinationCityData = [];
    }
  }

  getSourceLoc(sourceLoc: any) {
    this.sourceLoc = { location: sourceLoc?.city + ', ' + sourceLoc?.state, id: sourceLoc?.id };
    this.sourceLocSearch = false;
  }

  getDestinyLoc(destinyLoc: any) {
    this.destinyLoc = { location: destinyLoc?.city + ', ' + destinyLoc?.state, id: destinyLoc?.id };
    this.destinationSearch = false;
  }

  validateDropDate(control: any) {
    const effectiveDate = new Date(control.parent?.controls?.effectiveDate?.value);
    const expiryDate = new Date(control.value);

    if (expiryDate < effectiveDate) {
      return { 'invalidDropDate': true };
    }
    return null;
  }

  get effectiveDate() {
    return this.certifcateInsurence.get('effectiveDate');
  }

  get expiryDate() {
    return this.certifcateInsurence.get('expiryDate');
  }

  /*Verify OTP AND  RESENT OTP*/
  verifyOtpEmail({ value, valid }) {
    if (valid) {
      this.loading = true;

      let APIparams = {
        apiKey: AppSettings.APIsNameArray.AUTH.UPDATECREDENTIALS,
        uri: '',
        postBody: value,
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {
          if (success.success === true) {
            this.alertService.showNotificationMessage(
              'success',
              'bottom',
              'right',
              'txt_s',
              'check_circle',
              'Email Update',
              success.message
            );
            this.dialogRef.close({ event: 'OTP_VERIFY' });
            this.loading = false;
          } else if (success.success === false) {
            this.message = 'Invalid verfication code';
            this.loading = false;
          }
        },
        (error) => {
          this.message = AppSettings.ERROR;
          this.loading = false;
        }
      );
    }
  }

  ValueSelected(event: MatCheckboxChange, id: any, userId: any, index: any) {
    this.saveCarrierId = userId
    this.showSaveButton = true;
    if (event.checked) {
      this.selectCheckedValue.push(id);

    } else {
      let selectedData = this.selectCheckedValue.find(item => item === id);

      if (selectedData)
        this.selectCheckedValue.splice(this.selectCheckedValue.indexOf(selectedData), 1);
    }

  }

  showCreateList() {
    this.showCreateNewList = true;
    this.listFormGroup.reset();
  }

  getSaveCarrierList() {
    this.page = 1;
    let uri = null;
    let newParams = {
      limit: '8',
      page: '1'

    };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.SAVECARRIRLIST.LIST,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.carrierList = ServerRes.response?.saveListData;
        this.totalPage = ServerRes.response?.totalPages;
        this.totalRecords = ServerRes.response?.totalRecords;
      } else {
        this.carrierList = [];
      }
    }, (error) => {
      this.carrierList = [];
    });
  }

  closeNewList() {
    this.showCreateNewList = false;
    this.listFormGroup.reset();
  }

  saveChanges() {
    this.submit = true
    if (this.selectCheckedValue) {
      let value = {
        'listId': this.selectCheckedValue,
        'carrierId': this.data.carrierId
      };
      this.loading = true;
      let APIparams;
      APIparams = {
        apiKey: AppSettings.APIsNameArray.SAVECARRIRLIST.ADDSAVELIST,
        uri: '',
        postBody: value,
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {
          this.loading = false;
          if (success.success === true) {
            this.alertService.showNotificationMessage(
              'success',
              'bottom',
              'left',
              'txt_s',
              'check_circle',
              'Carrier Save List',
              'You have successfully updated carrier save List successfully.'
            );
            this.dialogRef.close({ event: 'Ok' });
            this.successMessage = success?.message

          } else if (success.success === false) {
            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'Carrier Save List',
              'You have not successfully updated carrier save List successfully.'
            );
          }
          this.loading = false;

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
  // calling getApi for crrier type 
  getUserProfile() {
    this.skeletonLoader = true
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
        this.skeletonLoader = false

        if (this.getUserData && this.getUserData.subscriptionPlanType == '1') {
          this.checkPlan = true;
        } else {
          this.checkPlan = false;
        }
      } else {
        this.skeletonLoader = false

      }
    })
  }
  subsciptionPlanCheck() {
    if (this.checkPlan) {
      this.subscriptionUpgrade();
    }
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

  applyFilter() {
    this.filterForm.get('toAddDate').setValue(this.formatDateToMMDDYYYY(this.filterForm.get('toAddDate').value));
    this.filterForm.get('fromAddDate').setValue(this.formatDateToMMDDYYYY(this.filterForm.get('fromAddDate').value));
    this.filterForm.get('toMCS150Date').setValue(this.formatDateToMMDDYYYY(this.filterForm.get('toMCS150Date').value));
    this.filterForm.get('fromMCS150Date').setValue(this.formatDateToMMDDYYYY(this.filterForm.get('fromMCS150Date').value));
    this.filterForm.get('hmFlag').setValue(+this.filterForm.get('hmFlag').value);
    this.filterForm.get('emailVerified').setValue(+this.filterForm.get('emailVerified').value);
    this.dialogRef.close({ event: 'ok', value: this.filterForm.value });
  }

  initializeFilterForm() {
    const value = this.data.loadData;
    this.loading = true;
    this.commonService.configData.subscribe((value) => {
      this.getLaneRegion()
      this.cargoTypes = value['cargoTypes'];
      this.equipmentType = value['equipmentTypes'];
      this.fuelConsumption = value['fuel'];
      this.targetJobMarketList = Object.entries(value['targetJobMarket']).map(([id, name]) => ({ id, name }));
      this.operation = Object.entries(value['carrierOperation']).map(([id, name]) => ({ id, name }));
      this.availabilityList = Object.entries(value['availability']).map(([id, name]) => ({ id, name }));
      this.loading = false;

    })
    this.filterForm = this.formBuilder.group({
      city: [value.city ?? ''],
      state: [value.state ?? ''],
      search: [value.search ?? ''],
      toMCS150Date: [this.parseDate(value.toMCS150Date) ?? ''],
      fromMCS150Date: [this.parseDate(value.fromMCS150Date) ?? ''],
      toAddDate: [this.parseDate(value.toAddDate) ?? ''],
      fromAddDate: [this.parseDate(value.fromAddDate) ?? ''],
      emailVerified: [value.emailVerified ?? ''],
      targetJobMarket: [value.targetJobMarket ?? ''],
      hmFlag: [value.hmFlag ?? ''],
      dotNumber: [value.dotNumber ?? ''],
      availability: [value.availability ?? ''],
      carrierOperation: [value.carrierOperation ?? ''],
      fuelConsumptionType: [value.fuelConsumptionType?.split(',').map(Number) ?? ''],
      cargoTypes: [value.cargoTypes?.split(',').map(Number) ?? ''],
      equipmentType: [value.equipmentType?.split(',') ?? ''],
      ratePerMile: [value.ratePerMile ?? ''],
      minTrucksNumbers: [value.minTrucksNumbers ?? 0],
      maxTrucksNumbers: [value.maxTrucksNumbers ?? 0],
      minDriverNumbers: [value.minDriverNumbers ?? 0],
      maxDriverNumbers: [value.maxDriverNumbers ?? 0]
    });
  }

  initializeScheduleForm() {
    this.scheduleForm = this.formBuilder.group({
      reportName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(128), Validators.pattern(this.emailPattern)]]
    })
  }

  parseDate(dateString: string): Date | null {
    if (!dateString) return null;
    const [month, day, year] = dateString.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  formatDateToMMDDYYYY(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  onClearform(form: FormGroup) {
    form.reset()
  }

  getLaneRegion() {
    let uri = null;
    let newParams = {
    };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.LaneRegions.LANE,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.laneRegion = ServerRes.response.state;
      } else {
        this.laneRegion = []

      }
    });
  }

  getLaneCity(id) {
    let uri = null;
    let newParams = {
      'stateId': id,
      limit: 1000
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.LaneRegions.CITY,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerResult) => {
      if (ServerResult.success === true) {
        this.laneCity_one = ServerResult.response.city;
        this.filteredOptions = this.filterForm.get('city').valueChanges.pipe(
          startWith(''),
          map(value => this._filterCities(value)),
        );
      }
      else {
        this.laneCity_one = [];
      }

    });
  }

  stateChangeDetect(value: any) {
    this.getLaneCity(value);
  }

  private _filterCities(value: string): any[] {
    const filterValue = value?.toLowerCase();
    return this.laneCity_one.filter(city => city.name.toLowerCase().includes(filterValue));
  }

  inputValue(popup) {

    if (isNaN(this.filterForm.get(popup).value)) {
      this.filterForm.get(popup).reset()
    }

  }

  scheduleFormSubmit() {
    this.submit = true;
    if (this.scheduleForm.valid)
      this.dialogRef.close({ event: 'ok', value: this.scheduleForm.value });
  }

  initilizeDownloadReports() {
    this.downloadReportFilterForm = this.formBuilder.group({
      toScheduledDate: [this.parseDate(this.data?.loadData?.toScheduledDate) ?? ''],
      fromScheduledDate: [this.parseDate(this.data?.loadData?.fromScheduledDate) ?? ''],
      status: [this.data?.loadData?.status ?? ''],
      reportName: [this.data?.loadData?.reportName ?? '']
    })
  }

  applyDownloadFilter() {
    this.downloadReportFilterForm.get('toScheduledDate').setValue(this.formatDateToMMDDYYYY(this.downloadReportFilterForm.get('toScheduledDate')?.value));
    this.downloadReportFilterForm.get('fromScheduledDate').setValue(this.formatDateToMMDDYYYY(this.downloadReportFilterForm.get('fromScheduledDate')?.value));
    this.dialogRef.close({ event: 'ok', value: this.downloadReportFilterForm.value });
  }

  submitCalculatorName() {
    this.submit = true;
    if (this.calculatorName)
      this.dialogRef.close({ event: 'ok', value: this.calculatorName });
  }

  deleteCalculator() {
    this.dialogRef.close({ event: 'ok' })
  }

  updateCalculatorName() {
    this.submit = true;
    if (this.calculatorName)
      this.dialogRef.close({ event: 'ok', value: this.calculatorName });
  }

  clearCalculatorName() {
    this.calculatorName = ''
  }
  redirectSignSignUp(){
    this.router.navigate(['/sign-in'])
    this.dialogRef.close({ event: 'ok' })


  }
}
