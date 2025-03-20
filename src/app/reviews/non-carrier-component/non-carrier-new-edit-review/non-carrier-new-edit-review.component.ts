import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { MustDiffer } from 'src/app/commons/helpers/must-different.validator';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { SharedService } from 'src/app/commons/service/shared.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { StatusSetting } from 'src/app/commons/setting/status_setting';
import { PopupComponent } from 'src/app/shared/popup/popup.component';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import * as moment from 'moment';
import { Moment } from 'moment';
import { StarRatingColor } from '../star-rating/star-rating.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-non-carrier-new-edit-review',
  templateUrl: './non-carrier-new-edit-review.component.html',
  styleUrls: ['./non-carrier-new-edit-review.component.css'],
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class NonCarrierNewEditReviewComponent {
  public selectedMonth: any = [
    {
      'count': '01',
      'month': 'January'
    },
    {
      'count': '02',
      'month': 'February'
    },
    {
      'count': '03',
      'month': 'March'
    },
    {
      'count': '04',
      'month': 'April'
    },
    {
      'count': '05',
      'month': 'May'
    },
    {
      'count': '06',
      'month': 'June'
    },
    {
      'count': '07',
      'month': 'July'
    },
    {
      'count': '08',
      'month': 'August'
    },
    {
      'count': '09',
      'month': 'September'
    },
    {
      'count': '10',
      'month': 'October'
    },
    {
      'count': '11',
      'month': 'November'
    },
    {
      'count': '12',
      'month': 'December'
    },
    // {'count' : 10,
    //   'month':'October'
    // },
    // {'count' : 10,
    //   'month':'October'
    // },
  ]
  public anonymous: any;
  public offerReference: any;
  public relatedToCarrier: any;
  public isConsiderNextTime: any;
  public likeToReceiveUpdate: any




  public showAllLanes: boolean = false;
  public showReviewLanes: boolean = false;
  public timeLinaRating: any;
  public shipmentTypeValue: any = [];
  public carrierDiscoveryTypeSelected: any = [];
  public carrierDiscoveryValues: any = [];
  public laneReviewData: any = [];
  public openLaneFeild: boolean = false
  public loaderSearchTo: any;
  public cityRegion: any;
  public imgURL: any
  public loaderSearchFrom: any;
  public srcPrtBox = "";
  public laneListID: any;
  public selectCarrierData: any = []
  public stateToStateId: any;
  public stateID: any;
  public regionListlength: any;
  public regionListGroup: any;
  public regionsList: any = [];
  public regionCity: any;
  public emtpyData = false;
  public loaderSearch: boolean = false;
  public carrierData: any = [];
  public cityData: any = [];
  public laneDataShow: any = [];
  public regionData: any;
  public laneList: any;
  public profileImage: any
  public laneCity_one: any;
  public laneCity_two: any;
  public selectRegionForm: FormGroup;
  public lanecity: any;
  public selectedCity: any = []
  public keyPointIDS: any;
  public newKeyPoints: any;
  public loading: boolean = false;
  public checkedShipmentTypes: any
  public editLanesForm: FormGroup;
  public editReviewForm: any;
  public skeletonLoader: boolean = false;
  public selectedCargoId: any;
  public submitted: boolean = false;
  public dotNumber: any;
  public shipmentTypes: any;
  public removeCarrierData: any;
  public equipmemtTypes: any = []
  public selectEquipmentValue = [];
  public selectCargoTypeValue: any = [];
  public checkedhowOftenType: any
  public checkedConsiderExpensive: any;
  public selectShipmentTypesValue: any = [];
  public selectSpecializedServices: any = [];
  public considerExpensiveRate: any = [];
  public whatWentPoorlySelected: any = []
  public selectConsiderExpensiveRate: any = [];
  public checkedEquipmentType: any;
  public howOftens: any = [];
  public laneData: any = []
  public checkValue = true;
  public laneRegionData: any
  public getReview: any;
  public laneRegion: any;
  public cargotype: any;
  public electronicValue: any = [];
  public specializedServices: any = [];
  public whatWentWellDataSelected: any = [];
  public considerExpensiveTypeSelected: any = []
  public laneListData: any;
  public editReviewList: any = [];
  public totalPage = 5;
  public averageRating: any;
  public keyValues: any
  public submittedLanes = false;
  public reviewSelected = [];
  public shipmentTypesSelected: any = [];
  public equipmemtTypeSelected: any = [];
  public specializedServiceSelected: any = []
  public reviewSelectedName = [];
  public reviewSelectedNameShow: any;
  public whatWentWellData: any = [];
  public selectWhatWentWellValue: any = [];
  public whatWentPoorly: any = [];
  public selectWhatWentPoorlyValue: any = [];
  date = new FormControl(moment());
  dates = new FormControl(moment());
  rating: number;
  public addverificationSS: boolean = false;
  starCount: number = 5;
  starColor: StarRatingColor = StarRatingColor.accent;
  starColorP: StarRatingColor = StarRatingColor.primary;
  starColorW: StarRatingColor = StarRatingColor.warn;
  count = 0;
  maxDate = new Date();
  minDate = new Date();

  public value: any




  // AI-REVIEW START
  public dropdownOpen = false;
  public considerExpensiveName: string = ''
  public remainingResponse: any;
  public enableDisable: Boolean = false;
  public isUserGenerate: boolean = true;
  public description: string = '';
  public generatedMessage: string = ''
  typingSpeed: number = 150;
  public messages: any = []
  public isSendMessage: boolean = false;
  public looping: boolean = false;
  public AiMessage: any;
  public newInstructions: any;
  public newMessage: any = [];
  public showEditAbleButton: boolean = false;
  public selectEquipmentName: any = [];
  public selectWhatWentWellName: any = [];
  public selectWhatWentPoorlyName: any = [];
  public improvewriting: boolean = false;
  public changeTone: boolean = false;
  public translateInto: boolean = false;
  public newMessagePrompt: any;
  public reviewAIResponse: string = '';
  public instructionType: any;
  public userInstructions: any = [];
  public AIInstructions: any;
  public isButtonDisabled: boolean = true;
  public profileImageName: any;

  // AI-REVIEW END
  public errrorMessage: any

  public responseErrror: any;
  public lengthError = false;


  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    public alertService: AlertService,
    private route: ActivatedRoute,
    private sharedService: SharedService,

    public dialog: MatDialog,) {
  }

  ngOnInit(): void {
    this.maxDate.setMonth(this.maxDate.getMonth() + 1);
    this.minDate.setFullYear(this.minDate.getFullYear() - 5);

    this.dotNumber = this.route.snapshot['queryParams']?.dotNumber
    this.timeLinaRating = StatusSetting.timeLinaRating;
    this.getUserProfile();
    this.getLaneRegion();
    this.getLaneList();
    this.skeletonLoader = true;
    this.editLanesForm = this.formBuilder.group({
      fromStateId: ['', [Validators.required]],
      fromCityId: ['', [Validators.required]],
      toStateId: ['', [Validators.required]],
      toCityId: ['', [Validators.required]],
    },
      {
        validators: [
          MustDiffer('fromStateId', 'toStateId'),
        ],
      },
    );

    this.editReviewForm = this.formBuilder.group({
      rating: ['', [Validators.required]],
      rateForTimeliness: ['', [Validators.required]],
      rateForCleanliness: ['', [Validators.required]],
      rateForCommunication: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.maxLength(64)]],
      review: ['', [Validators.required,]],
      cargoTypesIds: ['', [Validators.required]],
      equipmentTypesIds: ['', Validators.required],
      tracking: ['', [Validators.required]],
      lanes: ['', [Validators.required]],
      providerDetails: ['', Validators.maxLength(64)],
      shipmentTypes: ['', Validators.required],
      lastWorkedWithMonth: [, Validators.required],
      lastWorkedWithYear: [, Validators.required],
      howOften: ['', Validators.required],
      specializedServices: ['',],
      anonymous: ['', Validators.required],
      offerReference: ['', Validators.required],
      relatedToCarrier: ['', Validators.required],
      isConsiderNextTime: ['', Validators.required],
      considerExpensive: ['', Validators.required],
      carrierDiscovery: [null],
      whatWentPoorly: ['', Validators.required],
      whatWentWell: ['', Validators.required],
      verificationScreenshot: ['',],
      likeToReceiveUpdate: [null],


    });

    let configValue = this.sharedService.getConfig();
    if (configValue !== undefined) {
      this.getConfigSet(configValue);
    }
    this.commonService.configData.subscribe((userData) => {
    if (configValue == undefined) {
      this.getConfigSet(userData);
    }
    });

    this.getReviewData();

  }


  getConfigSet(configValue: any) {
    this.cargotype = configValue?.cargoTypes;
    this.shipmentTypes = configValue?.shipmentTypes;
    this.equipmemtTypes = configValue?.equipmentTypes;
    this.considerExpensiveRate = configValue?.considerExpensive;
    this.specializedServices = configValue?.specializedServices;
    this.howOftens = configValue?.howOften;
    this.whatWentPoorly = configValue?.whatWentPoorly;
    this.whatWentWellData = configValue?.whatWentWell;
    this.carrierDiscoveryValues = configValue?.carrierDiscovery;
  }

  getLaneList() {
    let uri = null;
    let newParams = {
    };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.LaneRegions.LIST,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.laneListData = ServerRes.response;
      }
    });
  }


  getReviewData() {
    this.skeletonLoader = true;
    let uri = null;
    let APIparams, params;
    params = { reviewId: this.route.snapshot.params['Id'] };
    if (params) uri = this.commonService.getAPIUriFromParams(params);
    APIparams = {
      apiKey: AppSettings.APIsNameArray.REVIEW.GETREVIEW,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        if (ServerRes.response.review) {
          this.getReview = ServerRes.response;
          this.totalPage = ServerRes.response.totalPages;
          this.averageRating = Math.round(this.getReview.carrier.averageRating)
          this.description = this.getReview.review;

          if (this.getReview && this.getReview.keyPoints) {
            for (let keyData of this.getReview.keyPoints) {
              this.keyValues = keyData
            }
          }
          this.getValueForm();
          this.skeletonLoader = false;
        } else {
          this.getReview = ServerRes.response;
          this.totalPage = 0;
          this.skeletonLoader = false;
        }
      } else {
        this.getReview = ''
        this.totalPage = 0;
        this.skeletonLoader = false;
      }
    }, (error) => {
      this.getReview = ''
      this.totalPage = 0;
      this.alertService.showNotificationMessage(
        'danger',
        'bottom',
        'left',
        'txt_g',
        'error',
        'Unexpected Error',
        AppSettings.ERROR
      );
      this.skeletonLoader = false;
    });
  }


  getValueForm() {
    if (this.getReview) {
      this.rating = this.getReview?.rating
      for (let index = 0; index < this.cargotype?.length; index++) {
        for (let subIndex = 0; subIndex < this.getReview.cargoType?.length; subIndex++) {

          if (this.getReview.cargoType[subIndex].cargoTypeId == this.cargotype[index].id) {
            this.reviewSelected.push(this.cargotype[index].id);
            this.reviewSelectedName.push(this.cargotype[index].name);
          }
        }
      }
      //shipmentType
      for (let index = 0; index < this.shipmentTypes?.length; index++) {
        for (let subIndex = 0; subIndex < this.getReview.shipmentTypes?.length; subIndex++) {
          if (this.getReview.shipmentTypes[subIndex].shipmentTypeId == this.shipmentTypes[index].id) {
            this.shipmentTypesSelected.push(this.shipmentTypes[index].id);
            this.reviewSelectedName.push(this.shipmentTypes[index].name);
          }
        }
      }

      // // equipmenttype  
      for (let index = 0; index < this.equipmemtTypes?.length; index++) {
        for (let subIndex = 0; subIndex < this.getReview.equipmentTypes?.length; subIndex++) {

          if (this.getReview.equipmentTypes[subIndex].equipmentTypeId == this.equipmemtTypes[index].id) {
            this.equipmemtTypeSelected.push(this.equipmemtTypes[index].id);
            this.reviewSelectedName.push(this.equipmemtTypes[index].name);
          }
        }
      }
      // specializedServices
      for (let index = 0; index < this.specializedServices?.length; index++) {
        for (let subIndex = 0; subIndex < this.getReview.specializedServicesType?.length; subIndex++) {
          if (this.getReview.specializedServicesType[subIndex].specializedServicesTypeId == this.specializedServices[index].id) {
            this.specializedServiceSelected.push(this.specializedServices[index].id);
            this.reviewSelectedName.push(this.specializedServices[index].name);
          }
        }
      }
      // whatWentPoorly
      for (let index = 0; index < this.whatWentPoorly?.length; index++) {
        for (let subIndex = 0; subIndex < this.getReview.whatWentPoorlyType?.length; subIndex++) {

          if (this.getReview.whatWentPoorlyType[subIndex].whatWentPoorlyTypeId == this.whatWentPoorly[index].id) {
            this.whatWentPoorlySelected.push(this.whatWentPoorly[index].id);
            this.reviewSelectedName.push(this.whatWentPoorly[index].name);
          }
        }
      }

      // whatWentWell
      for (let index = 0; index < this.whatWentWellData?.length; index++) {
        for (let subIndex = 0; subIndex < this.getReview.whatWentWellType?.length; subIndex++) {
          if (this.getReview.whatWentWellType[subIndex].whatWentWellTypeId == this.whatWentWellData[index].id) {
            this.whatWentWellDataSelected.push(this.whatWentWellData[index].id);
            this.reviewSelectedName.push(this.whatWentWellData[index].name);
          }
        }
      }

      // considerExpensive
      for (let index = 0; index < this.considerExpensiveRate?.length; index++) {
        for (let subIndex = 0; subIndex < this.getReview.considerExpensiveType?.length; subIndex++) {

          if (this.getReview.considerExpensiveType[subIndex].considerExpensiveTypeId == this.considerExpensiveRate[index].id) {
            this.considerExpensiveTypeSelected.push(this.considerExpensiveRate[index].id);
            this.checkedConsiderExpensive = this.considerExpensiveRate[index].id
            this.reviewSelectedName.push(this.considerExpensiveRate[index].name);
          }
        }
      }
      // lanes
      this.laneReviewData = this.getReview?.lane?.map(item => ({
        "fromCityId": item.fromCityId.toString(),
        "fromStateId": item.fromStateId.toString(),
        "toCityId": item.toCityId.toString(),
        "toStateId": item.toStateId.toString()
      }));
      let matMonth = this.getReview?.lastWorkedWithMonth;
      let matYear = this.getReview?.lastWorkedWithYear;
      let dates;
      for (let month of this.selectedMonth) {
        if (month.month == matMonth) {
          dates = matYear + '-' + month.count
          this.date = new FormControl(dates)
        }
      }

      this.editReviewForm.get("lanes").setValue(this.laneDataShow);
      this.anonymous = this.getReview?.anonymous;
      this.offerReference = this.getReview?.offerReference;
      this.relatedToCarrier = this.getReview?.relatedToCarrier;
      this.isConsiderNextTime = this.getReview?.isConsiderNextTime;
      this.likeToReceiveUpdate = this.getReview?.likeToReceiveUpdate
      this.editReviewForm = this.formBuilder.group({
        rating: [this.getReview?.rating ? this.getReview?.rating : '', [Validators.required]],
        rateForTimeliness: [this.getReview?.rateForTimeliness ? this.getReview?.rateForTimeliness : '', [Validators.required]],
        rateForCleanliness: [this.getReview ? this.getReview?.rateForCleanliness : '', [Validators.required]],
        rateForCommunication: [this.getReview ? this.getReview?.rateForCommunication : '', [Validators.required]],
        title: [this.getReview?.title ? this.getReview?.title : '', [Validators.required, Validators.maxLength(64)]],
        review: [this.getReview?.review ? this.getReview?.review : '', [Validators.required,]],
        cargoTypesIds: [this.reviewSelected ? this.reviewSelected : '', [Validators.required]],
        equipmentTypesIds: [this.equipmemtTypeSelected ? this.equipmemtTypeSelected : '', Validators.required],
        tracking: [this.getReview ? this.getReview?.tracking : '', [Validators.required]],
        lanes: [this.laneReviewData ? this.laneReviewData : '', [Validators.required]],
        providerDetails: [this.getReview ? this.getReview?.providerDetails : '', [Validators.maxLength(64)]],
        shipmentTypes: [this.shipmentTypesSelected ? this.shipmentTypesSelected : '', [Validators.required]],
        lastWorkedWithMonth: [this.getReview?.lastWorkedWithMonth ? this.getReview?.lastWorkedWithMonth : '', Validators.required],
        lastWorkedWithYear: [this.getReview?.lastWorkedWithYear ? this.getReview?.lastWorkedWithYear : '', Validators.required],
        howOften: [this.getReview?.howOftenType?.howOftenTypeId ? this.getReview?.howOftenType?.howOftenTypeId : '', Validators.required],
        specializedServices: [this.specializedServiceSelected ? this.specializedServiceSelected : ''],
        anonymous: [this.anonymous ? this.anonymous : false, Validators.required],
        offerReference: [this.getReview?.offerReference ? this.getReview?.offerReference : false, Validators.required],
        relatedToCarrier: [this.getReview?.relatedToCarrier ? this.getReview?.relatedToCarrier : false, Validators.required],
        isConsiderNextTime: [this.getReview ? this.getReview?.isConsiderNextTime : '', Validators.required],
        considerExpensive: [this.getReview?.considerExpensiveType ? this.getReview?.considerExpensiveType?.considerExpensiveTypeId : '', Validators.required],
        carrierDiscovery: [this.getReview?.carrierDiscoveryType ? this.getReview?.carrierDiscoveryType?.carrierDiscoveryTypeId : null,],
        likeToReceiveUpdate: [this.getReview?.likeToReceiveUpdate ? this.getReview?.likeToReceiveUpdate : null],
        whatWentPoorly: [this.whatWentPoorlySelected ? this.whatWentPoorlySelected : '', Validators.required],
        whatWentWell: [this.whatWentWellDataSelected ? this.whatWentWellDataSelected : '', Validators.required],
        verificationScreenshot: [this.getReview?.verificationScreenshot ? this.getReview?.verificationScreenshot : ''],
      });
    }
  }

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }
  isIdMatching(id) {
    if (this.getReview.cargoType?.length > 0) {
      return this.getReview.cargoType?.findIndex(item => item.cargoTypeId === id) !== -1;
    }
  }
  isMatchEquipment(id) {
    if (this.getReview.equipmentTypes?.length > 0) {
      return this.getReview.equipmentTypes?.findIndex(item => item.equipmentTypeId === id) !== -1;
    }
  }
  isMatchShipmentType(id) {
    if (this.getReview.shipmentTypes?.length > 0) {
      return this.getReview.shipmentTypes.findIndex(item => item.shipmentTypeId === id) !== -1;
    }

  }

  isSpecializedServicesType(id) {
    if (this.getReview.specializedServicesType?.length > 0) {
      return this.getReview.specializedServicesType.findIndex(item => item.specializedServicesTypeId === id) !== -1;
    }
  }
  isMatchingHowOftenType(id) {
    if (this.getReview.howOftenType?.length > 0) {
      return this.getReview.howOftenType.findIndex(item => item.howOftenTypeId === id) !== -1;
    }

  }

  isMatchingWhatWentPoorly(id) {
    if (this.getReview.whatWentPoorlyType?.length > 0) {
      return this.getReview.whatWentPoorlyType.findIndex(item => item.whatWentPoorlyTypeId === id) !== -1;
    }

  }
  isMatchingWentWell(id) {
    if (this.getReview.whatWentWellType?.length > 0) {
      return this.getReview.whatWentWellType.findIndex(item => item.whatWentWellTypeId === id) !== -1;
    }

  }

  // submit 
  submitReview({ value, valid }) {
    this.submitted = true;
    let array: any = [1, 2, 3]
    var formData = new FormData();
    // this.someFormData()
    let equipmentIds: any = [];
    let merzeLanes: any = []
    let merzeArray: any = [];
    let cargoArray: any = [];
    let whatWentArray: any = [];
    let whatPoorlyArray: any = [];
    let equipmentArray: any = [];
    let spesilizedArray: any = [];
    merzeArray = this.selectShipmentTypesValue;
    cargoArray = this.selectCargoTypeValue;
    whatPoorlyArray = this.selectWhatWentPoorlyValue;
    whatWentArray = this.selectWhatWentWellValue;
    equipmentArray = this.selectEquipmentValue;
    spesilizedArray = this.selectSpecializedServices;
    if (merzeArray?.length > 0 && this.editReviewForm.get('shipmentTypes').value) {
      let shipmentTypeValue = (merzeArray).concat(this.shipmentTypesSelected)?.sort()
      this.editReviewForm.get('shipmentTypes').setValue(shipmentTypeValue)

    }
    if (cargoArray?.length > 0 && this.editReviewForm.get('cargoTypesIds').value) {
      this.editReviewForm.get('cargoTypesIds').setValue(cargoArray.concat(this.reviewSelected))
    }
    if (whatWentArray?.length > 0 && this.editReviewForm.get('whatWentWell').value) {
      this.editReviewForm.get('whatWentWell').setValue(whatWentArray.concat(this.whatWentWellDataSelected))
    }
    if (whatPoorlyArray?.length > 0 && this.editReviewForm.get('whatWentPoorly').value) {
      this.editReviewForm.get('whatWentPoorly').setValue(whatPoorlyArray.concat(this.whatWentPoorlySelected))
    }
    if (equipmentArray?.length > 0 && this.editReviewForm.get('equipmentTypesIds').value) {
      this.editReviewForm.get('equipmentTypesIds').setValue(equipmentArray.concat(this.equipmemtTypeSelected))
      equipmentIds = (equipmentArray.concat(this.equipmemtTypeSelected))
    }
    if (spesilizedArray?.length > 0 && this.editReviewForm.get('specializedServices').value) {
      this.editReviewForm.get('specializedServices').setValue(spesilizedArray.concat(this.specializedServiceSelected))
    }
    this.editReviewForm?.get('anonymous').setValue(this.getReview?.anonymous);
    this.editReviewForm?.get('offerReference').setValue(this.getReview?.offerReference);
    this.editReviewForm?.get('relatedToCarrier').setValue(this.getReview?.relatedToCarrier);
    this.editReviewForm?.get('isConsiderNextTime').setValue(this.getReview?.isConsiderNextTime);
    if (value.likeToReceiveUpdate !== undefined && value.likeToReceiveUpdate !== null) {

      this.editReviewForm?.get('likeToReceiveUpdate').setValue(this.getReview?.likeToReceiveUpdate);
    }
    if (this.laneData?.length > 0) {
      merzeLanes = this.laneData.concat(this.laneReviewData)
    }
    this.editReviewForm.get('lanes').setValue(this.getReview?.lane)
    if (valid) {

      this.loading = true;
      formData.append('rating', this.rating.toString())
      formData.append('title', value.title)
      if (this.profileImage) {
        formData.append('verificationScreenshot', value.verificationScreenshot)
      }
      else {
        formData.append('verificationScreenshot', value.verificationScreenshot)

      }
      if (value.carrierDiscovery !== undefined && value.carrierDiscovery !== null) {

        formData.append('carrierDiscovery', value.carrierDiscovery)
      }
      formData.append('tracking', value.tracking);
      if (merzeLanes?.length > 0) {
        formData.append('lane', JSON.stringify(merzeLanes));
      }
      else {
        formData.append('lane', JSON.stringify(this.laneReviewData));
      }



      formData.append('howOften', value.howOften)
      formData.append('review', this.description)
      formData.append('providerDetails', value.providerDetails)
      formData.append('carrierId', this.selectCarrierData.id)
      formData.append('rateForCommunication', value.rateForCommunication)
      formData.append('rateForCleanliness', value.rateForCleanliness)
      formData.append('rateForTimeliness', value.rateForTimeliness)
      formData.append('lastWorkedWithMonth', value.lastWorkedWithMonth)
      formData.append('lastWorkedWithYear', value.lastWorkedWithYear)
      formData.append('id', this.route.snapshot['params']?.Id);
      formData.append('anonymous', this.anonymous);
      formData.append('offerReference', this.offerReference);
      formData.append('relatedToCarrier', this.relatedToCarrier);
      formData.append('isConsiderNextTime', this.isConsiderNextTime);
      if (value.likeToReceiveUpdate !== undefined && value.likeToReceiveUpdate !== null) {

        formData.append('likeToReceiveUpdate', value.likeToReceiveUpdate);
      }
      formData.append('considerExpensive', value.considerExpensive);
      formData.append('equipmentTypesIds', JSON.stringify(Object.values(value.equipmentTypesIds)?.map(value => value.toString())));
      formData.append('whatWentWell', JSON.stringify(Object.values(value.whatWentWell)?.map(value => value.toString())));
      formData.append('whatWentPoorly', JSON.stringify(Object.values(value.whatWentPoorly)?.map(value => value.toString())));
      formData.append('cargoTypesIds', JSON.stringify(Object.values(value.cargoTypesIds)?.map(value => value.toString())));
      formData.append('shipmentTypes', JSON.stringify(Object.values(value.shipmentTypes)?.map(value => value.toString())))
      formData.append('specializedServices', JSON.stringify(Object.values(value.specializedServices)?.map(value => value.toString())));

      let APIparams = {

        apiKey: AppSettings.APIsNameArray.REVIEW.EDITUPDATE,
        uri: '',
        postBody: formData,
      };



      this.commonService.put(APIparams).subscribe(

        (success) => {

          this.loading = false;
          if (success.success === true) {
            const dialogRef = this.dialog.open(PopupComponent, {
              disableClose: true,
              // backdropClass: AppSettings.backdropClass,
              backdropClass: 'cn_custom_popup',
              width: AppSettings.popWidth,
              data: { openPop: 'submitReview' },
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result.event === 'ok') {
              }
            });
          } else if (success.success === false) {

            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'Review',
              'You have not successfully Updated Review.'
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
        });
    }
  }

  // lane submit part
  onReset() {
    this.submitted = false;
    this.editLanesForm.reset();
  }

  laneSubmit({ value, valid }) {
    this.submittedLanes = true
    let cityIdTo: any;
    let cityIdFrom: any;
    let stateNameFrom: any;
    let stateNameTo: any;
    let stateCodeFrom: any;
    let stateCodeTo: any;
    if (valid) {
      for (let fromStateId of this.laneRegion?.state) {
        if (fromStateId.id == value.fromStateId) {
          stateNameFrom = fromStateId.name;
          stateCodeFrom = fromStateId.code;
        }
      }
      for (let toStateId of this.laneRegion?.state) {
        if (toStateId.id == value.toStateId) {
          stateNameTo = toStateId.name;
          stateCodeTo = toStateId.code;
        }
      }
      for (let fromCityId of this.laneCity_one?.city) {
        if (fromCityId.name == value.fromCityId) {
          cityIdFrom = fromCityId.id;
        }
      }

      for (let toCityId of this.laneCity_two?.city) {
        if (toCityId.name == value.toCityId) {
          cityIdTo = toCityId.id;
        }
      }

      let showData = {
        'toStateId': value.toStateId, 'toStateName': stateNameTo, 'toStateCode': stateCodeTo, 'fromStateId': value.fromStateId, 'fromStateName': stateNameFrom, 'fromStateCode': stateCodeFrom,
        'toCityId': cityIdTo, 'toCityName': value.toCityId, 'fromCityId': cityIdFrom, 'fromCityName': value.fromCityId
      };
      this.laneDataShow.push(showData);
      let makeData = { 'toStateId': value.toStateId, 'fromStateId': value.fromStateId, 'toCityId': cityIdTo, 'fromCityId': cityIdFrom };
      this.laneData.push(makeData);
      this.laneData = [{
        "fromCityId": makeData.fromCityId.toString(),
        "fromStateId": makeData.fromStateId.toString(),
        "toCityId": makeData.toCityId.toString(),
        "toStateId": makeData.toStateId.toString()
      }];
      this.onReset();
      this.openLaneFeild = false;
      this.editReviewForm.get("lanes").setValue(this.laneDataShow);
    }

  }

  selectPickLaneRegions($event) {
    this.stateID = $event.value;
    this.getLaneCity();
    if ($event.value) {
      this.editLanesForm.get("fromCityId").setValue(this.lanecity?.name);
    } else {
      this.editLanesForm.get("fromCityId").setValue("");
    }
  }

  selectPickLanes($event) {
    this.stateToStateId = $event.value;
    this.getLaneRegionCity();
    if ($event.value) {
      this.editLanesForm.get("toCityId").setValue(this.cityRegion?.name);
    } else {
      this.editLanesForm.get("toCityId").setValue("");
    }
  }



  getAPIInParamTo(searchStr) {
    let APIparams, params;
    if (searchStr) params = { stateId: this.stateToStateId, search: searchStr };
    else params = { limit: 5 };
    APIparams = {
      apiKey: AppSettings.APIsNameArray.LaneRegions.CITY,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }
  searchRecordTo(searchStr: any) {
    var APIparams = this.getAPIInParamTo(searchStr);
    this.commonService.getList(APIparams).subscribe((ServerResult) => {
      this.loaderSearchTo = false;

      if (ServerResult.success === true) {
        this.laneCity_two = ServerResult.response;
      }
    });
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
        this.laneRegion = ServerRes.response;
      }
      else {
        this.laneRegion = []
      }
    });
  }

  getLaneRegionCity() {
    let uri = null;
    let newParams = {
      'stateId': this.stateToStateId
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.LaneRegions.CITY,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerResult) => {
      if (ServerResult.success === true) {
        this.laneCity_two = ServerResult.response;
      }
      else {
        this.laneCity_two = [];
      }
    });
  }

  getLaneCity() {
    let uri = null;
    let newParams = {
      'stateId': this.stateID
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.LaneRegions.CITY,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerResult) => {
      if (ServerResult.success === true) {
        this.laneCity_one = ServerResult.response;
      } else {
        this.laneCity_one = [];
      }

    });
  }

  // seleted checkbox
  onEquipmentCheckboxChange(event: MatCheckboxChange, id: any, index: any) {
    let equipmentData: any
    if (event.checked) {
      // Pushing the object into array
      this.selectEquipmentValue.push(id);
      let selectEquipmentValue = (this.selectEquipmentValue).concat(this.equipmemtTypeSelected)?.sort()

      this.editReviewForm.get('equipmentTypesIds').setValue(selectEquipmentValue)

    } else {
      let selectEquipmentData = this.selectEquipmentValue.find(item => item === id);
      if (this.getReview?.equipmentTypes?.length > 0) {
        equipmentData = this.equipmemtTypeSelected.find(item => item === id);
      }
      if (selectEquipmentData) {
        this.selectEquipmentValue.splice(this.selectEquipmentValue.indexOf(selectEquipmentData), 1);
      let selectEquipmentValue = (this.selectEquipmentValue).concat(this.equipmemtTypeSelected)?.sort()

      this.editReviewForm.get('equipmentTypesIds').setValue(selectEquipmentValue)
    }
      if (this.getReview?.equipmentTypes?.length > 0 && equipmentData !==undefined ) {
        this.equipmemtTypeSelected.splice(this.equipmemtTypeSelected.indexOf(equipmentData), 1);
      let selectEquipmentValue = (this.selectEquipmentValue).concat(this.equipmemtTypeSelected)?.sort()

      // this.editReviewForm.get('equipmentTypesIds').setValue(this.equipmemtTypeSelected)
      this.editReviewForm.get('equipmentTypesIds').setValue(selectEquipmentValue)

    }
    }
  }

  onCargoTypeCheckboxChange(event: MatCheckboxChange, id: any, index: any) {
    // Event contains information about the checkbox state
    let cargoData: any;
    if (event.checked) {
      // Pushing the object into array
      this.selectCargoTypeValue.push(id);
      let selectCargoTypeValue = (this.selectCargoTypeValue).concat(this.reviewSelected)?.sort()

      this.editReviewForm.get('cargoTypesIds').setValue(selectCargoTypeValue)

    } else {
      let selectCargoData = this.selectCargoTypeValue.find(item => item === id);
      if (this.getReview?.cargoType?.length > 0) {
        cargoData = this.reviewSelected.find(item => item === id);
      }


      if (selectCargoData) {
        this.selectCargoTypeValue.splice(this.selectCargoTypeValue.indexOf(selectCargoData), 1);
      let selectCargoTypeValue = (this.selectCargoTypeValue).concat(this.reviewSelected)?.sort()

      this.editReviewForm.get('cargoTypesIds').setValue(selectCargoTypeValue)
    }
      if (this.getReview?.cargoType?.length > 0 && cargoData) {
        this.reviewSelected.splice(this.reviewSelected.indexOf(cargoData), 1);
      // this.editReviewForm.get('cargoTypesIds').setValue(this.reviewSelected)
      let selectCargoTypeValue = (this.selectCargoTypeValue).concat(this.reviewSelected)?.sort()

      this.editReviewForm.get('cargoTypesIds').setValue(selectCargoTypeValue)

    }

    }
  }

  whatWentPoorlyCheckboxChange(event: MatCheckboxChange, id: any, index: any) {
    let whatWentPoorlyFormData: any
    if (event.checked) {
      // Pushing the object into array
      this.selectWhatWentPoorlyValue.push(id);
      let whatWentPoorlyValue = (this.selectWhatWentPoorlyValue).concat(this.whatWentPoorlySelected)?.sort()

      this.editReviewForm.get('whatWentPoorly').setValue(whatWentPoorlyValue)

    } else {
      let whatWentData = this.selectWhatWentPoorlyValue.find(itm => itm === id);
      if (this.getReview?.whatWentPoorlyType?.length > 0) {
        whatWentPoorlyFormData = this.whatWentPoorlySelected.find(item => item === id);
      }
      if (whatWentData) {
        this.selectWhatWentPoorlyValue.splice(this.selectWhatWentPoorlyValue.indexOf(whatWentData), 1);
      let whatWentPoorlyValue = (this.selectWhatWentPoorlyValue).concat(this.whatWentPoorlySelected)?.sort()

        this.editReviewForm.get('whatWentPoorly').setValue(whatWentPoorlyValue)

      }
      if (this.getReview?.whatWentPoorlyType?.length > 0 && whatWentPoorlyFormData ) {
        this.whatWentPoorlySelected.splice(this.whatWentPoorlySelected.indexOf(whatWentPoorlyFormData), 1);
        // this.editReviewForm.get('whatWentPoorly').setValue(this.whatWentPoorlySelected)
      let whatWentPoorlyValue = (this.selectWhatWentPoorlyValue).concat(this.whatWentPoorlySelected)?.sort()

      this.editReviewForm.get('whatWentPoorly').setValue(whatWentPoorlyValue)


      }
    }
  }

  whatWentWellCheckboxChange(event: MatCheckboxChange, id: any, index: any) {
    // Event contains information about the checkbox state
    let whatWentFormData: any
    if (event.checked) {
      // Pushing the object into array
      this.selectWhatWentWellValue.push(id);
      let whatWentFormValue = (this.selectWhatWentWellValue).concat(this.whatWentWellDataSelected)?.sort()

      this.editReviewForm.get('whatWentWell').setValue(whatWentFormValue)
    } else {
      let selectWhatWentWellData = this.selectWhatWentWellValue?.find(itm => itm === id);
      if (this.getReview?.whatWentWellType?.length > 0) {
        whatWentFormData = this.whatWentWellDataSelected?.find(item => item === id);
      }

      if (selectWhatWentWellData) {

        this.selectWhatWentWellValue?.splice(this.selectWhatWentWellValue?.indexOf(selectWhatWentWellData), 1);
      let whatWentFormValue = (this.selectWhatWentWellValue).concat(this.whatWentWellDataSelected)?.sort()

        this.editReviewForm.get('whatWentWell').setValue(whatWentFormValue)

      }
      if (this.getReview?.whatWentWellType?.length > 0 && whatWentFormData) {

        this.whatWentWellDataSelected?.splice(this.whatWentWellDataSelected?.indexOf(whatWentFormData), 1);
        // this.editReviewForm.get('whatWentWell').setValue(this.whatWentWellDataSelected)
      let whatWentFormValue = (this.selectWhatWentWellValue).concat(this.whatWentWellDataSelected)?.sort()

      this.editReviewForm.get('whatWentWell').setValue(whatWentFormValue)
      }
    }
  }

  onShipmentTypesChange(event: MatCheckboxChange, id: any, index: any) {
    let shipmentFormData: any;
    if (event.checked) {
      // Pushing the object into array
      this.selectShipmentTypesValue.push(id);
      let shipmentTypeValue = (this.selectShipmentTypesValue).concat(this.shipmentTypesSelected)?.sort()
      this.editReviewForm.get('shipmentTypes').setValue(shipmentTypeValue)
    } else {
      let shipmentData = this.selectShipmentTypesValue.find(itm => itm === id);
      if (this.getReview?.shipmentTypes?.length > 0) {
        shipmentFormData = this.shipmentTypesSelected.find(itm => itm === id);
      }

      if (shipmentData) {
        this.selectShipmentTypesValue.splice(this.selectShipmentTypesValue.indexOf(shipmentData), 1);
      let shipmentTypeValue = (this.selectShipmentTypesValue).concat(this.shipmentTypesSelected)?.sort()

      this.editReviewForm.get('shipmentTypes').setValue(shipmentTypeValue)

    }
      if (this.getReview?.shipmentTypes?.length > 0 && shipmentFormData ) {
        this.shipmentTypesSelected.splice(this.shipmentTypesSelected.indexOf(shipmentFormData), 1);
      // this.editReviewForm.get('shipmentTypes').setValue(this.shipmentTypesSelected)
      let shipmentTypeValue = (this.selectShipmentTypesValue).concat(this.shipmentTypesSelected)?.sort()

      this.editReviewForm.get('shipmentTypes').setValue(shipmentTypeValue)

    }

    }
  }

  onConsiderExpensiveRadioChange(event: MatRadioChange, id: any, index: any) {
    if (event.value == id) {
      this.editReviewForm.get('considerExpensive').setValue(id)
    }
  }



  onSpecializedCheckboxChange(event: MatCheckboxChange, id: any, index: any) {
    let specializedFormData: any
    if (event.checked) {
      // Pushing the object into array
      this.selectSpecializedServices.push(id);
      this.editReviewForm.get('specializedServices').setValue(this.selectSpecializedServices)

    } else {
      let specializedData = this.selectSpecializedServices.find(itm => itm === id);
      if (this.getReview.specializedServices?.length > 0) {
        specializedFormData = this.specializedServiceSelected.find(itm => itm === id);

      }
      if (specializedData) {
        this.selectSpecializedServices.splice(this.selectSpecializedServices.indexOf(specializedData), 1);
      }
      if (this.getReview.specializedServices?.length > 0) {
        this.specializedServiceSelected.splice(this.specializedServiceSelected.indexOf(specializedFormData), 1);
        
        this.editReviewForm.get('specializedServices').setValue(this.selectSpecializedServices)

      }
    }
  }


  onHowOftenRadioChange(event: MatRadioChange, id: any, index: any) {
    if (event.value == id) {
      this.editReviewForm.get('howOften').setValue(id)
    } else {
      if (index !== -1) {

      }
    }
  }
  findCarrier(event: any) {

  }

  searchUserTypeFrom(event: any) {
    this.srcPrtBox = "active_src_rslt";
    this.emtpyData = false;
    this.loaderSearchFrom = true;
    let searchStr = event.target.value;
    if (searchStr.length > 0) {
      this.searchRecordFrom(searchStr);
    } else {
      this.loaderSearchFrom = false;
    }
  }

  removeLane(index: any, listData: any) {
    this.laneListID = listData.id
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      // backdropClass: AppSettings.backdropClass,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: { openPop: 'laneConfirmation' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'ok') {
        // this.loading =false;
        this.getReview?.lane.splice(index, 1);
        this.leneDelete(listData?.id);
      }
    });
  }

  removeAddLane(index: any, listData: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: { openPop: 'laneConfirmation' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'ok') {
        this.laneDataShow.splice(index, 1);
        this.laneData.splice(index, 1);
      }
    });
  }

  getAPIInParamFrom(searchStr) {
    let APIparams, params;
    if (searchStr) params = { stateId: this.stateID, search: searchStr };
    else params = { limit: 5 };
    APIparams = {
      apiKey: AppSettings.APIsNameArray.LaneRegions.CITY,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }
  searchRecordFrom(searchStr: any) {
    var APIparams = this.getAPIInParamFrom(searchStr);
    this.commonService.getList(APIparams).subscribe((ServerResult) => {
      this.loaderSearchFrom = false;

      if (ServerResult.success === true) {
        this.laneCity_one = ServerResult.response;
      }
    });
  }
  searchUserTypeTo(event: any) {
    this.srcPrtBox = "active_src_rslt";
    this.emtpyData = false;
    this.loaderSearchTo = true;
    let searchStr = event.target.value;
    if (searchStr.length > 0) {
      this.searchRecordTo(searchStr);
    } else {
      this.loaderSearchTo = false;
    }
  }

  getUserProfile() {
    let uri = null;
    let newParams = { 'carrierId': localStorage.getItem('carrierEditId') };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.REVIEW.GETCARRIEREVIEW,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.selectCarrierData = ServerRes.response;
      }
    });
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.profileImage = file;
      this.profileImageName = file.name;
      const reader = new FileReader();
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      this.editReviewForm.get('verificationScreenshot').setValue(this.profileImage);
      if (this.profileImage) {
        this.addverificationSS = true
      }
    }
  }

  // carrier discovery

  selectCarrierDiscovery($event) {

  }

  // rating
  onRatingChanged(rating) {
    this.rating = rating;
  }

  addAnotherLane() {
    this.openLaneFeild = true;
  }

  leneDelete(laneID) {
    this.loading = true;
    let uri = null;
    let newParams = {
      'userLaneId': laneID
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.REVIEW.LANEDELETE,
      uri: uri,
    };
    this.commonService.delete(APIparams).subscribe(
      (success) => {
        this.loading = false;
        if (success.success === true) {
          // this.openLaneFeild=true
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            'Remove Lane',
            'You have successfully removed Lane.'
          );


        } else if (success.success === false) {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_d',
            'cancel',
            'Remove Lane',
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
        this.loading = false;
      }
    );
  }

  monthSelected(event, dp, input) {
    dp.close();
    input.value = event.toISOString().split('-').join('/').substr(0, 7);
    const [yearString, monthString] = input.value.split("/");
    const matYear = parseInt(yearString);
    const matMonth = parseInt(monthString);
    this.editReviewForm.get('lastWorkedWithYear').setValue(matYear)
    for (let i = 0; i < this.selectedMonth?.length; i++) {
      if (matMonth == this.selectedMonth[i].count) {
        this.editReviewForm.get('lastWorkedWithMonth').setValue(this.selectedMonth[i].month)
      }
    }
  }

  // date = new FormControl(moment());

  // setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
  //   const ctrlValue = normalizedMonthAndYear
  //   ctrlValue.month(normalizedMonthAndYear.month());
  //   ctrlValue.year(normalizedMonthAndYear.year());
  //   this.date.setValue(ctrlValue);
  //   datepicker.close();
  // }
  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, event: any) {
    const ctrlValue = this.dates.value;
    let matMonths = ctrlValue.month(normalizedMonthAndYear.month());
    let matYears = ctrlValue.year(normalizedMonthAndYear.year());
    let dateOfDate = matMonths._d?.toISOString()?.split('-')?.join('/')?.substr(0, 7)
    const [yearString, monthString] = dateOfDate?.split("/");
    const matMonth = parseInt(monthString);
    const matYear = parseInt(yearString);
    for (let i = 0; i < this.selectedMonth?.length; i++) {
      if (matMonth == this.selectedMonth[i].count) {
        this.editReviewForm.get('lastWorkedWithMonth').setValue(this.selectedMonth[i].month)
      }
    }
    this.editReviewForm.get('lastWorkedWithYear').setValue(matYear)

    this.date.setValue(ctrlValue);
    datepicker.close();
  }
  showMoreData(type) {
    if (type == 'lane') {
      this.showAllLanes = !this.showAllLanes
    }
    else if (type == 'review') {
      this.showReviewLanes = !this.showReviewLanes
    }

  }

  electronicTracing(event: MatRadioChange) {
    this.electronicValue = event.value;
    this.checkValidation(event.value);
  }

  checkValidation(value: any) {
    if (value == true) {
      this.editReviewForm.get('providerDetails').setValidators([Validators.required]);
      this.editReviewForm.get('providerDetails').updateValueAndValidity();
    } else {
      this.editReviewForm.get('providerDetails').clearValidators();
      this.editReviewForm.get('providerDetails').setValue('');
    }
  }


  isValueSelected(type): boolean {
    if (type == 'anonymous') {
      return this.anonymous !== undefined && this.anonymous !== null;
    }
    else if (type == 'relatedToCarrier') {
      return this.relatedToCarrier !== undefined && this.relatedToCarrier !== null;
    }
    else if (type == 'offerReference') {
      return this.offerReference !== undefined && this.offerReference !== null;
    }
    else if (type == 'isConsiderNextTime') {
      return this.isConsiderNextTime !== undefined && this.isConsiderNextTime !== null;
    }

  }
  // new way
  async displayResponseWordByWord(response: string) {
    this.looping = true;
    this.editReviewForm?.controls?.review?.setValue(response)
    const wordsArray = response.split(' ');
    for (let i = 0; i < wordsArray.length; i++) {
      // this.remainingResponse = wordsArray.slice(i + 1).join(' '); // Store remaining words
      this.messages.push({ role: 'assistant', content: wordsArray[i] });
      this.showEditAbleButton = true;
      await this.delay(this.typingSpeed); // Wait for typingSpeed milliseconds
      if (!this.looping) {
        break;
      }
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  // send action
  generateReview() {
    this.loading = true;
    let requestBody: any;
    if (this.AIInstructions == 'ai') {
      if (this.editReviewForm.controls?.title.status == 'VALID' && this.editReviewForm.controls?.rating.status == 'VALID' && this.editReviewForm.controls?.tracking.status == 'VALID' && this.editReviewForm.controls?.rateForTimeliness.status == 'VALID' && this.editReviewForm.controls?.rateForCleanliness.status == 'VALID' && this.editReviewForm.controls?.rateForCommunication.status == 'VALID' && this.editReviewForm.controls?.isConsiderNextTime.status == 'VALID' && this.editReviewForm.controls?.considerExpensive.status == 'VALID' && this.editReviewForm.controls?.whatWentPoorly.status == 'VALID'
        && this.editReviewForm.controls?.whatWentWell.status == 'VALID' && this.selectCarrierData.companyName) {
        this.loading = true;
        requestBody = {
          review: {
            "companyName": this.selectCarrierData.companyName,
            "countryCode": this.selectCarrierData.phyCountryCode ? this.selectCarrierData.phyCountryCode : 'US',
            "carrierId": this.selectCarrierData?.id,
            "title": this.editReviewForm.controls?.title.value,
            "rating": this.editReviewForm.controls?.rating.value,
            "tracking": this.editReviewForm.controls?.tracking.value,
            "rateForTimeliness": this.editReviewForm.controls?.rateForTimeliness.value,
            "rateForCleanliness": this.editReviewForm.controls?.rateForCleanliness.value,
            "rateForCommunication": this.editReviewForm.controls?.rateForCommunication.value,
            "isConsiderNextTime": this.editReviewForm.controls?.isConsiderNextTime.value,
            "considerExpensive": this.editReviewForm.controls?.considerExpensive.value,
            "whatWentPoorly": this.editReviewForm.controls?.whatWentPoorly.value,
            "whatWentWell": this.editReviewForm.controls?.whatWentWell.value
          },
          "type": 'ai',
        }
      }
      else {
        this.loading = false;
        const dialogRef = this.dialog.open(PopupComponent, {
          disableClose: true,
          backdropClass: 'cn_custom_popup',
          width: AppSettings.popWidth,
          data: { openPop: 'AIReviewPopUp' },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result.event === 'ok') {
          }
        });
      }
    }
    else {
      requestBody = {
        instructions: this.userInstructions.map(id => ({ id })),
        "prompt": this.description || this.newMessage
      };
    }
    if (requestBody) {
      let APIparams: any;
      APIparams = {
        apiKey: AppSettings.APIsNameArray.REVIEW.AI,
        uri: '',
        postBody: requestBody,
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {
          this.loading = false;
          if (success.success === true) {
            this.remainingResponse = success.response
            if (this.remainingResponse) {
              this.isUserGenerate = false;
              this.dropdownOpen = false;
              this.isSendMessage = false;
              this.enableDisable = true;
              this.improvewriting = false;
              this.changeTone = false;
              this.loading = false;
              this.messages = [];
              this.description = null;
              this.AIInstructions = null;
              this.displayResponseWordByWord(success.response);
            }
            this.errrorMessage = null
          }
          else if (success.success === false) {
            this.errrorMessage = null;
            this.responseErrror = success.message
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
        });
    }

  }

  generateText(text) {
    const object = {
      'Professional': 'tone_professional',
      'Helpful': 'tone_helpful',
      'Informative': 'tone_informative',
      'Friendly': 'tone_friendly',
      'AIGenerated-Review': 'ai',
      'Enter custom prompt': 'custom',
      'Summarize': 'summary',
      'Make more persuasive': 'tone_convincing',
      'Improve structure': 'improve_structure',
      'Rewrite': 'improve_rewrite',
      'Make it shorter': 'improve_shorter',
      'Make it longer': 'improve_longer',
      'Fix spelling and grammar': 'improve_spelling',
      'Generate based on summary': 'summary',
      'tryAgain': 'tryAgain'

    }
    return object[text]
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  sendInformation(instructions: any) {

    if (instructions == 'Enter custom prompt') {
      this.isSendMessage = true;
      this.dropdownOpen = false;
      this.improvewriting = true;
      this.changeTone = true;
      this.translateInto = true;
      this.description = null;
      this.AiMessage = null;
      this.messages = [];
      this.generatedMessage = null;
      this.showEditAbleButton = false;
      this.newMessagePrompt = null;
      this.newMessage = null
      let text = '';
      text = this.generateText(instructions);
      this.userInstructions.push(text)
    }
    else if (instructions == 'Generate based on summary') {
      this.isSendMessage = true;
      this.dropdownOpen = false;
      this.improvewriting = true;
      this.changeTone = true;
      this.translateInto = true;
      this.newMessage = instructions
      this.newInstructions = instructions
      let text = '';
      text = this.generateText(instructions);
      this.userInstructions.push(text)
    }
    else if (instructions == 'Fix spelling and grammar' || instructions == 'Make it longer' || instructions == 'Make it shorter' || instructions == 'Rewrite' || instructions == 'Improve structure' || instructions == 'Make more persuasive' || instructions == 'Summarize') {
      this.newMessage.push(instructions);
      if (this.newMessage.length > 1) {
        this.newMessage = this.newMessage.join(', ');
      }
      this.isSendMessage = true;
      this.improvewriting = true;
      this.dropdownOpen = false;
      this.showEditAbleButton = false;
      this.newInstructions = instructions
      let text = '';
      text = this.generateText(instructions);
      this.userInstructions.push(text);
    }
    else if (instructions == 'Informative' || instructions == 'Friendly' || instructions == 'Professional' || instructions == 'Helpful') {
      this.newMessage.push(instructions);
      if (this.newMessage.length > 1) {
        this.newMessage = this.newMessage.join(', ');
      } this.isSendMessage = true;
      this.dropdownOpen = false;
      this.changeTone = true;
      this.newInstructions = instructions
      this.showEditAbleButton = false;
      let text = '';
      text = this.generateText(instructions);
      this.userInstructions.push(text)
      // instructions !== undefined ? `${this.getUserInformation(instructions)}` : '';
    }
    else if (instructions == 'AIGenerated-Review') {
      let text = '';
      text = this.generateText(instructions);
      this.AIInstructions = text;
      this.generateReview()
    }
  }
  checkDecription(event: any) {
    if (event.target.value.trim() === '') return this.enableDisable = true;
  }
  userGenerated() {
    this.isUserGenerate = false;
    this.messages = [];
    this.newMessage = [];
    this.remainingResponse = [];
    this.isSendMessage = false;
    this.userInstructions = [];
  }
  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    if (clipboardData) {
      const pastedText = clipboardData.getData('text/plain');
      if (pastedText) {
        this.enableDisable = true;
        this.description = pastedText.trim();
        event.preventDefault();
      }
      event.preventDefault();
    }
  }
  checkTextarea(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    if (!target.value) {
      this.enableDisable = false;
      this.description = null;
      this.isButtonDisabled = true;
    }
    else {
      this.isButtonDisabled = false;
      this.editReviewForm?.controls?.review.setValue(target.value)
    }
    if (target.value.length > 1024) {
      this.lengthError = true;
    } else {
      this.lengthError = false;
    }
  }
  saveUserGenerated() {
    this.editReviewForm?.controls?.aboutCompany.setValue(this.description);
  }
  useGeneratedText() {
    this.description = this.remainingResponse;
    this.looping = false;
    this.messages = [];
    this.showEditAbleButton = false;
    this.AIInstructions = null;
    this.userInstructions = [];
    this.newMessage = []
    this.isButtonDisabled = false;
  }
  tryAgainGeneratedText(type) {
    this.looping = false;
    this.messages = [];
    this.userInstructions = [];
    this.showEditAbleButton = false;
    this.AIInstructions = type;
    let text = '';
    text = this.generateText(type);
    this.userInstructions.push(text);
    this.generateReview()
  }
  discardGeneratedText() {
    this.description = null;
    this.messages = [];
    this.changeTone = false;
    this.improvewriting = false;
    this.showEditAbleButton = false;
    this.looping = false;
    this.enableDisable = false;
    this.AIInstructions = null;
    this.userInstructions = [];
  }
}

