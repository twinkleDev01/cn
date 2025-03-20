import { Component, OnInit, HostListener } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AlertService } from "src/app/commons/service/alert.service";
import { CommonService } from "src/app/commons/service/common.service";
import { AppSettings } from "src/app/commons/setting/app_setting";
import { StatusSetting } from "src/app/commons/setting/status_setting";
import { PopupComponent } from "src/app/shared/popup/popup.component";
@Component({
  selector: 'app-',
  templateUrl: './pending-review-invitation.component.html',
  styleUrls: ['./pending-review-invitation.component.css']
})
export class PendingReviewInvitationComponent implements OnInit {
  public page = 1;
  public params: any = {};
  public orderDir = '';
  public sortingValue = '';
  public skeletonLoader = false;
  public loading = false;
  public message: any;
  public pendingreviewInvitationList: any = [];
  public getTotalHeight: any;
  public totalPage = 1;
  public spinnerLoader = false;
  public dataNotFound = false;
  public totalRecords: any;
  public information:any;
  constructor(
    private commonService: CommonService,
    public dialog: MatDialog,
    public alertService: AlertService
  ) { }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    this.getTotalHeight = window.innerHeight + window.scrollY;
    if (
      $(window).scrollTop() + 1 >=
      $(document).height() - $(window).height()
    ) {
      if (
        this.page !== this.totalPage &&
        this.page >= 1 &&
        this.totalPage &&
        this.pendingreviewInvitationList.length > 0
      ) {
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
    this.getPendingReviewInvitationList();
    this.information=StatusSetting.information;

  }


  getPendingReviewInvitationList() {
    this.skeletonLoader = true;
    let uri = null;
    this.orderDir = this.sortingValue;
    // this.newOld = this.sortingValueNew
    let APIparams, params;
    params = { limit: 4, page: this.page, };
    (this.params.limit = 4), (this.params.page = this.page), (this.params.sort = this.orderDir);

    if (this.params) uri = this.commonService.getAPIUriFromParams(this.params);
    APIparams = {
      apiKey: AppSettings.APIsNameArray.REVIEW.PENDINGREVIEWINVITATIONLIST,
      uri: uri,
    };
    // 
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.pendingreviewInvitationList = ServerRes.response.pendingListData
        this.totalPage = ServerRes.response.totalPages;
        this.totalRecords = ServerRes.response.totalRecords;
        this.skeletonLoader = false;
      } else {
        this.pendingreviewInvitationList = [];
        this.totalPage = 0;
        this.skeletonLoader = false;
      }
    }, (error) => {
      this.message = error.error.message
      this.pendingreviewInvitationList = [];
      this.skeletonLoader = false;
    });
  }
  viewPendingreviewInvitation(pendingreviewInvitationData: any, type: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: "460px",
      data: {
        fullName: pendingreviewInvitationData?.fullName,
        email: pendingreviewInvitationData?.email,
        invitationDate: pendingreviewInvitationData?.invitationDate,
        reInvitationDate: pendingreviewInvitationData?.reInvitationDate,
        invitationMessage: pendingreviewInvitationData?.invitationMessage,
        openPop: type
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "Ok") {
        this.getPendingReviewInvitationList();
      }
    });
  }

  WithdrawalPendingReviewInvitation(pendingReviewInvitationId: any, type: any, index: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: "460px",
      data: { openPop: type },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "ok") {
        this.getPendingReviewInvitationList();
        this.removePendingReviewInvitation(pendingReviewInvitationId, index);

      }
    });
  }
  // Resent API 
  resentPendingReviewInvitation(ID) {
    if (ID) {
      this.loading = true;
      let value = { id: ID }
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.REVIEW.PENDINGREVIEWINVITATIONRESEND,
        uri: '',
        postBody: value
      };
      this.commonService.post(APIparams).subscribe(

        (success) => {
          this.loading = false;
          if (success.success === true) {
            this.pendingreviewInvitationList = [];
            this.page = 1;
            this.getPendingReviewInvitationList();
            // this.router.navigateByUrl('review/invite-for-review')
            this.alertService.showNotificationMessage(
              'success',
              'bottom',
              'left',
              'txt_s',
              'check_circle',
              'Invited',
              'User has re-invited successfully.'
            );
          } else if (success.success === false) {
            this.loading = false;
            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'Invited',
              'User has not re-invited successfully.'
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

  removePendingReviewInvitation(pendingreviewInvitationID, index) {
    this.loading = true;
    let uri = null;
    let newParams = {
      'invitationId': pendingreviewInvitationID
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.REVIEW.PENDINGREVIEWINVITATIONDELETE,
      uri: uri,
    };
    this.commonService.delete(APIparams).subscribe(
      (success) => {
        if (success.success === true) {
          this.loading = false;
          this.pendingreviewInvitationList.splice(index, 1);
          this.pendingreviewInvitationList = [];

          this.page = 1;
          this.getPendingReviewInvitationList();
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
  getAPIParam(str) {
    let APIparams, params;
    if (str) params = { limit: 4, page: this.page, sort: this.orderDir };
    else params = { limit: 4, page: this.page, sort: this.orderDir };
    params = { limit: 4, page: this.page, sort: this.orderDir };
    let url;
    url = AppSettings.APIsNameArray.REVIEW.PENDINGREVIEWINVITATIONLIST;
    APIparams = {
      apiKey: url,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }

  getMoreData(str) {
    var APIparams = this.getAPIParam(str);
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      let result = ServerRes.response.pendingListData;
      this.totalPage = ServerRes.response.totalPages;
      this.spinnerLoader = false;
      if (
        ServerRes.response.pendingListData &&
        ServerRes.response.pendingListData.length > 0
      ) {
        for (let v = 0; v < result.length; v++) {
          if (result[v]) this.pendingreviewInvitationList.push(result[v]);
        }
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
}