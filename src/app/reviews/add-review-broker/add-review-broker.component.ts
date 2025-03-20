import { Component, ElementRef, ViewChild, OnInit, Input, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PopupComponent } from 'src/app/shared/popup/popup.component';
import { SharedService } from 'src/app/commons/service/shared.service';
import { MustDiffer } from 'src/app/commons/helpers/must-different.validator';
import { Router, ActivatedRoute } from '@angular/router';
import { StatusSetting } from 'src/app/commons/setting/status_setting';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import * as moment from 'moment';
import { Moment } from 'moment';
import { CommonService } from 'src/app/commons/service/common.service';
import { AlertService } from 'src/app/commons/service/alert.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { StarRatingColor } from '../non-carrier-component/star-rating/star-rating.component';

import { environment } from 'src/environments/environment';
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
  selector: 'add-review-broker',
  templateUrl: './add-review-broker.component.html',
  styleUrls: ['./add-review-broker.component.css'],
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddReviewBrokerComponent implements OnInit {
  public selectCarrierData: any = []
  public errrorMessage: any
  public submitted = false;
  public submittedLanes = false;
  public responseErrror: any;
  public profileImage: any;
  public showAllLanes: boolean = false;
  public profileImageName: any;
  public lastAction: string;
  public imgURL: any;
  public electronicValue: any = [];
  public specializedServices: any = [];
  public selectedOption: string;
  public keyPointsData: any;
  public newKeyPoints: any = [];
  public keyPointsValues: any;
  public keyPointIDS: any = [];
  public averageRating: any;
  public carrierDiscoveryData: any = []
  newKey = new FormControl();
  keyPointsClr: Observable<string[]>;
  keyPointsIds: string[] = [];
  allKeyPoints: string[] = ['bad boy', 'heatup',];
  selectedValues: string[] = [];
  selectedOptions: { [key: string]: boolean } = {};
  public loaderSearchTo: any;
  public laneRegion: any;
  public loaderSearchFrom: any;
  public addReviewForm: FormGroup;
  myControl = new FormControl();
  keyControl = new FormControl();
  rating: any = 0;
  starCount: number = 5;
  starColor: StarRatingColor = StarRatingColor.accent;
  starColorP: StarRatingColor = StarRatingColor.primary;
  starColorW: StarRatingColor = StarRatingColor.warn;
  count = 0;
  public timeLinaRating: any
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
  public lanesData: any;
  public stateToStateId: any;
  public cityRegion: any;
  public lane: any[] = [];
  public provider: boolean = false;
  public matSelect = false;
  public laneListData: any;
  public carrierInfo = false;
  public laneCity_one: any;
  public laneCity_two: any;
  public selectRegionForm: FormGroup;
  public lanecity: any;
  public selectedCity: any = []
  public regioncity: any;
  public data: any;
  public stateID: any;
  public postBodyData: any;
  public srcPrtBox = "";
  public regionListlength: any;
  public regionListGroup: any;
  public regionsList: any = [];
  public regionCity: any;
  public emtpyData = false;
  public loaderSearch: boolean = false;
  public loaderSearchKey: boolean = false;
  public carrierData: any = [];
  public cityData: any = [];
  public regionData: any;
  public laneList: any;
  public skeletonLoader = false;
  public skeletonLoader1 = false;
  public lanesForm: FormGroup;
  public reviewData: any;
  public cargotype: any;
  public shipmentTypes: any;
  public removeCarrierData: any;
  public equipmemtTypes: any = []
  public selectEquipmentValue = [];
  public selectCargoTypeValue: any = [];
  public selectShipmentTypesValue: any = [];
  public selectSpecializedServices: any = [];
  public considerExpensiveRate: any = [];
  public selectConsiderExpensiveRate: any = [];
  public howOftens: any = [];
  public checkValue = true;
  // minDate: Moment;

  maxDate = new Date();
  minDate = new Date();
  public carrierId: any
  public userDetails: any
  myDateFormat = 'MM/YYYY';
  date = new FormControl(moment());

  public loading = false;
  laneListID: any;
  public laneData: any = [];
  public laneDataShow: any = [];

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
  public improvewriting: boolean = false;
  public changeTone: boolean = false;
  public translateInto: boolean = false;
  public newMessagePrompt: any;
  public reviewAIResponse: string = '';
  public instructionType: any;
  public userInstructions: any = [];
  public AIInstructions: any;
  public isButtonDisabled: boolean = true;
  // AI-REVIEW END

  // SUBSCRIPTION START
  public carrierSubcription: boolean = true;
  public getUserData: any;
  public lengthError = false;
  // SUBCRIPTION END




  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    public alertService: AlertService,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const wrapperElement = this.elementRef.nativeElement.querySelector('.box_header');
    const insideSpanElement = this.elementRef.nativeElement.querySelector('#dropdown');
    const textReaElement = this.elementRef.nativeElement.querySelector('.text_area_new');
    if (!insideSpanElement?.contains(event.target) && !wrapperElement?.contains(event.target)) {
      this.dropdownOpen = false
    }
    if (textReaElement?.contains(event.target)) {
      this.isSendMessage = false
    }

  }

  ngOnInit(): void {
    this.minDate.setFullYear(this.minDate.getFullYear() - 5);
    this.maxDate.setMonth(this.maxDate.getMonth() + 1);

    this.maxDate.setDate(0);
    this.carrierId = this.route.snapshot['queryParams']?.brokerId;
    this.timeLinaRating = StatusSetting.timeLinaRating;
    let configValue = this.sharedService.getConfig();
    if (configValue !== undefined) {
      this.getConfigSet(configValue);
    }
    this.commonService.configData.subscribe((userData) => {
      if (configValue == null) {

        this.getConfigSet(userData);
      }
    });
    this.getLaneRegion();
    this.getLaneList();
    this.getUserProfile()
    this.lanesForm = this.formBuilder.group({
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

    this.addReviewForm = this.formBuilder.group({
      rateForCommunication: ['', [Validators.required]],
      recommendation: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.maxLength(128)]],
      review: ['', [Validators.required]],
      cargoTypesIds: ['', [Validators.required]],
      equipmentTypesIds: ['', Validators.required],
      tracking: ['', Validators.required],
      lanes: ['', [Validators.required]],
      providerDetails: ['', Validators.maxLength(64)],
      shipmentTypes: ['', Validators.required],
      lastWorkedWithMonth: ['', Validators.required],
      lastWorkedWithYear: ['', Validators.required],
      howOften: ['', Validators.required],
      specializedServices: [''],
      anonymous: ['', Validators.required],
      offerReference: ['', Validators.required],
      relatedToBroker: ['', Validators.required],
      isConsiderNextTime: ['', Validators.required],
      considerExpensive: ['', Validators.required],
      brokerDiscovery: [null],
      verificationScreenshot: ['', Validators.required],
      rating: ['', Validators.required],
      likeToReceiveUpdate: [null]
    })


    if (this.date) {
      let matMonths = this.date.value
      let dateOfDate = matMonths._d?.toISOString()?.split('-')?.join('/')?.substr(0, 7)
      const [yearString, monthString] = dateOfDate?.split("/");
      const matMonth = parseInt(monthString);
      const matYear = parseInt(yearString);
      for (let i = 0; i < this.selectedMonth?.length; i++) {
        if (matMonth == this.selectedMonth[i].count) {
          this.addReviewForm.get('lastWorkedWithMonth').setValue(this.selectedMonth[i].month)
        }
      }
      this.addReviewForm.get('lastWorkedWithYear').setValue(matYear)
    }
  }

  getConfigSet(configValue: any) {
    this.cargotype = configValue?.cargoTypes;
    this.shipmentTypes = configValue?.shipmentTypes;
    this.equipmemtTypes = configValue?.equipmentTypes;
    this.considerExpensiveRate = configValue?.considerExpensive;
    this.specializedServices = configValue?.specializedServices;
    this.howOftens = configValue?.howOften;
    this.carrierDiscoveryData = configValue?.carrierDiscovery;

  }
  userInfo(userDetails) {
    this.userDetails = userDetails
  }

  getLaneRegion() {
    this.skeletonLoader = true;
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
        for (this.data of this.laneRegion?.state) {
        }
        setTimeout(() => {
          this.skeletonLoader = false
        }, 1000);
      }
      else {
        this.laneRegion = []
      }
    });
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

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }



  getAddReviewSearch() {
    let uri = null;
    let newParams = {
      'search': 'va',
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.EXTERNAL.CARRIERSEARCH,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerResult) => {
      if (ServerResult.success === true) {
        0
        this.laneCity_one = ServerResult.response;
      }
    });
  }

  searchUserType(event: any) {
    this.matSelect = true
    this.srcPrtBox = "active_src_rslt";
    this.emtpyData = false;
    this.loaderSearch = true;
    let searchStr = event.key;
    if (searchStr.length > 0) {
      this.searchRecord(searchStr);
    } else {
      this.searchRecord(null);
      this.loaderSearch = false;
    }
  }

  getAPIInParam(searchStr) {
    let APIparams, params;
    if (searchStr) params = { search: searchStr };
    else params = {};
    APIparams = {
      apiKey: AppSettings.APIsNameArray.EXTERNAL.CARRIERSEARCH,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }

  searchRecord(searchStr: any) {
    this.skeletonLoader1 = true
    var APIparams = this.getAPIInParam(searchStr);
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success == true) {
        this.reviewData = ServerRes.response;
        setTimeout(() => {
          this.skeletonLoader = false
        }, 1000);
        for (let v = 0; v < this.reviewData?.carrierData?.length; v++) {
          if (this.reviewData?.carrierData[v] && this.reviewData?.carrierData[v]?.carrierId == this.carrierId) {
            this.selectCarrierData = this.reviewData?.carrierData[v];
          }
        }
      }

    });
  }

  onReset() {
    this.submittedLanes = false;
    this.lanesForm.reset();
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
      this.laneData.push(makeData)
      this.laneData = [{
        "fromCityId": makeData.fromCityId?.toString(),
        "fromStateId": makeData.fromStateId?.toString(),
        "toCityId": makeData.toCityId?.toString(),
        "toStateId": makeData.toStateId?.toString()
      }];
      this.addReviewForm.get("lanes").setValue(this.laneDataShow);
      this.onReset();
    }
  }

  selectPickLaneRegions($event) {
    this.stateID = $event.value;
    this.getLaneCity();
    if ($event.value) {
      this.lanesForm.get("fromCityId").setValue(this.lanecity?.name);
    } else {
      this.lanesForm.get("fromCityId").setValue("");
    }
  }

  selectPickLanes($event) {
    this.stateToStateId = $event.value;
    this.getLaneRegionCity();
    if ($event.value) {
      this.lanesForm.get("toCityId").setValue(this.cityRegion?.name);
    } else {
      this.lanesForm.get("toCityId").setValue("");
    }
  }
  removeLane(index: any, listData: any) {
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

  leneDelete() {
    this.loading = true;
    let uri = null;
    let newParams = {
      'userLaneId': this.laneListID
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.LaneRegions.DELETE,
      uri: uri,
    };
    this.commonService.delete(APIparams).subscribe(
      (success) => {
        this.loading = false;
        if (success.success === true) {
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
  closeSearch() {
    this.srcPrtBox = "";
  }
  redirectPageCity(carrierData: any) {
    if (carrierData) {
      this.carrierInfo = true;
      this.selectCarrierData = carrierData;
      this.averageRating = Math.round(this.selectCarrierData.averageRating)
      this.addReviewForm.get('userId').setValue(carrierData.id);
    } else {
      this.carrierInfo = false;
      this.selectCarrierData = [];
    }
  }

  showHideProvider(event) {
    if (event.value == true) {
      this.provider = event.value;
      this.checkValidation(event.value);
    } else {
      this.provider = event.value;
    }
  }

  checkValidation(value: any) {
    if (value == true) {
      this.addReviewForm.get('providerDetails').setValidators([Validators.required, Validators.maxLength(64)]);
      this.addReviewForm.get('providerDetails').updateValueAndValidity();
    } else {
      this.addReviewForm.get('providerDetails').clearValidators();
      this.addReviewForm.get('providerDetails').setValue('');
    }
  }

  submitReview({ value, valid }) {
    this.submitted = true;
    const formData = new FormData()
    formData.append('verificationScreenshot', value.verificationScreenshot)
    if (valid) {


      this.loading = true;
      formData.append('title', value.title)
      formData.append('brokerId', this.selectCarrierData?.id)
      formData.append('lane', JSON.stringify(this.laneData));
      formData.append('lastWorkedWithMonth', value.lastWorkedWithMonth)
      formData.append('lastWorkedWithYear', value.lastWorkedWithYear)
      formData.append('rating', value.rating)
      if (value.brokerDiscovery !== undefined && value.brokerDiscovery !== null) {

        formData.append('brokerDiscovery', value.brokerDiscovery)
      }
      formData.append('tracking', value.tracking)
      formData.append('howOften', value.howOften)
      formData.append('providerDetails', value.providerDetails)
      formData.append('rateForCommunication', value.rateForCommunication)
      formData.append('recommendation', value.recommendation)
      formData.append('userId', localStorage.getItem('userId'));
      formData.append('anonymous', value.anonymous);
      formData.append('offerReference', value.offerReference);
      formData.append('relatedToBroker', value.relatedToBroker);
      formData.append('isConsiderNextTime', value.isConsiderNextTime);
      if (value.likeToReceiveUpdate !== undefined && value.likeToReceiveUpdate !== null) {
        formData.append('likeToReceiveUpdate', value.likeToReceiveUpdate);
      }
      formData.append('considerExpensive', value.considerExpensive);
      formData.append('equipmentTypesIds', JSON.stringify(Object.values(this.selectEquipmentValue).map(value => value.toString())));
      formData.append('cargoTypesIds', JSON.stringify(Object.values(this.selectCargoTypeValue).map(value => value.toString())));
      formData.append('shipmentTypes', JSON.stringify(Object.values(this.selectShipmentTypesValue).map(value => value.toString())))
      formData.append('specializedServices', JSON.stringify(Object.values(this.selectSpecializedServices).map(value => value.toString())))
      formData.append('review', this.description);
      let APIparams: any;
      APIparams = {
        apiKey: AppSettings.APIsNameArray.REVIEW.BROKERREVIEWADD,
        uri: '',
        postBody: formData,
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {
          this.loading = false;
          if (success.success === true) {
            this.errrorMessage = null
            const dialogRef = this.dialog.open(PopupComponent, {
              disableClose: true,
              backdropClass: 'cn_custom_popup',
              width: AppSettings.popWidth,
              data: { openPop: 'submitReview' },
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result.event === 'ok') {
              }
            });

          } else if (success.success === false) {
            this.errrorMessage = null;
            this.responseErrror = success.message
            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'Review',
              'You have not successfully submited review.'
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
          this.errrorMessage = error.error.message;
          this.loading = false;
        });
    }
  }

  onRatingChanged(rating) {
    this.rating = rating;
    this.addReviewForm.get("rating").setValue(this.rating);
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


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyPoints
    if (value) {
      this.keyPointsIds.push(value);
      this.newKeyPoints.push(value)

    }

    // Clear the input value
    event.chipInput!.clear();

    this.newKey.setValue(null);
  }

  remove(keyPoints: string): void {
    const index = this.keyPointsIds.indexOf(keyPoints);

    if (index >= 0) {
      this.keyPointsIds.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.keyPointIDS.push(event.option.value);
    this.keyPointsIds.push(event.option.viewValue);
    this.newKey.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allKeyPoints.filter(keyPoints => keyPoints.toLowerCase().includes(filterValue));
  }



  searchUserTypeKey(event: any) {
    this.srcPrtBox = "active_src_rslt";
    this.emtpyData = false;
    this.loaderSearchKey = true;
    let ketPointSrarch = event.target.value;
    if (ketPointSrarch.length > 0) {
      this.searchRecordKey(ketPointSrarch);
    } else {
      setTimeout(() => {
        this.skeletonLoader = false
      }, 1000);
    }
  }

  getAPIInParamKey(ketPointSrarch) {
    let APIparams, params;
    if (ketPointSrarch) params = { search: ketPointSrarch };
    else params = { limit: 5 };
    APIparams = {
      apiKey: AppSettings.APIsNameArray.REVIEW.KEYPOINT,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }

  searchRecordKey(ketPointSrarch: any) {
    var APIparams = this.getAPIInParamKey(ketPointSrarch);
    this.commonService.getList(APIparams).subscribe((ServerResponse) => {
      this.loaderSearchKey = false;
      if (ServerResponse.success === true) {
        this.keyPointsValues = ServerResponse.response?.keyPointsResult;
      }
    });
  }

  selecTimeLines() {

  }
  selecCleanliness() {

  }

  selecCommunication() {

  }

  fuleComsuption() {

  }


  getSelectedValues() {
    this.selectedValues = Object.keys(this.selectedOptions).filter(key => this.selectedOptions[key]);
  }

  selectedValue(id) {
    let data: any = [];
    data.push(id)
    this.addReviewForm.get('cargoTypesIds').setValue(data);
  }

  selectEquipmentType(id: any, checked: any) {
    this.count = 0;
    for (let v = 0; v < this.equipmemtTypes.length; v++) {
      if (
        this.equipmemtTypes[v].id === id
      ) {
      } else if (
        this.equipmemtTypes[v].id !== id &&
        this.selectEquipmentValue.length > 1
      ) {
        this.selectEquipmentValue.pop();
      }
    }

  }

  onEquipmentCheckboxChange(event: MatCheckboxChange, id: any, index: any) {
    const equipmentTypesIds = this.addReviewForm.get('equipmentTypesIds');

    if (event.checked) {
      this.selectEquipmentValue.push(id);
      this.addReviewForm.get('equipmentTypesIds').setValue(this.selectEquipmentValue)

    } else {
      let selectEquipmentData = this.selectEquipmentValue.find(item => item === id);

      if (selectEquipmentData)
        this.selectEquipmentValue.splice(this.selectEquipmentValue.indexOf(selectEquipmentData), 1);
    }
    equipmentTypesIds.markAsTouched();
    equipmentTypesIds.updateValueAndValidity();
  }



  onCargoTypeCheckboxChange(event: MatCheckboxChange, id: any, index: any) {
    const cargoTypesIds = this.addReviewForm.get('cargoTypesIds');
    if (event.checked) {
      this.selectCargoTypeValue.push(id);
      this.addReviewForm.get('cargoTypesIds').setValue(this.selectCargoTypeValue)

    } else {
      let selectCargoData = this.selectCargoTypeValue.find(item => item === id);

      if (selectCargoData)
        this.selectCargoTypeValue.splice(this.selectCargoTypeValue.indexOf(selectCargoData), 1);
    }
    cargoTypesIds.markAsTouched();
    cargoTypesIds.updateValueAndValidity();

  }

  onShipmentTypesChange(event: MatCheckboxChange, id: any, index: any) {
    const shipmentTypes = this.addReviewForm.get('shipmentTypes');

    if (event.checked) {
      // Pushing the object into array
      this.selectShipmentTypesValue.push(id);
      this.addReviewForm.get('shipmentTypes').setValue(this.selectShipmentTypesValue)

    } else {
      let shipmentData = this.selectShipmentTypesValue.find(itm => itm === id);

      if (shipmentData)
        this.selectShipmentTypesValue.splice(this.selectShipmentTypesValue.indexOf(shipmentData), 1);
    }
    shipmentTypes.markAsTouched();
    shipmentTypes.updateValueAndValidity();
  }

  onConsiderExpensiveRadioChange(event: MatRadioChange, id: any, index: any) {
    if (event?.value == id) {
      this.addReviewForm.get('considerExpensive').setValue(event?.value)
    }
  }



  onSpecializedCheckboxChange(event: MatCheckboxChange, id: any, index: any) {

    if (event.checked) {
      // Pushing the object into array
      this.selectSpecializedServices.push(id);
      this.addReviewForm.get('specializedServices').setValue(this.selectSpecializedServices)

    } else {
      let specializedData = this.selectSpecializedServices.find(itm => itm === id);

      if (specializedData)
        this.selectSpecializedServices.splice(this.selectSpecializedServices.indexOf(specializedData), 1);
    }
  }


  onHowOftenRadioChange(event: MatRadioChange, id: any, index: any) {
    if (event.value == id) {
      this.addReviewForm.get('howOften').setValue(id)
    }
  }

  electronicTracing(event: MatRadioChange) {
    this.electronicValue = event.value;
    this.checkValidation(event.value);
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
      this.addReviewForm.get('verificationScreenshot').setValue(this.profileImage)
    }
  }


  getUserProfile() {
    let uri = null;
    let newParams = { 'brokerId': this.carrierId };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.REVIEW.GETBROKERREVIEW,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes?.success === true) {
        this.selectCarrierData = ServerRes?.response;

      }
    });
  }

  // carrier discovery

  selectbrokerDiscovery($event) {
    if ($event.value) {
      this.addReviewForm.get("brokerDiscovery").setValue($event.value);
    }
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, event: any) {
    const ctrlValue = this.date.value;
    let matMonths = ctrlValue.month(normalizedMonthAndYear.month());
    let matYears = ctrlValue.year(normalizedMonthAndYear.year());
    let dateOfDate = matMonths._d?.toISOString()?.split('-')?.join('/')?.substr(0, 7)
    const [yearString, monthString] = dateOfDate?.split("/");
    const matMonth = parseInt(monthString);
    const matYear = parseInt(yearString);
    for (let i = 0; i < this.selectedMonth?.length; i++) {
      if (matMonth == this.selectedMonth[i].count) {
        this.addReviewForm.get('lastWorkedWithMonth').setValue(this.selectedMonth[i].month)
      }
    }
    this.addReviewForm.get('lastWorkedWithYear').setValue(matYear)

    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  showMoreData() {
    this.showAllLanes = !this.showAllLanes
  }

  // ai-rating

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
      this.addReviewForm.controls.review.setValue(target.value)
    }
    if (target.value.length > 1024) {
      this.lengthError = true
    } else[
      this.lengthError = false

    ]
  }
  saveUserGenerated() {
    this.addReviewForm?.controls.aboutCompany.setValue(this.description);
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
  // send action
  generateReview() {
    this.loading = true;
    let requestBody: any;
    if (this.AIInstructions == 'ai') {
      if (this.addReviewForm.controls?.title.status == 'VALID' && this.addReviewForm.controls?.rating.status == 'VALID' && this.addReviewForm.controls?.tracking.status == 'VALID'   && this.addReviewForm.controls?.rateForCommunication.status == 'VALID' && this.addReviewForm.controls?.recommendation.status == 'VALID' && this.addReviewForm.controls?.isConsiderNextTime.status == 'VALID' && this.addReviewForm.controls?.considerExpensive.status == 'VALID' 
         && this.selectCarrierData.companyName) {
        this.loading = true;
        requestBody = {
          review: {
            "companyName": this.selectCarrierData.companyName,
            "countryCode": this.selectCarrierData.phyCountryCode ? this.selectCarrierData.phyCountryCode : 'US',
            "brokerId": this.selectCarrierData?.id,
            "title": this.addReviewForm.controls?.title.value,
            "rating": this.addReviewForm.controls?.rating.value,
            "tracking": this.addReviewForm.controls?.tracking.value,
           
            "rateForCommunication": this.addReviewForm.controls?.rateForCommunication.value,
            "isConsiderNextTime": this.addReviewForm.controls?.isConsiderNextTime.value,
            "considerExpensive": this.addReviewForm.controls?.considerExpensive.value,
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
        apiKey: AppSettings.APIsNameArray.REVIEW.BROKERAI,
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



  // new way
  async displayResponseWordByWord(response: string) {
    this.looping = true;
    this.addReviewForm?.controls?.review?.setValue(response)
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
  redirectPageCarrier(dotNumber: any, companyName: any) {
    let newCompanyName = companyName.replace(/\s/g, '-').toLowerCase();
    window.location.href = environment.domain + "/carrier-profile/" + dotNumber + "/" + newCompanyName + "/#review";
  }
}

