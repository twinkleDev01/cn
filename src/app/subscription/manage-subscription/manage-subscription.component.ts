import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StripeSericeService } from 'src/app/commons/service/stripeService.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { SubscriptionPopupComponent } from 'src/app/shared/subscription-popup/subscription-popup.component';
import { AlertService } from '../../commons/service/alert.service';
import { CommonService } from '../../commons/service/common.service';
import { SharedService } from '../../commons/service/shared.service';
import { StatusSetting } from 'src/app/commons/setting/status_setting';

@Component({
  selector: 'app-manage-subscription',
  templateUrl: './manage-subscription.component.html',
  styleUrls: ['./manage-subscription.component.css']
})

export class ManageSubscriptionComponent implements OnInit {
  public getSubscriptionData: any;
  public userType: any;
  public loading: boolean = false
  public getUserPlan: any;
  public sketeloader: boolean = false;
  public showAllFeatures: boolean = false;
  public subscriptionPlanType: any;
  public subscriptionStartDate: any;
  public subscriptionEndDate: any;
  public remaingDays: any;
  public purchaseDays: any
  public remainingDays: any;
  public skeletonLoader = false;
  public information: any;

  constructor(private commonService: CommonService,
    public dialog: MatDialog,
    public alertService: AlertService,
    private stripeService: StripeSericeService
  ) { }

  ngOnInit(): void {
    this.information = StatusSetting.information;

    this.skeletonLoader = true;
    this.userType = localStorage.getItem('user_type');
    this.subscriptionPlanType = localStorage.getItem('subscriptionPlanType')
    this.sketeloader = true;
    this.getSubscription()

  }

  getSubscription() {
    this.skeletonLoader = true;
    let uri = null;
    let newParams = {};
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.SUBSCRIPTION.GET,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      this.sketeloader = false;
      if (ServerRes.success === true) {
        this.getSubscriptionData = ServerRes.response;
        const currentDate = new Date();
        this.skeletonLoader = false;
        this.subscriptionStartDate = this.displayDates(this.getSubscriptionData?.currentPeriodStart)
        this.subscriptionEndDate = this.displayDates(this.getSubscriptionData?.currentPeriodEnd)
        this.remaingDays = this.calculateRemainingTime(this.getSubscriptionData.currentPeriodEnd);
        this.purchaseDays = this.calculateRemainingTime(this.getSubscriptionData.currentPeriodStart);
      }
      else {
        this.skeletonLoader = false
      }
    },
      (error) => {
        this.skeletonLoader = false
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

  showFeatures() {
    this.showAllFeatures = !this.showAllFeatures
  }

  autoRenewPlan(event: any) {
    this.getSubscriptionData.autoRenew = event.checked;
    const dialogRef = this.dialog.open(SubscriptionPopupComponent, {
      disableClose: true,
      // backdropClass: AppSettings.backdropClass,
      backdropClass: 'cn_custom_popup',
      width: '465px',
      data: {
        openPop: 'autoRenew',
        value: this.getSubscriptionData.autoRenew,
        autoRenewStatus: !this.getSubscriptionData.autoRenew,
        subscriptionEndDate: this.subscriptionEndDate,
        subscriptionStartDate: this.subscriptionStartDate,
        remaingDays: this.remaingDays,
        subscriptionStatus: this.getSubscriptionData?.subscriptionStatus,

        planName: localStorage.getItem('subscriptionPlanType')
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'OK') {
        this.getSubscription()
      } else {
        this.getSubscription()
      }
    });
  }


  purchaseSubscriptionPlan(button: HTMLButtonElement, planType: string): void {
    const buttonType = button.innerText.trim();
    let newParams;
    let uri = null;
    if (buttonType.includes('Downgrade Plan') && localStorage.getItem('subscriptionPlanType') !== '1' && planType !== 'free') {
      const dialogRef = this.dialog.open(SubscriptionPopupComponent, {
        disableClose: true,
        // backdropClass: AppSettings.backdropClass,
        backdropClass: 'cn_custom_popup',
        width: '460px',
        data: {
          openPop: 'downgrade',
          subscriptionEndDate: this.subscriptionEndDate,
          subscriptionStartDate: this.subscriptionStartDate,
          remaingDays: this.remaingDays,
          subscriptionStatus: this.getSubscriptionData?.subscriptionStatus,
          planName: localStorage.getItem('subscriptionPlanType'),
          purchaseDays: this.purchaseDays,
          planType: planType,
          autoRenewStatus: 'true',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.event == 'OK') {
          this.getSubscription()

        }
      });
    }
    else if (buttonType.includes('Upgrade Plan') && localStorage.getItem('subscriptionPlanType') !== '1' && planType !== 'free') {
      const dialogRef = this.dialog.open(SubscriptionPopupComponent, {
        disableClose: true,
        // backdropClass: AppSettings.backdropClass,
        backdropClass: 'cn_custom_popup',
        width: '460px',
        data: {
          openPop: 'upgrade',
          subscriptionEndDate: this.subscriptionEndDate,
          subscriptionStartDate: this.subscriptionStartDate,
          remaingDays: this.remaingDays,
          subscriptionStatus: this.getSubscriptionData?.subscriptionStatus,
          planName: localStorage.getItem('subscriptionPlanType'),
          purchaseDays: this.purchaseDays,
          planType: planType,
          autoRenewStatus: this.getSubscriptionData?.autoRenew,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.event == 'OK') {
          this.getSubscription()
        }
      });
    }
    else if (buttonType.includes('Downgrade Plan') && localStorage.getItem('subscriptionPlanType') !== '1' && planType == 'free') {
      const dialogRef = this.dialog.open(SubscriptionPopupComponent, {
        disableClose: true,
        // backdropClass: AppSettings.backdropClass,
        backdropClass: 'cn_custom_popup',
        width: '460px',
        data: {
          openPop: 'downgrade',
          subscriptionEndDate: this.subscriptionEndDate,
          subscriptionStartDate: this.subscriptionStartDate,
          remaingDays: this.remaingDays,
          subscriptionStatus: this.getSubscriptionData?.subscriptionStatus,
          planName: localStorage.getItem('subscriptionPlanType'),
          purchaseDays: this.purchaseDays,
          planType: planType,
          autoRenewStatus: 'true',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.event == 'OK') {
          this.getSubscription()
        }
      });
    }
    else if (localStorage.getItem('subscriptionPlanType') == '1' && planType !== 'free') {
      this.loading = true
      if (planType == 'starter' && this.userType == 'CARRIER') {
        newParams = {
          'priceId': 'price_1PSvBpSCAOR8a9j3hIvg0xSp'
        };
      } else if (planType == 'business' && this.userType == 'CARRIER') {
        newParams = {
          'priceId': 'price_1PSvDoSCAOR8a9j3sVbUVrWH'
        };
      }
      else if (planType == 'starter' && this.userType == 'BROKER') {
        newParams = {
          'priceId': 'price_1PQOQKSCAOR8a9j3Jkb1imr9'
        };
      } else if (planType == 'business' && this.userType == 'BROKER') {
        newParams = {
          'priceId': 'price_1PQORNSCAOR8a9j3PctMbmm6'
        };
      }
      else if (planType == 'starter' && this.userType == 'SHIPPER') {
        newParams = {
          'priceId': 'price_1POhpzSCAOR8a9j3ABN7dwZL'
        };
      } else if (planType == 'business' && this.userType == 'SHIPPER') {
        newParams = {
          'priceId': 'price_1POhqKSCAOR8a9j3FeFh25bY'
        };
      }
      else if (planType == 'starter' && this.userType == 'DISPATCHER') {
        newParams = {
          'priceId': 'price_1PQOPHSCAOR8a9j3pHxIwlYZ'
        };
      } else if (planType == 'business' && this.userType == 'DISPATCHER') {
        newParams = {
          'priceId': 'price_1PQOPqSCAOR8a9j31NjxT3Lf'
        };
      }
      else if (planType == 'starter' && this.userType == 'SELLER') {
        newParams = {
          'priceId': 'price_1PQORxSCAOR8a9j30lbD4eWC'
        };
      } else if (planType == 'business' && this.userType == 'SELLER') {
        newParams = {
          'priceId': 'price_1PQOSZSCAOR8a9j3EgVOdOlv'
        };
      }

      if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.PLAN.BUYPLAN,
        uri: uri
      };

      this.commonService.getList(APIparams).subscribe((ServerRes) => {
        if (ServerRes.success === true) {
          this.loading = false
          const sessionId = ServerRes?.response?.id; // Replace with the actual session ID
          this.stripeService.redirectToCheckout(sessionId);
        }
        else {
          this.loading = false
        }
      },
        (error) => {
          this.skeletonLoader = false;
          this.loading = false
        });
    }
  }


  displayDates(timestamp: number) {
    // Convert Unix timestamp to milliseconds
    let milliseconds = timestamp * 1000;

    // Create a new Date object
    let date = new Date(milliseconds);

    // Extract date components
    let year = date.getFullYear();
    let month = date.getMonth() + 1; // Months are zero based, so add 1
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    // Format the date
    let formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedDate
  }

  UTCDate(date: any) {
    date = new Date(date + ' ' + 'UTC');
    return date;
  }

  calculateRemainingTime(endDate) {
    // Convert Unix timestamp to milliseconds
    const currentDate = new Date();
    const endMilliseconds = endDate * 1000;
    const endDateObj = new Date(endMilliseconds);

    // If the end date is in the future
    if (endDateObj > currentDate) {
      let monthsDifference = endDateObj.getMonth() - currentDate.getMonth() +
        (12 * (endDateObj.getFullYear() - currentDate.getFullYear()));
      let daysDifference = endDateObj.getDate() - currentDate.getDate();

      // Adjust for negative day difference
      if (daysDifference < 0) {
        monthsDifference--;
        const previousMonth = new Date(endDateObj.getFullYear(), endDateObj.getMonth(), 0);
        daysDifference += previousMonth.getDate();
      }

      // Calculate hours and minutes difference if months and days are zero
      if (monthsDifference === 0 && daysDifference === 0) {
        const totalMilliseconds = endMilliseconds - currentDate.getTime();
        const hoursDifference = Math.floor(totalMilliseconds / (1000 * 60 * 60));
        const minutesDifference = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

        if (hoursDifference === 0) {
          return `${minutesDifference} minutes`;
        } else {
          return `${hoursDifference} hours and ${minutesDifference} minutes`;
        }
      }

      // Return formatted string
      if (monthsDifference > 0 || daysDifference > 0) {
        return `${monthsDifference > 0 ? monthsDifference + ' months ' : ''}${daysDifference > 0 ? 'and ' + daysDifference + ' days' : ''}`.trim();
      } else {
        return `0 days`;
      }

      // If the end date is in the past
    } else if (endDateObj < currentDate) {
      let monthsDifference = currentDate.getMonth() - endDateObj.getMonth() +
        (12 * (currentDate.getFullYear() - endDateObj.getFullYear()));
      let daysDifference = currentDate.getDate() - endDateObj.getDate();

      // Adjust for negative day difference
      if (daysDifference < 0) {
        monthsDifference--;
        const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        daysDifference += previousMonth.getDate();
      }

      // Calculate hours and minutes difference if months and days are zero
      if (monthsDifference === 0 && daysDifference === 0) {
        const totalMilliseconds = currentDate.getTime() - endMilliseconds;
        const hoursDifference = Math.floor(totalMilliseconds / (1000 * 60 * 60));
        const minutesDifference = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

        if (hoursDifference === 0) {
          return `${minutesDifference} minutes`;
        } else {
          return `${hoursDifference} hours and ${minutesDifference} minutes`;
        }
      }

      // Return formatted string
      if (monthsDifference > 0 || daysDifference > 0) {
        return `${monthsDifference > 0 ? monthsDifference + ' months ' : ''}${daysDifference > 0 ? 'and ' + daysDifference + ' days' : ''}`.trim();
      } else {
        return `0 days`;
      }
    }
  }
}
