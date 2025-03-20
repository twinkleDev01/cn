import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CommonService } from '../../commons/service/common.service';
import { AppSettings } from '../../commons/setting/app_setting';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AlertService } from '../../commons/service/alert.service';
import { MustMatch } from '../../commons/helpers/must-match.validator';
import { MustDiffer } from '../../commons/helpers/must-different.validator';
import { finalize } from 'rxjs/operators';
import { SharedService } from 'src/app/commons/service/shared.service';
import { Location } from '@angular/common';
import { PopupComponent } from '../popup/popup.component';


@Component({
  selector: 'app-self-update',
  templateUrl: './self-update.component.html',
  styleUrls: ['./self-update.component.css'],
})

export class SelfUpdateComponent implements OnInit {
  public registerForm: FormGroup;
  public saving = false;
  public submitted = false;
  public emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
  public carrierDetails: any;
  public emailMessage: any;
  public loading = false;
  public hide = true;
  public countryList: any;
  public message: any;
  public emailVerified: any;
  public hide1 = true;
  public hide2 = true;
  public recordGet: any;
  // change email
  public verifyError: any;
  public emailVerify: any;
  public emailChangeForm:FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private commonService: CommonService,
    private sharedService: SharedService,
    public dialog: MatDialog,
    public location: Location,

  ) { }

  async ngOnInit() {
    this.getSingelRecord();

    this.emailChangeForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(this.emailPattern),
          Validators.maxLength(128),
        ],
      ],
    });
    this.registerForm = this.formBuilder.group({ 
        oldPassword: ['',[Validators.required, Validators.minLength(6),Validators.maxLength(16), Validators.pattern(/^[\S]+$/)]],
        newPassword: ['',[Validators.required,Validators.minLength(6),Validators.maxLength(16),Validators.pattern('[a-zA-Z0-9!@#$%^&*]+$')]],
        confirmPassword: ['', Validators.required]},{validators: [MustDiffer('oldPassword', 'newPassword'),MustMatch('newPassword', 'confirmPassword'),
        ],});
  }

  changNewPassword({ value, valid }) {
    this.submitted = true;
    if (valid) {
      this.loading = true;
      this.saving = true;
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.AUTH.CHANGEPASSWORD,
        uri: '',
        postBody: value,
      };
      this.commonService
        .post(APIparams)
        .pipe(
          finalize(() => {
            this.saving = false;
            this.loading = false;
          })
        )
        .subscribe(
          (success) => {
            if (success.success === true) {
              this.loading = false;
              this.changePassSucc();
            }
             else if (success.success === false) {
              this.alertService.showNotificationMessage(
                'danger',
                'bottom',
                'left',
                'txt_d',
                'cancel',
                'Profile update',
                'Unable to update your password, You have entered the wrong current password.'
              );
              this.loading = false;
              this.submitted = false;
            }
          },
          (error) => {
            this.submitted = false;
            this.loading = false;
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


  changePassSucc() {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: AppSettings.backdropClass,
      width: AppSettings.popWidth,
      data: { openPop: 'passwordUpdate' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'ok') {
        this.onReset();
      }
    });
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
    this.registerForm.reset();
  }

  currentPassword(hide:any){
    if(hide==true){
      this.hide = false;
    }else{
      this.hide = true;
    }
  }

  newPassword(hide1:any){
    if(hide1==true){
      this.hide1 = false;
    }else{
      this.hide1 = true;
    }
  }
  
  reEnterPassword(hide2){
    
    if(hide2==true){
      this.hide2 = false;
    }else{
      this.hide2 = true;
    }
  }

  emailChange({ value, valid }) {
    this.submitted = true;
    if (valid) {
      this.verifyError = '';
      this.emailVerify = value.email;
      this.loading = true;
      this.saving = true;
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.AUTH.CHANGEEMAIL,
        uri: '',
        postBody: value,
      };
      this.commonService
        .post(APIparams)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe(
          (success) => {
            if (success.success === true) {
              this.emailMessage = '';
              this.loading = false;
              this.verifyOtp(this.emailVerify);
              this.submitted = false;
            } else if (success.success === false) {
              this.emailMessage = success.message;
              this.verifyError = success.message;
              this.loading = false;
              this.submitted = false;
            }
          },
          (error) => {
            this.submitted = false;
            this.loading = false;
            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'right',
              'txt_g',
              'error',
              'Unexpected Error',
              AppSettings.ERROR
            );
          }
        );
    }
  }

  // verofy otp
  verifyOtp(email: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: AppSettings.backdropClass,
      width: AppSettings.popWidth,
      data: { openPop: 'verify_otp', email: email },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'OTP_VERIFY') {
        if (localStorage.getItem('user_type') === 'CARRIER') {
          this.carrierDetails.emailAddress = email;
        }
        if (localStorage.getItem('user_type') === 'SHIPPER' || localStorage.getItem('user_type') === 'STORAGE') {
          this.carrierDetails.email = email;
        }
        this.emailChangeForm.get('email').setValue('');
        this.getSingelRecord();
      }
      this.loading = false;
    });
  }

  /*get user information*/
  getSingelRecord(params = {}) {
    this.loading = true;
    let uri = null;
    params = {};
    if (params) uri = this.commonService.getAPIUriFromParams(params);
    let APIparams = {
      apiKey: this.sharedService.getUrl(),
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.carrierDetails = ServerRes.response;

        localStorage.setItem('email', this.carrierDetails.email);
        this.emailVerified = localStorage.getItem('email_verified');
        let selectedCountry = this.countryList?.filter((item) => item.countryAbbr == this.carrierDetails?.countryCode);
        this.carrierDetails.countryCode = selectedCountry?.countryAbbr;
        this.loading = false;
      }
      else{
        this.loading = false;

      }
    });
  }
}
