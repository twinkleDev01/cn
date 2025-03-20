import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { PopupComponent } from 'src/app/shared/popup/popup.component';

@Component({
  selector: 'app-find-carriers',
  templateUrl: './find-carriers.component.html',
  styleUrls: ['./find-carriers.component.scss']
})
export class FindCarriersComponent implements OnInit, AfterViewInit {
  public carrierList = []
  public loader = false;
  public spinner = false;
  public totalPage: any;
  public totalRecords: any;
  public page = 1;
  public cargoType = []
  public isQueryParamNull = false;
  public queryParamValue: any;
  public getTotalHeight: any;
  public dataNotFound = false;
  public param: any;
  public scrolled: any;


  public filterOpen = true;
  public subscription: any;
  scheduleRecord = true;
  constructor(private commonService: CommonService, public dialog: MatDialog, private router: Router, public activatedRoute: ActivatedRoute, public alertService: AlertService,) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    this.getTotalHeight = window.innerHeight + window.scrollY;
    this.scrolled = $(window).scrollTop()
    if ($(document).height() - $(window).scrollTop() <= $(window).height() + 1) {
      if (this.page !== this.totalPage && this.page >= 1 && this.totalPage && this.carrierList?.length > 0 && !this.spinner) {
        this.page = this.page + 1;
        this.dataNotFound = false;
        this.carrierGetMore();
      } else if (this.loader === false) {
        this.dataNotFound = true;
      }
    }
  }


  ngOnInit(): void {

    this.activatedRoute.queryParamMap.subscribe((value) => {
      this.queryParamValue = value['params']
      if(this.param == null){
      this.carrierGetAPI(this.queryParamValue)
      }
    })
  }

  ngAfterViewInit() {


  }
  toggleFilter() {
    this.filterOpen = !this.filterOpen
  }


  removeEmptyValues(obj) {
    for (let key in obj) {
      if (obj[key] == 0 || obj[key] == '' || obj[key] == 0) {
        delete obj[key];
      }
    }
    return obj;
  }

  convertArraysToCommaSeparatedStrings(params) {
    const newParams = {};
    for (const key in params) {
      if (Array.isArray(params[key])) {
        newParams[key] = params[key].join(',');
      } else {
        newParams[key] = params[key];
      }
    }
    return newParams;
  }

  carrierGetAPI(queryParams) {
    this.scheduleRecord = true;

    queryParams = this.removeEmptyValues(queryParams);
    this.isQueryParamNull = Boolean(queryParams && Object.keys(queryParams).length);
    this.loader = true;
    let uri = null;
    queryParams = this.convertArraysToCommaSeparatedStrings(queryParams); // Convert arrays to comma-separated strings
    let newParams = { page: this.page, limit: 10, ...queryParams };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.CARRIERSEARCH.SEARCHLIST,
      uri: uri,
    };
    this.router.navigate(['/carrier-data-exports/find-carriers'], { queryParams: queryParams });
    this.subscription = this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.loader = false;
        this.carrierList = ServerRes.response.allCarrier;
        this.totalPage = ServerRes.response.totalPage;
        this.totalRecords = ServerRes.response.totalRecords;
        if (ServerRes.response.totalRecords && this.totalRecords <= 1000) {
          this.scheduleRecord = false;
        } else {
          this.scheduleRecord = true;
        }
      }
    }, (error) => {
      this.loader = false;
    });
  }
  stopFetching() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null; // Optional: Clear reference
      this.loader = false; // Stop loader
    }
  }
  carrierGetMore() {
    this.spinner = true;
    let uri = null;
    let newParams = { page: this.page, limit: 10, ...this.queryParamValue };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.CARRIERSEARCH.SEARCHLIST,
      uri: uri,
    };
    this.subscription = this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.spinner = false;
        if (ServerRes.response.allCarrier)
          this.carrierList = [...this.carrierList, ...ServerRes.response.allCarrier]
        this.totalPage = ServerRes.response.totalPage
        this.totalRecords = ServerRes.response.totalRecords
        if (ServerRes.response.totalRecords && this.totalRecords <= 1000) {
          this.scheduleRecord = false
        } else {
          this.scheduleRecord = true;
        }
      }
    }, (error) => {
      this.spinner = false
    });
  }

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  filterPopup() {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: "670px",
      height: "80%",
      data: { openPop: 'carrierFilter', loadData: this.queryParamValue },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "ok") {
        this.stopFetching()

        this.param = result.value;
        this.page = 1;
        this.carrierGetAPI(result.value)
      }
    });
  }


  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  scheduleReport() {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: "670px",
      height: "auto",
      data: { openPop: 'scheduleReportForm' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "ok") {
        let formData = new FormData()
        formData.append("email", result.value.email)
        formData.append("reportName", result.value.reportName)
        formData.append("userType", "carrier")
        formData.append("filters", Object.entries(this.convertArraysToCommaSeparatedStrings(this.queryParamValue)).map(([key, value]) => `${key}=${value}`).join('&'))
        formData.append("reportType", "flat")
        formData.append("limit", this.totalRecords)
        this.scheduleReportapi(formData)
      }
    });
  }

  scheduleReportapi(formData) {
    let uri = '';
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.CARRIERSEARCH.SCHEDULEREPORT,
      uri: uri,
      postBody: formData
    };
    this.commonService.post(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {

        this.alertService.showNotificationMessage(
          'success',
          'bottom',
          'left',
          'txt_s',
          'check_circle',
          'Lane',
          'You have successfully Schedule Report.'
        );
      } else if (ServerRes.success === false) {
        this.alertService.showNotificationMessage(
          'danger',
          'bottom',
          'left',
          'txt_d',
          'check_circle',
          'Lane',
          'You have not successfully Schedule Report.'
        );
      }
    }, (error) => {
      this.alertService.showNotificationMessage(
        'danger',
        'bottom',
        'left',
        'txt_g',
        'error',
        'Unexpected Error',
        AppSettings.ERROR
      );

    });

  }
  getFormattedAddress(address1, city, stateCode, zipShort,countryCode){
    let formattedAddress = '';
    const toTitleCase = (str: string) => 
      str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    if (address1) {
      formattedAddress += toTitleCase(address1.trim()) + ', ';
    }
    if (city) {
      formattedAddress += toTitleCase(city.trim()) + ', ';
    }
    if (stateCode) {
      formattedAddress += stateCode.trim() + ', ';  // State codes are usually uppercase
    }
    if (zipShort) {
      formattedAddress += zipShort.trim() + ', ';
    }
    if (countryCode) {
      formattedAddress += countryCode.trim();
    }
  
    formattedAddress = formattedAddress.trim();
  
    // Ensure no whitespace before commas
    formattedAddress = formattedAddress.replace(/\s+,/g, ',');
  
    return formattedAddress;
  }



}
