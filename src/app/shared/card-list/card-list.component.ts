import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/commons/service/shared.service';
import { AlertService } from '../../commons/service/alert.service';
import { CommonService } from '../../commons/service/common.service';
import { AppSettings } from '../../commons/setting/app_setting';
import { AddCardPopupComponent } from '../add-card-popup/add-card-popup.component';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit {
  @Input() currentCardActive: any;
  @Input() pageType: any;
  @Output() selectPaymentCard = new EventEmitter();
  public skeletonLoaderCard = false;
  public cardListing = [];
  public has_more = false;
  public loading = false;
  public today = new Date();
  public currentYear: any;
  public currentMonth: any;
  public startingAfter = null;
  public checkSUb = false;
  constructor(public dialog: MatDialog,
    public sharedService: SharedService,
    public commonService: CommonService,
    public alertService: AlertService) { }

  ngOnInit(): void {
    if(localStorage.getItem('login_type')=='after_login'){
      this.checkSUb=true;
    }else{
      this.checkSUb=false;
    }
    this.currentMonth = this.today.getMonth() + 1;
    this.currentYear = this.today.getFullYear();
    this.getCardListing();
  }
  
  selectCard(id: any) {
    if(this.pageType !=='subscription'){
      this.selectPaymentCard.emit(id);
      this.currentCardActive = id;
    }
  }

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  // add card
  getCardListing(params = {}) {
    this.skeletonLoaderCard = false;
    let uri = null;
    //get dynamic URI for APIs
    let paramsNew = {
      type: 'card',
      limit: '8',
    };
    if (paramsNew) uri = this.commonService.getAPIUriFromParams(paramsNew);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.LOADPAYMENT.LIST,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe(
      (ServerRes) => {
        if (ServerRes.success === true) {
          let expiry;
          this.cardListing = ServerRes.response.data;
          this.has_more = ServerRes.response.has_more;
          this.startingAfter = this.cardListing.length ? this.cardListing[this.cardListing?.length - 1].id : '';
          for (let i = 0; i < this.cardListing.length; i++) {
            if (this.cardListing[i]?.card?.exp_year >
              this.currentYear || (this.cardListing[i]?.card?.exp_year ===
                this.currentYear && this.cardListing[i]?.card?.exp_month >= this.currentMonth)) {
              expiry = { expiry: false };
              this.cardListing[i] = Object.assign(this.cardListing[i], expiry)
            }
            else {
              expiry = { expiry: true };
              this.cardListing[i] = Object.assign(this.cardListing[i], expiry)
            }
          }
          this.skeletonLoaderCard = true;
        } else {
          this.cardListing = [];
          this.skeletonLoaderCard = true;
        }
      },
      (error) => {
        this.skeletonLoaderCard = true;
        this.cardListing = [];
      }
    );
  }

  removeCard(id: any) {
    this.cardConfirmationCard(id);
  }
  cardConfirmationCard(id: any) {
    const dialogRef = this.dialog.open(AddCardPopupComponent, {
      disableClose: true,
      backdropClass: AppSettings.backdropClass,
      width: AppSettings.popWidth,
      // height:AppSettings.popHeight,
      data: { openPop: 'removeCard' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Ok') {
        this.loading=false;
        this.removePaymentMethod(id);
      }
    });
  }

  addPaymentCard() {
    const dialogRef = this.dialog.open(AddCardPopupComponent, {
      disableClose: true,
      // backdropClass: AppSettings.backdropClass,
      backdropClass: 'cn_custom_popup',
      width: AppSettings.popWidth,
      // height:AppSettings.popHeight,
      data: { openPop: 'addPaymentCardPopup' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Success') {
        this.getCardListing();
      }
    });
  }

  removePaymentMethod(id: any) {
    this.loading = true;
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.LOADPAYMENT.REMOVECARD,
      uri: '',
      postBody: { type: 'card', cardId: id },
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
            'You have successfully removed card details.'
          );
          this.loading = false;
          this.getCardListing();
        } else if (success.success === false) {
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
      }
    );
  }
}