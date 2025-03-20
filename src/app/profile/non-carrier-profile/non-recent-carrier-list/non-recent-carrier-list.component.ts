import { Component, HostListener, OnInit } from '@angular/core';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { StatusSetting } from 'src/app/commons/setting/status_setting';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from 'src/app/shared/popup/popup.component';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/commons/service/shared.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';

@Component({
  selector: 'app-non-recent-carrier-list',
  templateUrl: './non-recent-carrier-list.component.html',
  styleUrls: ['./non-recent-carrier-list.component.css']
})

export class NonRecentCarrierListComponent implements OnInit {
  carrierList: any;
  public carrierOperationName: any;
  public page = 1;
  public totalPage = 1;
  public totalRecords: any;
  public spinnerLoader = false;
  public dataNotFound = false;
  public getTotalHeight: any;
  public skeletonLoader: boolean = false;
  public carrierOperation: any;
  public userVerification: any;
  public showSummeryInfo: boolean[] = [];
  nonCarrierRecentViewList: any = [];
  public configData: any;
  public days: any;
  public hours: any;
  public minutes: any;
  public seconds: any;

  constructor(public alertService: AlertService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private sharedService: SharedService
  ) { }


  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    this.getTotalHeight = window.innerHeight + window.scrollY;
    if ($(window).scrollTop() + 1 >= $(document).height() - $(window).height()) {
      if (this.page !== this.totalPage && this.page >= 1 && this.totalPage && this.nonCarrierRecentViewList?.length > 0) {
        this.page = this.page + 1;
        this.spinnerLoader = true;
        this.dataNotFound = false;
        this.getMoreData();
      } else if (this.spinnerLoader === false) {
        this.dataNotFound = true;
      }
    }
  }

  ngOnInit(): void {
    this.userVerification = StatusSetting.userVerification;
    this.carrierOperation = StatusSetting.carrierOperation;
    this.skeletonLoader = true;
    this.getNonCarrierRecentViewList()
    let configValue = this.sharedService.getConfig();

    if (configValue !== undefined) {
      this.getConfigSet(configValue);
    }
    this.commonService.configData.subscribe((userData) => {
      this.getConfigSet(userData);
    });
  }

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  redirectPageCarrier(dotNumber: any, companyName: any) {
    let newCompanyName = companyName.replace(/\s/g, '-').toLowerCase();
    window.location.href = environment.domain + "/carrier-profile/" + dotNumber + "/" + newCompanyName + "/#review";
  }

  getConfigSet(configValue: any) {
    this.configData = configValue?.InsuranceTypes
  }

  getNonCarrierRecentViewList() {
    this.skeletonLoader = true;
    let uri = null;
    let newParams = {
      limit: '4',
      page: this.page,
    };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.RECENTVIEW.NONCARRIERRECETVIEW,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true || ServerRes?.status == true) {
        this.nonCarrierRecentViewList = ServerRes.response;
        this.totalPage = ServerRes?.totalPages;
        this.totalRecords = ServerRes?.totalRecords;
        for (let index = 0; index < this.nonCarrierRecentViewList?.length; index++) {
          for (let subIndex = 0; subIndex < this.carrierOperation?.length; subIndex++) {
            if (this.carrierOperation[subIndex].id == this.nonCarrierRecentViewList[index]?.carrier?.carrierOperation) {
              this.carrierOperationName = this.carrierOperation[subIndex].name;
            }
          }
        }
        this.skeletonLoader = false;
      } else {
        this.nonCarrierRecentViewList = [];
        this.skeletonLoader = false;
      }
    }, (error) => {
      this.nonCarrierRecentViewList = [];
      this.skeletonLoader = false;
    });
  }

  getAPIParam() {
    let APIparams, params;
    params = { limit: 4, page: this.page, };
    let url;
    url = AppSettings.APIsNameArray.RECENTVIEW.NONCARRIERRECETVIEW;
    APIparams = {
      apiKey: url,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }

  getMoreData() {
    var APIparams = this.getAPIParam();
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      let result = ServerRes.response;
      this.spinnerLoader = false;
      if (
        ServerRes.response &&
        ServerRes.response?.length > 0
      ) {
        for (let v = 0; v < result.length; v++) {
          if (result[v]) this.nonCarrierRecentViewList.push(result[v]);
        }
      }
    });
  }

  addNotes(id: any, showCarrierNotes: any) {
    if (showCarrierNotes) {
      const dialogRef = this.dialog.open(PopupComponent, {
        disableClose: true,
        // backdropClass: AppSettings.backdropClass,
        backdropClass: 'cn_custom_popup',
        width: '460px',
        data: {
          openPop: 'editNote',
          carrierId: id,
          note: showCarrierNotes?.note,
          noteId: showCarrierNotes?.id,
          userId: showCarrierNotes?.userId
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.event == 'ok') {
          this.nonCarrierRecentViewList = [];
          this.page = 1;
          this.getNonCarrierRecentViewList();

        }
      });
    }
    else {
      const dialogRef = this.dialog.open(PopupComponent, {
        disableClose: true,
        // backdropClass: AppSettings.backdropClass,
        backdropClass: 'cn_custom_popup',
        width: '460px',
        data: {
          openPop: 'addNote',
          carrierId: id
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.event == 'ok') {
          this.nonCarrierRecentViewList = [];
          this.page = 1;
          this.getNonCarrierRecentViewList();
        }
      });
    }

  }

  showSummery(type: any, index: any) {
    if (type == 'showSummery') {
      this.showSummeryInfo[index] = true;
    }
    if (type == 'hideSummery') {
      this.showSummeryInfo[index] = false;
    }
  }

  savedCarrier(id) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      // backdropClass: AppSettings.backdropClass,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: {
        openPop: 'saveCarrier',
        carrierId:id

      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'ok') {
        this.nonCarrierRecentViewList = [];
        this.page = 1;
        this.getNonCarrierRecentViewList();

      }
    });
  }

  // fetch insurence type 
  getInsuranceName(insuranceType: number): string {
    const insurance = this.configData.find((insuranceData: any) => insuranceData.id === insuranceType);
    return insurance ? insurance.name : '-';
  }
  calculateDiff(date) {
    const utcDate = new Date();
    let date1 = new Date();
    // utcDate.getUTCFullYear(),
    // utcDate.getUTCMonth(),
    // utcDate.getUTCDate(),
    // utcDate.getUTCHours(),
    // utcDate.getUTCMinutes(),
    // utcDate.getUTCSeconds()
    let date2 = new Date(date);

    const diffMilliseconds = Math.abs(date1.getTime() - date2.getTime());

    const millisecondsInSecond = 1000;
    const millisecondsInMinute = millisecondsInSecond * 60;
    const millisecondsInHour = millisecondsInMinute * 60;
    const millisecondsInDay = millisecondsInHour * 24;

    this.days = Math.floor(diffMilliseconds / millisecondsInDay);
    this.hours = Math.floor((diffMilliseconds % millisecondsInDay) / millisecondsInHour);
    this.minutes = Math.floor((diffMilliseconds % millisecondsInHour) / millisecondsInMinute);
    this.seconds = Math.floor((diffMilliseconds % millisecondsInMinute) / millisecondsInSecond);

  }

}

