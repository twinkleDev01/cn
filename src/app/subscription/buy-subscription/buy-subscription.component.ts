import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/commons/service/shared.service';
import { SubscriptionPopupComponent } from 'src/app/shared/subscription-popup/subscription-popup.component';
import { environment } from '../../../environments/environment';
import { AlertService } from '../../commons/service/alert.service';
import { CommonService } from '../../commons/service/common.service';
import { AppSettings } from '../../commons/setting/app_setting';
declare let Stripe: any;

@Component({
  selector: 'app-buy-subscription',
  templateUrl: './buy-subscription.component.html',
  styleUrls: ['./buy-subscription.component.css']
})
export class BuySubscriptionComponent implements OnInit {
  public currentCardActive: any;
  public paymentCardId: any;
  public paymentForm: FormGroup;
  public loading =false;
  public userType:any;
  public skeletonLoader =false;
  public payType ='1';
  public paymentSumitted = false;
  public stripe : any;
  public newpaymentIntednId:any;
  public manageSection=false;
  public getPlanId : any;
    constructor(
      private router: Router,private commonService: CommonService, 
       public alertService: AlertService,
      private formBuilder: FormBuilder,
      private sharedService: SharedService,
      public dialog: MatDialog) { }

  ngOnInit(): void {
    if(this.router.url==='/subscription/upgrade-premium'){
      this.manageSection = true;
    }else{
      this.manageSection =false;
    }
    if(localStorage.getItem('payType')){
      this.payType = localStorage.getItem('payType');
    }
    this.userType =localStorage.getItem('user_type')
    this.paymentForm = this.formBuilder.group({     
      paymentId: ['', [Validators.required]],
    });
    // this.month = localStorage.getItem('selectedMonth')

    let configValue = this.sharedService.getConfig();
    if (configValue !== undefined) {
      this.getConfigSet(configValue);
    }
    this.commonService.configData.subscribe((userData) => {
      this.getConfigSet(userData);
    });

  }
  getConfigSet(configValue: any) {
    this.getPlanId  = configValue.allPlans.carrier.business.priceId;
  }


  backToPlanList(){
    localStorage.removeItem('isPremium');
    this.router.navigateByUrl('/subscription/plan');
  }

  selectCard(event) {
    this.paymentForm.get('paymentId').setValue(event);
    this.currentCardActive = event;
    this.paymentCardId = event;
  }

  
  paymentSubmit({ value, valid }) {
    this.stripe = Stripe(environment.stripePublicKey);
    this.paymentSumitted = true;
    if (valid) {
      this.paymentSumitted = false;
      this.confirmPayment(value);
    }
  }

  confirmPayment(value) {
    const dialogRef = this.dialog.open(SubscriptionPopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: AppSettings.popWidth,
      data: { openPop: 'paymentConfirmation'},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'paymentConfirmation') {
        this.paymentIntentSubmit(value);
      }
    });
  }
  
  paymentIntentSubmit(value) {
    this.loading = true;
    let postBody = null;
    postBody = {
      paymentMethodId: value.paymentId,
      priceId: this.getPlanId
    };
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.PAYMENT.SUBSCRIPTION,
      uri: '',
      postBody: postBody,
    };
    this.commonService.post(APIparams).subscribe(
      (success) => {
        if (success.success === true) {
          this.paymentConfirmation(success.response.client_secret);
        } else if (success.success === false) {
          this.loading = false;
        }
      },
      (error) => {
        this.alertService.showNotificationMessage(
          'danger',
          'bottom',
          'right',
          'txt_g',
          'error',
          'Unexpected Error',
          AppSettings.ERROR
        );
        this.loading = false;
      }
    );
  }

  async paymentConfirmation(clientsecret: any) {
    if (clientsecret) {
      const { paymentIntent, error } = await this.stripe.confirmCardPayment(clientsecret,{payment_method: this.paymentCardId});
      if (error) {
        this.loading = false;
        this.paymentFailed();
      } else {
        this.loading = false;
        if (paymentIntent) {
          this.newpaymentIntednId = paymentIntent.id;
          if (paymentIntent.status === 'succeeded') {
            this.paymentSuccess();
            this.currentCardActive = '';
          }
        }
      }
    }
  }

  paymentFailed(){
    const dialogRef = this.dialog.open(SubscriptionPopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: { openPop: 'paymentFailed' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'ok') {
      }
    });
  }

  paymentSuccess(){
    localStorage.setItem('login_type','after_login');
    const dialogRef = this.dialog.open(SubscriptionPopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: { openPop: 'businessPlan','manageSection': this.manageSection },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'ok') {
         
      }
    });
  }

}
