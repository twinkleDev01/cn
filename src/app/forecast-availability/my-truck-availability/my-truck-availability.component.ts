import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { PopupComponent } from 'src/app/shared/popup/popup.component';

@Component({
  selector: 'app-my-truck-availability',
  templateUrl: './my-truck-availability.component.html',
  styleUrls: ['./my-truck-availability.component.css']
})
export class MyTruckAvailabilityComponent implements OnInit {
  loadAvailibilityData: any=[];
  message: any;
  public skeletonLoader:boolean=false;
  public getTotalHeight:any;
  public page = 1;
  public totalPage = 1;
  totalRecords:number
  public spinnerLoader = false;
  public dataNotFound = false;
  public loading: boolean=false;
  public params: any = {};
  public orderDir = '';
  showAdvancedFilter = false;

  constructor(
    private commonService: CommonService, 
    public dialog: MatDialog,
    public alertService: AlertService

  ) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    this.getTotalHeight = window.innerHeight + window.scrollY;
    if ($(document).height()-$(window).scrollTop() <= $(window).height()+1) {
      if (this.page !== this.totalPage && this.page >= 1 && this.totalPage && this.loadAvailibilityData?.length > 0) {
        this.page = this.page + 1;
        this.spinnerLoader = true;
        this.dataNotFound = false;
        this.getMoreData(null);
      } else if (this.spinnerLoader === false) {
        this.dataNotFound = true;
      }
    }
  }

  ngOnInit(): void {
    this.skeletonLoader=true
    this.getLoadAvailibility();
  }
  
  getAPIParam(str) {
    let APIparams, params;
    if (str) params = { limit: 5, page: this.page, sort: this.orderDir };
    else params = { limit: 5, page: this.page, sort: this.orderDir };
    params = { limit: 5, page: this.page, sort: this.orderDir };
    let url;
    url = AppSettings.APIsNameArray.AVAILIBILITY.LIST,
      APIparams = {
        apiKey: url,
        uri: this.commonService.getAPIUriFromParams(params),
      };
    return APIparams;
  }
  getMoreData(str) {
    var APIparams = this.getAPIParam(str);
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      let result = ServerRes.response;
      this.totalPage = ServerRes.totalPages;
      this.spinnerLoader = false;
      if (
        ServerRes.response &&
        ServerRes.response.length > 0
      ) {
        for (let v = 0; v < result.length; v++) {
          if (result[v]) this.loadAvailibilityData.push(result[v]);
        }
      }
    });
  }
  
  getLoadAvailibility() {
    let uri = null;

    this.skeletonLoader=true
    let APIparams, params;
    params = { limit: 5, page: this.page, };
    (this.params.limit = 5), (this.params.page = this.page), (this.params.sort = this.orderDir);

    if (this.params) uri = this.commonService.getAPIUriFromParams(this.params);
    APIparams = {
      apiKey: AppSettings.APIsNameArray.AVAILIBILITY.LIST,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {

      if (ServerRes.success === true) {
        this.totalRecords= ServerRes.total
        this.totalPage = ServerRes.totalPages
        this.loadAvailibilityData = ServerRes.response; 
        this.skeletonLoader=false;
      } else{
        this.loadAvailibilityData= [];
        this.skeletonLoader=false;
      }
    },(error) => {
      this.message=error.error.message
      this.loadAvailibilityData = [];
      this.skeletonLoader=false;
    });
  }

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  editLoadAvailibility(loadData:any,type:any){
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: "460px",
      data: {
        openPop: type,
        loadData: loadData,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "Ok") {
        this.loadAvailibilityData= [];
        this.page = 1 ;
        this.getLoadAvailibility()
      }
    });
  }
  removeloadAvailibilityPopup(loadAvailibilityID: any, type: any, index: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: "460px",
      data: { openPop: type },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "ok") {
   
        this.removeloadAvailibility(loadAvailibilityID, index) 


      }
    });
  }

  removeloadAvailibility(loadAvailibilityID, index) {
    this.loading = true;
    let uri = null;
    let newParams = {
      'id':loadAvailibilityID
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.AVAILIBILITY.DELETE,
      uri: uri,
    };
    this.commonService.delete(APIparams).subscribe(
      (success) => {
        if (success.success === true) {
          this.loading = false;
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
        this.loading = false;
      }
    );
  }

    // Profile analytics table
    displayedColumns: string[] = ['loadId', 'truckName', 'carrierInformation', 'pickup', 'dropOff', 'distance', 'frequency', 'equipmentType', 'shipmentType', 'costPerMile', 'notes', 'action'];
    dataSource = [
      { loadId: '001',
        truckName: 'Truck Name',
        carrierInformation: 'Carrier info',
        pickup: 'Alachua, Florida, US',
        dropOff: 'Alachua, Florida, US',
        distance: '1234',
        frequency: 'Every Day',
        frequencyPicTime: '01 PM',
        frequencyDropTime: '08 PM',
        equipmentType: 'Auto Carrier Trailer',
        shipmentType: 'LTL',
        shipmentTypeInfo: 'Less Than Truckload',
        costPerMile: '2',
        weight: '1,750',
        length: '44',
        notes: 'Notes',
        action: ''
      },
      { loadId: '002',
        truckName: 'Truck Name',
        carrierInformation: 'Carrier info',
        pickup: 'Apple Valley, CA, US',
        dropOff: 'Alachua, Florida, US',
        distance: '1234',
        frequency: 'Every Week',
        frequencyPicTime: 'Monday 01 PM',
        frequencyDropTime: 'Tuesday 04 PM',
        equipmentType: 'Box Truck',
        shipmentType: 'FTL',
        shipmentTypeInfo: 'Full Truckload',
        costPerMile: '2.270',
        weight: '14,000',
        length: '26',
        notes: 'Notes',
        action: ''
      },
      { loadId: '003',
        truckName: 'Truck Name',
        carrierInformation: 'Carrier info',
        pickup: 'Alachua, Florida, US',
        dropOff: 'Alachua, Florida, US',
        distance: '1234',
        frequency: 'Every Month',
        frequencyPicTime: '12 Feb 01 PM',
        frequencyDropTime: '15 Feb 05 PM',
        equipmentType: 'Cargo Van',
        shipmentType: 'Partial Shipments',
        costPerMile: '2.86',
        weight: '4,985',
        length: '20',
        notes: 'Notes',
        action: ''
      },
      { loadId: '004',
        truckName: 'Truck Name',
        carrierInformation: 'Carrier info',
        pickup: 'Alachua, Florida, US',
        dropOff: 'Alachua, Florida, US',
        distance: '1234',
        frequency: 'Only One time',
        frequencyPicTime: '12 Feb, 2025 01 PM',
        frequencyDropTime: '13 Feb, 2025 05 PM',
        equipmentType: 'Double Drop Trailer',
        shipmentType: 'Partial Shipments',
        costPerMile: '1.49',
        weight: '5,200',
        length: '30',
        notes: 'Notes',
        action: ''
      },
    ];
    // dataSource: any[] = [];
    // Advanced filter toggle
    toggleFilter() {
      this.showAdvancedFilter = !this.showAdvancedFilter;
    }
    formatFrequency(frequency: string): string {
      if (!frequency) return '';
      return frequency.toLowerCase().replace(/\s+/g, '_');
    }
}
