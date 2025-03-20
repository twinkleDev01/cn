import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from '../../commons/service/common.service';
import { SharedService } from '../../commons/service/shared.service';
import { AppSettings } from '../../commons/setting/app_setting';


@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent implements OnInit {
  public verifyOtp: FormGroup;
  public loading = false;
  public showMessage:any;
  public oopsError:any;
  public optVerifictionSumit = false;
  public isPremium:boolean=true
  public submitted = false;
  public loginmessageError:any;
  public carrierEmail:any
  public emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
  email: string;
  username: string;
  user_type: string;
  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    public dialog: MatDialog,
    public sharedService: SharedService,
    public location: Location) { }

  ngOnInit(): void {
    this.email= localStorage.getItem('email');
    this.user_type =localStorage.getItem('user_type');
    this.verifyOtp = this.formBuilder.group({
      emailOtp: ['', [Validators.required, Validators.maxLength(6),]],
    });
  }

  verifyFormSubmit({ value, valid }) {
    this.submitted = true;
    this.loginmessageError=null;
    if (valid) {
      this.loading = true;
      this.carrierEmail = this.verifyOtp.value.email;
      value.email = this.email;
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.AUTH.OTPVERIFY,
        uri: '',
        postBody: value,
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {
          if (success.success === true) {
            localStorage.setItem('access_token', success.response.access);
            localStorage.setItem('email_verified', success.response.emailVerified);
            localStorage.setItem('refresh_token', success.response.refresh);
            // localStorage.setItem('subscriptionPlanType', success.response.subscriptionPlanType);

            if(localStorage.getItem('user_type') == 'CARRIER'){
             
              if(localStorage.getItem('isPremium')==='premium' ){
                localStorage.setItem('login_type','before_login');
                this.router.navigateByUrl('/subscription/business-plan-purchase');
              }
              else{
                this.router.navigateByUrl('/subscription/plan');
                localStorage.setItem('login_type','before_login');
              }
            }else if(localStorage.getItem('user_type') !=='CARRIER'){
             
                if(localStorage.getItem('isPremium')==='premium' && localStorage.getItem('payType')){
                  localStorage.setItem('login_type','before_login');
                  this.router.navigateByUrl('/subscription/business-plan-purchase');
                }
                else{
                  localStorage.setItem('login_type','before_login');
                this.router.navigateByUrl('/subscription/plan');
                }
              }
            this.sharedService.updateTokenData.next(success.response);
          } else {
            this.loading = false;
            this.loginmessageError = success.message;
          }
          
        },
        (error) => {
          this.loading = false;
          if (error.status === 401) {
            this.loginmessageError = error.error.message;
           }
        }
      );
    }
  }
  
  keyPaste(event: any) {
    this.loginmessageError=null;
    const pattern = /[0-9\+\-\ ]/;
    if (!pattern.test(event.target.value)) {
    }
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  resendOTP() {
    this.showMessage = '';
    this.oopsError = '';
    this.optVerifictionSumit = false;
    this.loading = true;
    let postBody = null;
    postBody = { username: this.email };
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.AUTH.FORGOTPASSWORDOTP,
      uri: '',
      postBody: postBody,
    };
    this.commonService.post(APIparams).subscribe(
      (success) => {
        if (success.success === true) {
          this.showMessage = success.message;
          this.loading = false;
        } else if (success.success === false) {
          this.showMessage = success.message;
          this.loading = false;
        }
      },
      (error) => {
        this.oopsError = AppSettings.ERROR;
        this.loading = false;
      }
    );
  }

  signIn(){
    localStorage.clear();
    sessionStorage.clear();
    this.sharedService.updateTokenData.next(null);
    this.sharedService.setInfo(null);
    this.sharedService.logOutuser.next(null);
    this.router.navigate(['/'])
  }
}
