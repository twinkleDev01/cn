import { Component, HostListener, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "src/app/commons/service/alert.service";
import { CommonService } from "src/app/commons/service/common.service";
import { AppSettings } from "src/app/commons/setting/app_setting";
import { environment } from "src/environments/environment";
@Component({
  selector: 'app-write-a-review',
  templateUrl: './review-invitation.component.html',
  styleUrls: ['./review-invitation.component.css']
})
export class ReviewInvitationComponent implements OnInit {
  public reviewInvitationList: any = [];
  public skeletonLoader = false;
  //
  public loading: boolean = false
  public page = 1;
  public spinnerLoader = false;
  public dataNotFound = false;
  public totalRecords: any;
  public showAll: boolean[] = []
  public getTotalHeight: any;
  public totalPage = 1;

  constructor(
    private commonService: CommonService,
    private router: Router,
    public alertService: AlertService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) { }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    this.getTotalHeight = window.innerHeight + window.scrollY;
    if ($(window).scrollTop() + 1 >= $(document).height() - $(window).height()) {
      if (this.page !== this.totalPage && this.page >= 1 && this.totalPage && this.reviewInvitationList.length > 0) {
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
    this.showAll = this.showAll.map(value => !value);

    if (localStorage.getItem("access_token")) {
      this.skeletonLoader = true;
      this.page = 1;
      this.getReviewInvitationList();
    }
  }
  UTCDate(date: any) {
    date = new Date(date + ' ' + 'UTC');
    return date;
  }
  getReviewInvitationList() {
    this.skeletonLoader = true;
    this.page = 1
    let uri = null;
    let APIparams, params;
    params = { limit: 4, page: 1, };
    if (params) uri = this.commonService.getAPIUriFromParams(params);
    APIparams = {
      apiKey: AppSettings.APIsNameArray.REVIEW.REVIEWINVITATIONLIST,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {

        if (ServerRes.response.invitedUserList) {
          this.reviewInvitationList = ServerRes.response.invitedUserList;
          // this.averageRating = ServerRes.response.review.carrier.averageRating
          this.totalPage = ServerRes.response.totalPages;
          this.totalRecords = ServerRes.response.totalRecords;
         
          this.skeletonLoader = false;
        } else {
          this.reviewInvitationList = ServerRes.response;
          this.totalPage = 0;
          this.skeletonLoader = false;
        }
      } else {
        this.reviewInvitationList = []
        this.totalPage = 0;
        this.skeletonLoader = false;
      }
    });

  }
  getAPIParam() {
    let APIparams, params;
    params = { limit: 4, page: this.page, };
    let url;
    url = AppSettings.APIsNameArray.REVIEW.REVIEWINVITATIONLIST;
    APIparams = {
      apiKey: url,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }
  getMoreData() {
    var APIparams = this.getAPIParam();
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      let result = ServerRes.response.invitedUserList
        ;
      this.spinnerLoader = false;
      if (
        ServerRes.response.invitedUserList
        &&
        ServerRes.response.invitedUserList
          .length > 0
      ) {
        for (let v = 0; v < result.length; v++) {
          if (result[v]) this.reviewInvitationList.push(result[v]);
        }
      }
    });
  }
  redirectPageCity(reviewInvitationData: any) {

    if (reviewInvitationData) {
      this.router.navigateByUrl('/review/write-a-review-for-carrier?carrierId=' + reviewInvitationData?.carrierId)
    }
  }
  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }
  redirectPageCarrier(dotNumber:any,companyName:any){
    let newCompanyName = companyName.replace(/\s/g, '-').toLowerCase();
    window.location.href = environment.domain+"/carrier-profile/"+ dotNumber + "/" + newCompanyName + "/#review";
  }

  // formatted Address
  isAddressEmpty(city:any, stateCode:any, zipShort:any): boolean {
    return  !city &&
            !stateCode &&
           !zipShort;
  }

  // Method to format an address for display
  getFormattedAddress(city:any, stateCode:any, zipShort:any): string {
    let formattedAddress = '';
    if (city) {
      formattedAddress += city.trim() + ' ';
    }
    if (stateCode) {
      formattedAddress += stateCode.trim() + ' ';
    }
    if (zipShort) {
      formattedAddress += zipShort.trim();
    }
    formattedAddress = formattedAddress.trim();

    // Ensure no whitespace before commas
    formattedAddress = formattedAddress.replace(/\s+,/g, ',');
  
    return formattedAddress;
  
  }
}