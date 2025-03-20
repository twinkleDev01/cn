import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AlertService } from '../../commons/service/alert.service';
import { CommonService } from '../../commons/service/common.service';
import { AppSettings } from '../../commons/setting/app_setting';
declare let Stripe: any;
export interface DialogData {
  openPop: string;
  date:any,
  name : any,
}
@Component({
  selector: 'app-add-card-popup',
  templateUrl: './add-card-popup.component.html',
  styleUrls: ['./add-card-popup.component.css']
})
export class AddCardPopupComponent implements OnInit {
  public stripe: any;
  public cardNumber = false;
  public cardCvc = false;
  public cardExpiry = false;
  public cardNumberError: any;
  public cardCvvError: any;
  public cardExpiryError: any;
  public brandCard = 'unknown';
  public card: any;
  public paymentCard: FormGroup;
  public video: FormGroup;
  public saveCardButton = true;
  public countSpace = 1;
  public searchText = '';
  public searchBoxError = false;
  public submitted=false;
  public loading=false;
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<AddCardPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,) { }

  ngOnInit(): void {
    this.paymentCard = this.formBuilder.group({
      cardName: ['',[Validators.required, Validators.maxLength(64)],],
    });
    this.video = this.formBuilder.group({
      name : [this.data ? this.data?.name : '', [Validators.required]],
      size :['', [Validators.required]],
      date : [this.data ? this.data?.date : '',[Validators.required]]
    })
    if (this.data.openPop === 'addPaymentCardPopup') {
      this.stripe = Stripe(environment.stripePublicKey);
      this.showAddPaymentDetailPopup();
    }
  }

  onNoClick(): void {
    this.dialogRef.close({ event: 'fail' });
  }

  showAddPaymentDetailPopup() {
    this.cardNumberError = '';
    this.cardExpiryError = '';
    this.cardCvvError = '';
    this.submitted = false;
    this.saveCardButton = true;
    this.brandCard = 'unknown';

    const style = {
      base: {
        fontSize: '14px',
        lineHeight: '18px',
        fontWeight: 'bold',
        // fontFamily: 'Roboto',
        color: '#000000',
        '::placeholder': {
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#818181',
        },
      },
    };
    const elements = this.stripe.elements();
    if (elements) {
      this.cd.detectChanges();
      let cardNumberElement = elements.create('cardNumber', { style: style });
      cardNumberElement.mount('#card-number-element');
      this.card = cardNumberElement;
      let cardExpiryElement = elements.create('cardExpiry', { style: style });
      cardExpiryElement.mount('#card-expiry-element');

      this.card = cardExpiryElement;
      let cardCvcElement = elements.create('cardCvc', {
        style: style,
        placeholder: '***',
      });
      cardCvcElement.mount('#card-cvc-element');

      this.card = cardCvcElement;
      let that = this;
      this.saveCardButton = true;
      cardNumberElement.addEventListener('change', function (event) {
        if (event.brand) {
          that.brandCard = event.brand;
        }

        if (event.error) {
          that.cardNumberError = event.error.message;
          that.cardNumber = event.complete;
        } else {
          that.cardNumberError = '';
          that.cardNumber = event.complete;
        }
      });

      cardExpiryElement.addEventListener('change', function (event) {
        if (event.error) {
          that.cardExpiryError = event.error.message;
          that.cardExpiry = event.complete;
        } else {
          that.cardExpiryError = '';
          that.cardExpiry = event.complete;
        }
      });

      cardCvcElement.addEventListener('change', function (event) {
        if (event.error) {
          that.cardCvvError = event.error.message;
          that.cardCvc = event.complete;
        } else {
          that.cardCvvError = '';
          that.cardCvc = event.complete;
        }
      });
    }
  }

  checkNameValue(event: any) {
    let searchStr = event.target.value;
    if (searchStr.length > 0 || searchStr.length === ' ') {
      this.saveCardButton = false;
    } else {
      this.saveCardButton = true;
    }
    let lastword = searchStr.charAt(searchStr.length - 1);
    if (lastword === ' ') {
      this.countSpace = this.countSpace + 1;
    } else {
      this.countSpace = 0;
    }
    if (this.countSpace >= 2 || (lastword === ' ' && searchStr.length === 1)) {
      this.searchText = this.searchText.substring(
        0,
        this.searchText.length - 1
      );
      this.searchBoxError = true;
    } else {
      this.searchBoxError = false;
    }
  }
  async onSubmit({ value, valid }) {
    if (
      this.cardNumber === false ||
      this.cardExpiry === false ||
      this.cardCvc === false
    ) {
      if (this.cardNumber === false) {
        this.cardNumberError = 'Card number is required.';
      }
      if (this.cardExpiry === false) {
        this.cardExpiryError = 'Expiration date is required.';
      }
      if (this.cardCvc === false) {
        this.cardCvvError = 'CVV  is required.';
      }
      return;
    } else {
      this.loading = true;
      this.saveCardButton = true;
      this.submitted = true;
      const { paymentMethod, error } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.card,
        billing_details: {
          name: value.cardName,
        },
      });
      if (error) {
        this.loading = false;
        this.saveCardButton = false;
        if (error.code) {
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_d',
            'check_circle',
            'Payment Method',
            error.message
          );
        } else {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_g',
            'error',
            'Unexpected Error',
            AppSettings.ERROR
          );
        }
      } else {
        this.cardAddByStripe(paymentMethod.id);
      }
    }
  }

  cardAddByStripe(paymentId: any) {
    this.loading = true;
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.LOADPAYMENT.ADDCARD,
      uri: '',
      postBody: { paymentMethodId: paymentId },
    };
    this.commonService.post(APIparams).subscribe(
      (success) => {
        if (success.success === true) {
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            'Payment Method',
            'You have successfully added card details.'
          );
          this.loading = false;
          this.dialogRef.close({ event: 'Success' });
        } else if (success.success === false) {
          this.saveCardButton = false;
          this.loading = false;
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_d',
            'check_circle',
            'Payment Method',
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
        this.saveCardButton = false;
      }
    );
  }

  onConfirmationClick() {
    this.dialogRef.close({ event: 'Ok' });
  }

  
}
