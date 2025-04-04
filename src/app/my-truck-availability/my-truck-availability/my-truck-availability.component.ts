import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { PopupComponent } from 'src/app/shared/popup/popup.component';

@Component({
  selector: 'app-my-truck-availability',
  templateUrl: './my-truck-availability.component.html',
  styleUrls: ['./my-truck-availability.component.css'],
})
export class MyTruckAvailabilityComponent implements OnInit {
  loadAvailibilityData: any = [];
  message: any;
  public page = 1;
  public totalPage = 1;
  totalRecords: number;
  public spinnerLoader = false;
  public dataNotFound = false;
  public params: any = {};
  public orderDir = '';
  showAdvancedFilter = false;
    dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(
    private commonService: CommonService,
    public dialog: MatDialog,
    public alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getLoadAvailibility();
  }

  getAPIParam(str) {
    let APIparams, params;
    if (str) params = { limit: 5, page: this.page, sort: this.orderDir };
    else params = { limit: 5, page: this.page, sort: this.orderDir };
    params = { limit: 5, page: this.page, sort: this.orderDir };
    let url;
    (url = AppSettings.APIsNameArray.AVAILIBILITY.LIST),
      (APIparams = {
        apiKey: url,
        uri: this.commonService.getAPIUriFromParams(params),
      });
    return APIparams;
  }
  getMoreData(str) {
    var APIparams = this.getAPIParam(str);
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      let result = ServerRes.response;
      this.totalPage = ServerRes.totalPages;
      this.spinnerLoader = false;
      if (ServerRes.response && ServerRes.response.length > 0) {
        for (let v = 0; v < result.length; v++) {
          if (result[v]) this.loadAvailibilityData.push(result[v]);
        }
      }
    });
  }

  getLoadAvailibility() {
    let uri = null;

    this.spinnerLoader = true;
    let APIparams, params;
    params = { limit: 10, page: this.page };
    (this.params.limit = 10),
      (this.params.page = this.page),
      (this.params.sort = this.orderDir);

    if (this.params) uri = this.commonService.getAPIUriFromParams(this.params);
    APIparams = {
      apiKey: AppSettings.APIsNameArray.AVAILIBILITY.LIST,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe(
      (ServerRes) => {
         const newData = ServerRes;
        this.dataSource.data = newData;
        console.log(ServerRes,"799", this.dataSource)
        if (ServerRes.success === true) {
          this.totalRecords = ServerRes.total;
          this.totalPage = ServerRes.totalPages;
          this.loadAvailibilityData = ServerRes.response;
          this.spinnerLoader = false;
        } else {
          this.loadAvailibilityData = [];
          this.spinnerLoader = false;
        }
      },
      (error) => {
        this.message = error.error.message;
        this.loadAvailibilityData = [];
        this.spinnerLoader = false;
      }
    );
  }

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  editLoadAvailibility(loadData: any, type: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: {
        openPop: type,
        loadData: loadData,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Ok') {
        this.loadAvailibilityData = [];
        this.page = 1;
        this.getLoadAvailibility();
      }
    });
  }
  removeloadAvailibilityPopup(loadAvailibilityID: any, type: any, index: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: { openPop: type },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'ok') {
        this.removeloadAvailibility(loadAvailibilityID, index);
      }
    });
  }

  removeloadAvailibility(loadAvailibilityID, index) {
    this.spinnerLoader = true;
    let uri = null;
    let newParams = {
      id: loadAvailibilityID,
    };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.AVAILIBILITY.DELETE,
      uri: uri,
    };
    this.commonService.delete(APIparams).subscribe(
      (success) => {
        if (success.success === true) {
          this.spinnerLoader= true;
          this.loadAvailibilityData.splice(index, 1);
          this.loadAvailibilityData = [];

          this.page = 1;
          this.getLoadAvailibility();
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            'Pending Review Invitation',
            'You have successfully withdrawal Pending Review Invitation.'
          );
        } else if (success.success === false) {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_d',
            'cancel',
            'Pending Review Invitation',
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
        this.spinnerLoader = false;
      }
    );
  }

  // Profile analytics table
  displayedColumns: string[] = [
    'loadId',
    'truckName',
    'carrierInformation',
    'pickup',
    'dropOff',
    'distance',
    'frequency',
    'equipmentType',
    'shipmentType',
    'costPerMile',
    'notes',
    'action',
  ];

  toggleFilter() {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }
  formatFrequency(frequency: string): string {
    if (!frequency) return '';
    return frequency.toLowerCase().replace(/\s+/g, '_');
  }
}
