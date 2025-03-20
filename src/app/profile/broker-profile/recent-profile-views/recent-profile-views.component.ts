import { Component, HostListener, OnInit } from '@angular/core';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import * as $ from 'jquery';

@Component({
  selector: 'app-recent-profile-views',
  templateUrl: './recent-profile-views.component.html',
  styleUrls: ['./recent-profile-views.component.css']
})
export class BrokerRecentProfileViewsComponent implements OnInit {
  public recentProfileView: any = [];
  public getTotalHeight: any;
  public page = 1;
  public totalPages = 1;
  public totalRecords: any;
  public days: any;
  public hours: any;
  public minutes: any;
  public seconds: any;
  public skeletonLoader: boolean = false;
  public spinnerLoader: boolean = false;
  public dataNotFound: boolean = false
  constructor(public alertService: AlertService,
    private commonService: CommonService,) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    this.getTotalHeight = window.innerHeight + window.scrollY;
    if ($(window).scrollTop() + 1 >= $(document).height() - $(window).height()) {
      if (this.page !== this.totalPages && this.page >= 1 && this.totalPages && this.recentProfileView.length > 0) {
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
    this.skeletonLoader = true
    this.getSaveCarrierList()

  }

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  getSaveCarrierList() {
    this.skeletonLoader = true;
    let uri = null;
    let newParams = {
      limit: 10,
      page: this.page,

    };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.SAVECARRIRLIST.BROKERRECENTVIEWS,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.recentProfileView = ServerRes.response.data;

        this.totalPages = ServerRes.response?.totalPages;
        this.totalRecords = ServerRes.response?.totalRecords;
        this.skeletonLoader = false;

      } else {
        this.recentProfileView = [];
        this.skeletonLoader = false;
      }
    }, (error) => {
      this.recentProfileView = [];
      this.skeletonLoader = false;
    });
  }

  UTCDate(date: any) {
    let date1 = new Date();
    let date2 = new Date(date);

    let Difference_In_Time =
      date2.getTime() - date1.getTime();

    // two dates
    this.days =
      Math.round
        (Difference_In_Time / (1000 * 3600 * 24));
    return date;
  }

  getAPIParam() {
    let APIparams, params;
    params = { limit: 10, page: this.page, };
    let url;
    url = AppSettings.APIsNameArray.SAVECARRIRLIST.BROKERRECENTVIEWS;
    APIparams = {
      apiKey: url,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }

  getMoreData() {
    var APIparams = this.getAPIParam();
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      let result = ServerRes.response.data;
      this.spinnerLoader = false;
      if (
        ServerRes.response.data &&
        ServerRes.response.data.length > 0
      ) {
        for (let v = 0; v < result.length; v++) {
          if (result[v]) this.recentProfileView.push(result[v]);
        }
      }
    });
  }
  
  getFormattedAddress( city, stateCode, zipShort,countryCode){
    let formattedAddress = '';
    const toTitleCase = (str: string) => 
      str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    if (city) {
      formattedAddress += toTitleCase(city.trim());
    }
    if (stateCode) {
      formattedAddress += ', '+ stateCode.trim() ;  // State codes are usually uppercase
    }
    if (zipShort) {
      formattedAddress += ', ' + zipShort.trim();
    }
    if (countryCode) {
      formattedAddress += ', '+ countryCode.trim();
    }
    formattedAddress = formattedAddress.trim();
    formattedAddress = formattedAddress.replace(/\s+,/g, ',');
    return formattedAddress;
  }

  calculateDiff(date) {
    const utcDate = new Date();
    let date1 = new Date(utcDate.getUTCFullYear(),
      utcDate.getUTCMonth(),
      utcDate.getUTCDate(),
      utcDate.getUTCHours(),
      utcDate.getUTCMinutes(),
      utcDate.getUTCSeconds()
    );
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
function moment(currentDate: Date) {
  throw new Error('Function not implemented.');
}

