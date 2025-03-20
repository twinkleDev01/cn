import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { SharedService } from 'src/app/commons/service/shared.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { StatusSetting } from 'src/app/commons/setting/status_setting';
@Component({
  selector: 'app-non-carrier-overview',
  templateUrl: './non-carrier-overview.component.html',
  styleUrls: ['./non-carrier-overview.component.css']
})
export class NonCarrierOverviewComponent implements OnInit {
  public profileEdit: FormGroup;
  public userType: any;
  public getUserData: any;
  public loading = false;
  public stateID: any;
  public laneCity: any;
  public countryList: any;
  public state: any;
  public srcPrtBox = "";
  public emtpyData = false;
  public loaderSearch: boolean = false;
  public emailID: any;
  public laneCity_one: any;
  public skeletonLoader = false;
  public defualtCountryFlag: any;
  public getRecord: any;
  public information: any;
  dropdownError: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    public alertService: AlertService,
    private sharedService: SharedService,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.information = StatusSetting.information;
    this.userType = localStorage.getItem('user_type')

    let configValue = this.sharedService.getConfig();
    if (configValue !== undefined) {
      this.getConfigSet(configValue);
    }
    this.commonService.configData.subscribe((userData) => {
      this.getConfigSet(userData);
    });
    this.getState();
    this.profileEdit = this.formBuilder.group({
      countryCode: ['US', [Validators.required]],
      firstName: ['', [Validators.required, Validators.maxLength(64)]],
      companyName: ['', [Validators.required, Validators.maxLength(64)]],
      lastName: ['', [Validators.required, Validators.maxLength(64)]],
      website: ['', [Validators.pattern('^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$')]],
      aboutCompany: ['', [Validators.required, Validators.maxLength(500)]],
      email: ['', Validators.required, Validators.pattern(AppSettings.emailPattern), Validators.maxLength(128)],
      stateId: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/), Validators.minLength(10),
      Validators.maxLength(10),]],
      cityId: ['', [Validators.required]],
    });
    if (localStorage.getItem("access_token")) {
      this.skeletonLoader = true;
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
    let uri = null;
    let newParams = {};
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: this.sharedService.getUrl(),
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.getUserData = ServerRes.response;
        this.emailID = this.getUserData.email;
        this.selectCountryCode(this.getUserData?.countryCode)
        this.getValueForm()
        this.skeletonLoader = false;
      }
    });
  }
  getValueForm() {
    this.profileEdit = this.formBuilder.group({
      countryCode: [this.getUserData.countryCode ? this.getUserData.countryCode : 'US', [Validators.required]],

      firstName: [this.getUserData.firstName ? this.getUserData.firstName : '', [Validators.required, Validators.maxLength(64)]],
      companyName: [this.getUserData.companyName ? this.getUserData.companyName : '', [Validators.required, Validators.maxLength(64)]],
      lastName: [this.getUserData.lastName ? this.getUserData.lastName : '', [Validators.required, Validators.maxLength(64)]],
      website: [this.getUserData.website ? this.getUserData.website : '', [Validators.pattern('^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$')]],
      stateId: [this.getUserData?.state ? this.getUserData?.state?.stateId : '', [Validators.required]],
      cityId: [this.getUserData?.city ? this.getUserData?.city?.cityName : '', [Validators.required]],
      email: [this.getUserData.email, [Validators.required, Validators.pattern(AppSettings.emailPattern)]],
      phone: [this.getUserData.phone, [Validators.required,
      Validators.pattern(/^[0-9]\d*$/),
      Validators.minLength(10),
      Validators.maxLength(10),]],
    });
  }

  getConfigSet(configValue: any) {
    this.countryList = configValue?.countryArrayObject;
  }

  profileUpdateValue({ value, valid }) {
    let cityID: any

    if (valid) {
      if (this.laneCity_one !== undefined && this.laneCity_one !== null) {
        for (let fromCityId of this.laneCity_one?.city) {
          if (fromCityId.name == value.cityId) {
            cityID = fromCityId.id;
            this.dropdownError = false;
          }
        }
      }
      if (!cityID && this.laneCity_one?.city) {
        this.dropdownError = true;
      }
      else  {
      this.loading = true;

        value.cityId = cityID;
        let APIparams = {
          apiKey: this.sharedService.updateUserUrl(),
          uri: '',
          postBody: value,
        };
        this.commonService.put(APIparams).subscribe(
          (success) => {
            this.loading = false;
            if (success.success === true) {
              this.sharedService.userDataPass.next('update')
              this.alertService.showNotificationMessage(
                'success',
                'bottom',
                'left',
                'txt_s',
                'check_circle',
                'User Profile',
                'You have successfully updated User Profile.'
              );
            } else if (success.success === false) {
              this.alertService.showNotificationMessage(
                'danger',
                'bottom',
                'left',
                'txt_d',
                'check_circle',
                'User Profile',
                'You have not successfully updated User Profile.'
              );
              this.loading = false;
            }
          },
          (error) => {
            this.loading = false;
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
  selectPickLaneRegions($event) {
    this.stateID = $event.value;
    this.getCity();
    if ($event.value) {
      this.profileEdit.get("cityId").setValue(this.laneCity?.name);
    } else {
      this.profileEdit.get("cityId").setValue("");
    }
  }

  getCity() {
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
      }
      else {
        this.laneCity_one = [];
      }

    });
  }

  getState() {
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
        this.state = ServerRes.response;
        this.skeletonLoader = false;
      }
      else {
        this.state = []
      }

    });
  }

  searchUserType(event: any) {
    this.srcPrtBox = "active_src_rslt";
    this.emtpyData = false;
    this.loaderSearch = true;
    let searchStr = event.target.value;
    if (searchStr.length > 0) {
      this.searchRecord(searchStr);
    } else {
      this.loaderSearch = false;
    }
  }

  getAPIInParam(searchStr) {
    let APIparams, params;
    if (searchStr) params = { stateId: this.stateID || this.getUserData?.state?.stateId, search: searchStr };
    else params = { limit: 5 };
    APIparams = {
      apiKey: AppSettings.APIsNameArray.LaneRegions.CITY,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }
  searchRecord(searchStr: any) {
    var APIparams = this.getAPIInParam(searchStr);
    this.commonService.getList(APIparams).subscribe((ServerResult) => {
      this.loaderSearch = false;

      if (ServerResult.success === true) {
        this.laneCity_one = ServerResult.response;
      }
    });
  }
  selectCountryCode(event: any) {
    this.getRecord = this.countryList?.filter((item) => item.code == event);
    this.defualtCountryFlag = this.getRecord[0]?.flag;
  }
}

