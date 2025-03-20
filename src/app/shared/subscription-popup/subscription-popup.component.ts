import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { SharedService } from '../../commons/service/shared.service';
import { AddCardPopupComponent } from '../add-card-popup/add-card-popup.component';
import { StatusSetting } from 'src/app/commons/setting/status_setting';

export interface DialogData {
  openPop: string;
  value:boolean
  payTypePrice: any,
  type: any;
  manageSection: any;
  autoRenewStatus:any;
  subscriptionEndDate:any;
  subscriptionStartDate:any;
  remaingDays:any;
  subscriptionStatus:any;
  planName:string;
  purchaseDays:any;
  planType:any;

}

@Component({
  selector: 'app-subscription-popup',
  templateUrl: './subscription-popup.component.html',
  styleUrls: ['./subscription-popup.component.css']
})

export class SubscriptionPopupComponent implements OnInit {
  public month: any;
  public userType: any;
  public payType: any;
  public loading:boolean=false
public information:any;
  constructor(
    public dialogRef: MatDialogRef<AddCardPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router,
    public sharedService: SharedService,
    private commonService:CommonService,
    private alertService:AlertService
  ) { }

  ngOnInit(): void {
    this.information = StatusSetting.information;

    this.userType = localStorage.getItem('user_type')
    this.month = localStorage.getItem('selectedMonth')
    this.payType = localStorage.getItem('payType');
  }
  onNoClick(): void {
    this.dialogRef.close({ event: 'fail' });
  }

  paymentConfirm() {
    this.dialogRef.close({ event: 'paymentConfirmation' });
  }

  cancel() {
    this.dialogRef.close({ event: 'fail' });
  }

  close() {
    this.dialogRef.close({ event: 'fail' });
  }

  subManage() {
    this.sharedService.updateTokenData.next(null);
    this.router.navigateByUrl('/subscription/manage');
    this.dialogRef.close({ event: 'fail' });
  }

  goToDashboard() {
    this.sharedService.updateUserType.next(this.userType);
    this.sharedService.updateTokenData.next(null);
      this.router.navigateByUrl(localStorage.getItem('user_type') === 'CARRIER' ? '/profile/overview' : localStorage.getItem('user_type') === 'BROKER'? '/profile/brokeroverview' : '/profile/non-carrier-overview');
      // this.router.navigateByUrl('/dashboard');
    this.dialogRef.close({ event: 'fail' });
  }

  closePopup() {
    // localStorage.setItem('login_type','after_login');
    this.sharedService.updateTokenData.next(null);
    this.sharedService.updateUserType.next(this.userType);
    this.dialogRef.close({ event: 'fail' });
    if (localStorage.getItem('user_type') === 'CARRIER') {
      this.router.navigateByUrl('/profile/overview');
    } else if (localStorage.getItem('user_type') !== 'CARRIER') {
      this.router.navigateByUrl('/profile/non-carrier-overview');
    }
  }

  upgradeBusinessPlan() {
    // localStorage.setItem('login_type','after_login');
    this.sharedService.updateTokenData.next(null);
    this.sharedService.updateUserType.next(this.userType);
    if (localStorage.getItem('user_type') === 'CARRIER') {
      this.router.navigateByUrl('subscription/manage');
    } else {
      this.router.navigateByUrl('subscription/manage');
    }
    this.dialogRef.close({ event: 'upgradeSuccess' });
  }

  businessPlan() {
    localStorage.setItem('login_type', 'after_login');
    this.sharedService.updateTokenData.next(null);
    this.sharedService.updateUserType.next(this.userType);
    this.router.navigateByUrl('subscription/business-plan-purchase');
    this.dialogRef.close({ event: 'successBussines' });
  }

  UTCDate(date: any) {
    date = new Date(date + ' ' + 'UTC');
    return date;
  }

  autoRenewPlan() {
    this.loading=true
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.SUBSCRIPTION.AUTORENEW,
        uri: '',
        postBody: {
          "status": this.data.autoRenewStatus,
        },
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {
          this.loading = false;
          if (success.success === true) {
          this.dialogRef.close({ event: 'OK' });
            this.alertService.showNotificationMessage(
              'success',
              'bottom',
              'left',
              'txt_s',
              'check_circle',
              'Manage Subscription',
              // success.message
             
              'You have successfully updated Auto Renew.'
            );
          } else if (success.success === false) {
            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'Manage Subscription',
              // success.message
              'You have not successfully updated Auto Renew.'

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

    // upgrade the plan @lalit Yadav
    upgradeSubscriptionPlan() {
      this.loading=true
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.SUBSCRIPTION.CONTACTUS,
        uri: '',
        postBody: {
          "requestedSubscriptionPlanType": this.data.planType=='business' ? '3' : '2',
        },
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {
          this.loading = false;
          if (success.success === true) {
          this.dialogRef.close({ event: 'OK' });
            this.alertService.showNotificationMessage(
              'success',
              'bottom',
              'left',
              'txt_s',
              'check_circle',
              'Manage Subscription',
              success.message
            );
          } else if (success.success === false) {
            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'Manage Subscription',
              success.message
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
