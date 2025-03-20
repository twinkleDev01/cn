import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { StripeSericeService } from 'src/app/commons/service/stripeService.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { StatusSetting } from 'src/app/commons/setting/status_setting';
@Component({
  selector: 'app-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.css']
})


export class SubscriptionPlanComponent implements OnInit {
  public nonCarrier = false;
  public mobile_leftMenu_css = true;
  public defaultCheck = true;
  public defaultCheck_one = true;
  public oneMonthAmount: any = 1;
  public carrier = false;
  public loading = false;
  public activeTab: string;
  public userType: any;
  public carrierFeaturesList: any = [];
  public nonCarrierFeaturesList = [];
  public showAllFeatures: boolean = false;
  public skeletonLoader: boolean = true;

  constructor(public dialog: MatDialog, 
    private commonService: CommonService,
    public alertService: AlertService, private stripeService: StripeSericeService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.skeletonLoader = false;
    }, 3000);
    this.userType = localStorage.getItem('user_type');
    this.activeTab = this.userType;
    this.carrierFeaturesList = StatusSetting.carrierFeatures;
    this.nonCarrierFeaturesList = StatusSetting.nonCarrierFeatures
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

  purchaseSubscriptionPlan(planType: string) {
    this.loading = true
    let uri = null;
    let newParams:any;
    if (planType == 'free') {
      newParams = {
        'priceId': 'free'
      };
    } else if (planType == 'starter' && this.userType=='CARRIER') {
      newParams = {
        'priceId': 'price_1PSvBpSCAOR8a9j3hIvg0xSp'
      };
    } else if (planType == 'business' && this.userType=='CARRIER') {
      newParams = {
        'priceId': 'price_1PSvDoSCAOR8a9j3sVbUVrWH'
      };
    }
    else if (planType == 'starter' && this.userType=='BROKER') {
      newParams = {
        'priceId': 'price_1PQOQKSCAOR8a9j3Jkb1imr9'
      };
    } else if (planType == 'business' && this.userType=='BROKER') {
      newParams = {
        'priceId': 'price_1PQORNSCAOR8a9j3PctMbmm6'
      };
    }
    else if (planType == 'starter' && this.userType=='SHIPPER') {
      newParams = {
        'priceId': 'price_1POhpzSCAOR8a9j3ABN7dwZL'
      };
    } else if (planType == 'business' && this.userType=='SHIPPER') {
      newParams = {
        'priceId': 'price_1POhqKSCAOR8a9j3FeFh25bY'
      };
    }
    else if (planType == 'starter' && this.userType=='DISPATCHER') {
      newParams = {
        'priceId': 'price_1PQOPHSCAOR8a9j3pHxIwlYZ'
      };
    } else if (planType == 'business' && this.userType=='DISPATCHER') {
      newParams = {
        'priceId': 'price_1PQOPqSCAOR8a9j31NjxT3Lf'
      };
    }
    else if (planType == 'starter' && this.userType=='SELLER') {
      newParams = {
        'priceId': 'price_1PQORxSCAOR8a9j30lbD4eWC'
      };
    } else if (planType == 'business' && this.userType=='SELLER') {
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
        if(sessionId){
          this.stripeService.redirectToCheckout(sessionId);
        }
        else{
          let redirectUrl = localStorage.getItem('redirectUrl');
          if(redirectUrl){
            console.log(redirectUrl, 'redirectUrl');
            window.location.href = redirectUrl;
            localStorage.removeItem('redirectUrl');
          }
          else{
        window.location.href = localStorage.getItem('user_type') === 'CARRIER' ? '/app/profile/overview' : localStorage.getItem('user_type') === 'BROKER' ? '/app/profile/broker-overview' : '/app/profile/non-carrier-overview';
        }
      }
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
