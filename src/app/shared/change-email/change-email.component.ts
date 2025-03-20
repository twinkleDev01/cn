import { Component } from '@angular/core';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { finalize } from 'rxjs/operators';
import { PopupComponent } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/commons/service/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/commons/service/shared.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.css']
})
export class ChangeEmailComponent {
  public submitted = false;
  public emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
  public verifyError: any;
  public emailVerify: any;
  public loading = false;
  public saving = false;
  public emailMessage: any;
  public carrierDetails: any;
  public emailChangeForm:FormGroup;
  public emailVerified: any;
  public countryList: any;

  constructor(private commonService:CommonService,
    public dialog: MatDialog,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private sharedService:SharedService
    ){
  }


  async ngOnInit(){
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
