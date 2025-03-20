import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MustDiffer } from 'src/app/commons/helpers/must-different.validator';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { SharedService } from 'src/app/commons/service/shared.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { PopupComponent } from 'src/app/shared/popup/popup.component';

@Component({
  selector: 'app-lanes-regions',
  templateUrl: './lanes-regions.component.html',
  styleUrls: ['./lanes-regions.component.css']
})

export class LanesRegionsComponent implements OnInit  {
  public lanesForm: FormGroup;
  public message: any
  public stateName: any = [];
  public showAllLanes: boolean = false;
  public showAllTerminal: boolean = false
  public errorMessage: any
  public skeletonLoader = false;
  public stateToStateId: any;
  public terminalListData: any = []
  public loading = false;
  public submitted = false;
  public terminalSubmitted: boolean = false;
  public cityRegion: any;
  public laneRegion: any;
  public laneListData: any;
  public laneCity_one: any;
  public laneCity_two: any;
  public selectRegionForm: FormGroup;
  public terminalsForm: FormGroup;
  public lanecity: any;
  public regioncity: any;
  public data: any;
  public stateID: any;
  public srcPrtBox = "";
  public regionListGroup: any;
  public regionsList: any = [];
  public regionCity: any;
  public emtpyData = false;
  public loaderSearch: boolean = false;
  public loaderSearchState: boolean = false;
  public loaderSearchStateTo: boolean = false;
  public loaderSearchTo: boolean = false;
  public laneList: any;
  public editListData: any;
  public selectedHead: any;
  public selecteRegion: any = [];
  public laneListID: any;
  public terminalListID: any;
  public userType: any;
  public fromCityDropdownerror = false;
  public fromStateDropdownerror = false;
  public toCityDropdownerror = false;
  public terminalDropdownError = false;
  public laneStateCountry: any;
  public laneStateCountryTo: any;
  public laneStateCountryTerminal: any;
  public preferredRegionsState: any
  public selectedRegions: any[] = [];
  constructor(
    private commonService: CommonService,
    public alertService: AlertService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.userType = localStorage.getItem("user_type");
    this.getLaneRegion();
    this.getLaneList();
    this.getRegionList();
    this.getTerminalist()
    this.lanesForm = this.formBuilder.group(
      {
        fromStateId: ['', [Validators.required]],
        fromCityId: ['', [Validators.required,]],
        toStateId: ['', [Validators.required]],
        toCityId: ['', [Validators.required]],
      },
      {
        validators: [
          MustDiffer('fromStateId', 'toStateId'),
        ],
      },
    );
    this.terminalsForm = this.formBuilder.group({
      terminalCityId: ['', Validators.required],
      terminalStateId: ['', Validators.required],
    })
    this.selectRegionForm = this.formBuilder.group({
      preferredRegions: [''],
      headquarter: ['',],
    });
    this.getCarriers();
  }

  laneSubmit({ value, valid }) {
    let cityID: any;
    let cityIdFrom: any;
    // for state
    let CheckfromState: any;
    let CheckToState: any;
    let stateIdFrom: any;
    let stateIdTo: any;
    let countryIdFrome;
    let countryIdTo;
    this.submitted = true;
    if (valid) {
      // for statre Id 
      for (let fromState of this.laneStateCountry) {
        CheckfromState = fromState.name + ', ' + fromState.countryCode
        if (CheckfromState == value.fromStateId) {
          stateIdFrom = fromState.id;
          countryIdFrome = fromState.countryId;
          this.fromStateDropdownerror = false;
        }
      }
      for (let toState of this.laneStateCountryTo) {
        CheckToState = toState.name + ', ' + toState.countryCode
        if (CheckToState == value.toStateId) {
          stateIdTo = toState.id;
          countryIdTo = toState.countryId;
          this.fromStateDropdownerror = false;
        }
      }
      if (!stateIdFrom) {
        this.fromStateDropdownerror = true;
      }
      for (let fromCityId of this.laneCity_one?.city) {
        if (fromCityId.name == value.fromCityId) {
          cityIdFrom = fromCityId.id;
          this.fromCityDropdownerror = false;
        }
      }
      for (let toCityId of this.laneCity_two?.city) {
        if (toCityId.name == value.toCityId) {
          cityID = toCityId.id;
          this.toCityDropdownerror = false;
        }
      }
      if (!cityIdFrom) {
        this.fromCityDropdownerror = true;
        if (!cityID) {
          this.toCityDropdownerror = true;
        }
      } else if (!cityID) {
        this.toCityDropdownerror = true;
      }
      else {
        this.loading = true;

        value.fromCityId = cityIdFrom;
        value.toCityId = cityID;
        value.fromStateId = stateIdFrom;
        value.toStateId = stateIdTo;
        value.toCountryId = countryIdTo;
        value.fromCountryId = countryIdFrome;
        let APIparams = {
          apiKey: AppSettings.APIsNameArray.LaneRegions.ADD,
          uri: '',
          postBody: value,

        };
        this.commonService.post(APIparams).subscribe(
          (success) => {
            this.loading = false;
            if (success.success === true) {
              this.message = null

              this.getLaneList();
              this.onReset();
              this.alertService.showNotificationMessage(
                'success',
                'bottom',
                'left',
                'txt_s',
                'check_circle',
                'Lane Added',
                'You have successfully updated lane.'
              );
            } else if (success.success === false) {
              this.message = success.message
              this.alertService.showNotificationMessage(
                'danger',
                'bottom',
                'left',
                'txt_d',
                'check_circle',
                'Lane Added',
                'You have not successfully updated lane.'
              );
              this.loading = false;
              this.submitted = false;
            }
          },
          (error) => {
            this.submitted = false;
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

  terminalSubmit({ value, valid }) {
    this.terminalSubmitted = true;
    let cityIdFrom: any;
    let terminalStateForm: any;
    let CheckToState: any;
    let countryId: number;
    if (valid) {
      for (let terminalState of this.laneStateCountryTerminal) {
        CheckToState = terminalState.name + ', ' + terminalState.countryCode
        if (CheckToState == value.terminalStateId) {
          terminalStateForm = terminalState.id;
          countryId = terminalState.countryId;
          this.terminalDropdownError = false;
        }
      }
      for (let fromCityId of this.laneCity_one?.city) {
        if (fromCityId.name == value.terminalCityId) {
          cityIdFrom = fromCityId.id;
          this.terminalDropdownError = false;
        }
      }
      if (!cityIdFrom) {
        this.terminalDropdownError = true;
      } else {
        this.loading = true;
        value.terminalCityId = cityIdFrom
        value.terminalStateId = terminalStateForm
        value.terminalCountryId = countryId;
        let APIparams = {
          apiKey: AppSettings.APIsNameArray.TERMINAL.ADD,
          uri: '',
          postBody: value,
        };
        this.commonService.post(APIparams).subscribe(
          (success) => {
            if (success.success === true) {
              this.errorMessage = null
              this.getTerminalist();
              this.loading = false;
              this.onReset();
              this.alertService.showNotificationMessage(
                'success',
                'bottom',
                'left',
                'txt_s',
                'check_circle',
                'Terminal Added',
                'You have successfully updated Terminal information.'
              );
            } else if (success.success === false) {
              this.alertService.showNotificationMessage(
                'danger',
                'bottom',
                'left',
                'txt_d',
                'check_circle',
                'Terminal Added',
                'You have not successfully updated Terminal information.'
              );
              this.message = success.message
              this.loading = false;
              this.terminalSubmitted = false;
              this.errorMessage = null

            }
          },
          (error) => {
            this.terminalSubmitted = false;
            this.loading = false;
            this.errorMessage = error.error.message
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
    this.getLaneCity();
    if ($event.value) {
      this.lanesForm.get("fromCityId").setValue(this.lanecity?.name);
    } else {
      this.lanesForm.get("fromCityId").setValue("");
    }
  }

  selectPickTerminalRegions(event: any) {

    const searchStr = event.target.value.toLowerCase(); // Standardize search to lowercase
    if (searchStr.length > 0) {
      this.laneStateCountryTerminal = this.laneRegion.state.filter(state =>
        state.name.toLowerCase().includes(searchStr)
      );
    } else {
      this.laneStateCountryTerminal = [];
    }
    this.stateID = this.laneStateCountryTerminal.length > 0 ? this.laneStateCountryTerminal[0].id : null;
    this.getLaneCity();
    if (event.value) {
      this.terminalsForm.get("terminalCityId").setValue(this.lanecity?.name);
    } else {
      this.terminalsForm.get("terminalCityId").setValue("");
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

  getLaneRegion() {
    // this.skeletonLoader=true;
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
        // this.skeletonLoader = false;
      } else {
        this.laneRegion = []
        // this.skeletonLoader = false;

      }
    });
  }


  getLaneList() {
    // this.skeletonLoader=true;
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

  getTerminalist() {
    let uri = null;
    let newParams = {
    };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.TERMINAL.LIST,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.terminalListData = ServerRes.response;
        // this.skeletonLoader = false;
      }
      else {
        this.terminalListData = [];
        // this.skeletonLoader = false;
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
      }
      else {
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

  searchUserFromState(event: any) {
    this.loaderSearchState = true;
    const searchStr = event.target.value.toLowerCase(); // Standardize search to lowercase

    if (searchStr.length > 0) {
      this.laneStateCountry = this.laneRegion.state.filter(state =>
        state.name.toLowerCase().includes(searchStr)
      );
    } else {
      this.laneStateCountry = [];
    }
    this.loaderSearchState = false;
    this.stateID = this.laneStateCountry.length > 0 ? this.laneStateCountry[0].id : null;
    this.getLaneCity();
    const cityName = this.laneStateCountry.length > 0 ? this.lanecity?.name : "";
    this.lanesForm.get("fromCityId").setValue(cityName);
  }

  searchUserToState(event: any) {
    this.loaderSearchStateTo = true;
    const searchStr = event.target.value.toLowerCase(); // Standardize search to lowercase
    if (searchStr.length > 0) {
      this.laneStateCountryTo = this.laneRegion.state.filter(state =>
        state.name.toLowerCase().includes(searchStr)
      );
    } else {
      this.laneStateCountryTo = [];
    }
    this.loaderSearchStateTo = false;
    this.stateToStateId = this.laneStateCountryTo.length > 0 ? this.laneStateCountryTo[0].id : null;
    this.getLaneRegionCity();
    const cityName = this.laneStateCountryTo.length > 0 ? this.cityRegion?.name : "";
    this.lanesForm.get("toCityId").setValue(cityName);
  }

  getAPIInParam(searchStr) {
    let APIparams, params;
    if (searchStr) params = { stateId: this.stateID, search: searchStr };
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
        this.leneDelete(index);
      }
    });
  }

  removeTerminal(index: any, listData: any) {
    this.terminalListID = listData.id
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      // backdropClass: AppSettings.backdropClass,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: { openPop: 'terminalConfirmation' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'ok') {
        this.terminalDelete(index);
      }
    });
  }

  leneDelete(index) {
    this.loading = true;
    let uri = null;
    let newParams = {
      userLaneId: this.laneListID
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.LaneRegions.DELETE,
      uri: uri,
    };
    this.commonService.delete(APIparams).subscribe(
      (success) => {
        this.loading = false;
        this.laneListData.splice(index, 1);
        if (success.success === true) {
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            'Removed Lane',
            'You have successfully removed Lane.'
          );

        } else if (success.success === false) {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_d',
            'cancel',
            'Removed Lane',
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

  terminalDelete(index) {
    this.loading = true;
    let uri = null;
    let newParams = {
      carrierTerminalId: this.terminalListID
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.TERMINAL.DELETE,
      uri: uri,
    };
    this.commonService.delete(APIparams).subscribe(
      (success) => {
        this.loading = false;
        this.terminalListData.splice(index, 1);
        if (success.success === true) {
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            'Removed Terminal',
            'You have successfully removed Terminal.'
          );

        } else if (success.success === false) {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_d',
            'cancel',
            'Removed Terminal',
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

  getRegionList() {
    let uri = null;
    let newParams = {
      limit: '200'
    };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.REGIONS.LIST,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.response.allRegions && ServerRes.response.allRegions.length > 0) {
        this.regionsList = ServerRes.response.allRegions;
      } else {
        this.regionListGroup = []
      }
    });
  }

  getCarriers() {
    this.skeletonLoader = true;
    let uri = null;
    let newParams = {}
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: this.sharedService.getUrl(),
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerResult) => {
      if (ServerResult.success === true) {
        this.editListData = ServerResult.response;
        this.selectedHead = ServerResult.response.headquarter;
        if (ServerResult.response?.preferredRegions?.length > 0) {
          this.getRegionHeadQuarter(ServerResult.response?.preferredRegions)
        }
        this.skeletonLoader = false;
      } else {
        this.editListData = null;
        this.skeletonLoader = false;
      }
    });
  }

  getRegionHeadQuarter(record: any) {
    console.log(record, 'record')
    // i have use  record (escap of this.regionsList) here because preferredRegions were not showing
    for (let index = 0; index < record?.length; index++) {
      for (let subIndex = 0; subIndex < record?.length; subIndex++) {
        record.forEach(element => {
          if (element.region) {
            // Convert specific US regions to "US"
            if ([
              "USA - West",
              "USA - South East",
              "USA - North East",
              "USA - Midwest",
              "USA - South West"
            ].includes(element.region)) {
              element.region = "US";
            }
            // Convert "Canada" (case insensitive) to "CA"
            if (element.region.toLowerCase() === "canada") {
              element.region = "CA";
            } else if (element.region.toLowerCase() === "mexico") {
              element.region = "MX";
            }
          }
        });
        console.log(record, 'record')

        if (record[subIndex].id === record[index].id) {
          this.selecteRegion.push({ id: record[index].id, state: record[index].state, region: record[index].region });
          this.stateName.push(record[index].state);
        }
      }
    }
    this.stateName = this.stateName.toString()
    // this.stateName =  this.stateName.replace(/,/g, ', ');
    this.stateName = this.stateName.split(',');
    this.stateName = this.stateName.map(state => state.trim());
    this.selectRegionForm = this.formBuilder.group({
      preferredRegions: [''],
      headquarter: [this.selectedHead?.cityId, this.selectedHead?.cityId ? [Validators.required] : [],],
    });
  }

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  onReset() {
    this.submitted = false;
    this.terminalSubmitted = false;
    this.lanesForm.reset();
    this.terminalsForm.reset();
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

  showMoreData(type) {
    if (type == 'Lane') {
      this.showAllLanes = !this.showAllLanes;
    }
    else if (type == 'Terminal') {
      this.showAllTerminal = !this.showAllTerminal;
    }
  }

  regionFormSubmit({ value, valid }) {
    let stateIdRegion;
    if (valid) {
      const existingSelectedIds = this.selecteRegion.map(region => region.id)
      console.log(existingSelectedIds, 'existingSelectedIds')
      console.log(existingSelectedIds)
      // Map selected regions to get only the IDs
      let selectedRegionIds = this.selectedRegions.map(region => region.id);
      console.log('Selected Regions:', selectedRegionIds);
      const allSelectedIds = [...new Set([...existingSelectedIds, ...selectedRegionIds])];
      this.loading = true;
      this.selectedRegions = [];
      value.preferredRegions = allSelectedIds.join(','); // Join as comma-separated string if needed
      let APIparams = {
        apiKey: this.sharedService.updateUserUrl(),
        uri: '',
        postBody: value,
      };
      this.commonService.put(APIparams).subscribe(
        (success) => {
          this.loading = false;
          this.selecteRegion = []
          this.preferredRegionsState = null
          this.getCarriers()
          if (success.success === true) {
            this.alertService.showNotificationMessage(
              'success',
              'bottom',
              'left',
              'txt_s',
              'check_circle',
              'Region & Headquater',
              'You have successfully updated Prefrered Regions information.'
            );
          } else if (success.success === false) {

            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'Region & Headquater',
              'You have not successfully updated Prefrered Regions information.'
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
  laneRegionSelect(event: any) {
    let search = (event.target as HTMLInputElement).value.toLowerCase();//event.target.value.toLowerCase();
    console.log(this.selecteRegion, this.selectedRegions)

    this.preferredRegionsState = this.regionsList.filter((regionsList: any) =>
      regionsList.state.toLowerCase().includes(search) && !this.selecteRegion.some(selected => selected.id === regionsList.id) && !this.selectedRegions.some(selected => selected.id === regionsList.id)
    );
    let preferredRegionsState = this.preferredRegionsState.forEach(element => {
      if (element.region) {
        // Convert specific US regions to "US"
        if ([
          "USA - West",
          "USA - South East",
          "USA - North East",
          "USA - Midwest",
          "USA - South West"
        ].includes(element.region)) {
          element.region = "US";
        }
        // Convert "Canada" (case insensitive) to "CA"
        if (element.region.toLowerCase() === "canada") {
          element.region = "CA";
        } else if (element.region.toLowerCase() === "mexico") {
          element.region = "MX";
        }
      }
    });
  }
  selectRegion(event: MatAutocompleteSelectedEvent) {
    const selectedRegion = event.option.value;
    if (!this.selectedRegions.some(region => region.id === selectedRegion.id)) {
      this.selectedRegions.push({ id: selectedRegion.id, state: selectedRegion.state, region: selectedRegion.region });
    }
    this.selectRegionForm.get('preferredRegions')?.setValue('');
  }
  removeRegion(region: any) {
    const index = this.selectedRegions.indexOf(region);
    if (index >= 0) {
      this.selectedRegions.splice(index, 1);
    }
  }
  removeState(id: number) {
    // Find the index of the item with the matching ID
    console.log(id)
    const index = this.selecteRegion.findIndex(region => region.id === id);
    if (index > -1) {
      this.selecteRegion.splice(index, 1); // Remove the item
    }
    let value = {
      preferredRegions: this.selecteRegion.length > 0 ? this.selecteRegion.map(region => region.id).join(', ') : ' '
    }
    console.log(value);
    let APIparams = {
      apiKey: this.sharedService.updateUserUrl(),
      uri: '',
      postBody: value
    };
    console.log(APIparams, 'APIparams')
    this.commonService.put(APIparams).subscribe(
      (success) => {
        this.loading = false;
        this.selecteRegion = []
        this.preferredRegionsState = null
        this.getCarriers()
        if (success.success === true) {
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            'Region & Headquater',
            'You have successfully removed Prefrered Regions information.'
          );
        } else if (success.success === false) {

          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_d',
            'check_circle',
            'Region & Headquater',
            'You have not successfully removed Prefrered Regions information.'
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
