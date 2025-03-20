import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from '../../commons/service/common.service';
import { SharedService } from '../../commons/service/shared.service';
import { AppSettings } from '../../commons/setting/app_setting';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  public loginForm: FormGroup;
  public hide = true;
  public loading = false;
  public submitted = false;
  public loginmessageError:any;
  public newTokan: any;
  public passwordSpaceCheck: string = null;
  public emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
  public afterLoginNoContant = false;

  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    public dialog: MatDialog,
    public sharedService: SharedService,
    public location: Location) { }

  ngOnInit(): void {
    this.sharedService.updateUserType.next(null);
    if(!localStorage.getItem("access_token")){
      localStorage.setItem('login_type','before_login');
      localStorage.removeItem('user_type');
    }
    if(localStorage.getItem('login_type') == 'after_login'){
      this.afterLoginNoContant = true;
    }

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email, Validators.maxLength(128), Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16), Validators.pattern(/^[\S]+$/)]]
    });
  }

  loginFormSubmit({ value, valid }) {
    this.submitted = true;
    this.loginmessageError=null;
    if (valid) {
      this.loading = true;
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.AUTH.LOGIN,
        uri: '',
        postBody: value,
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {
          if (success.success === true) {
            if(success.response.emailVerified == true){
            this.newTokan=success.response.access;
            localStorage.setItem('user_type', success.response.userType);
            localStorage.setItem('email', success.response.email);
            localStorage.setItem('userId', success.response.userId);
            localStorage.setItem('access_token', success.response.access);
            localStorage.setItem('userId', success.response.userId);
            localStorage.setItem('email_verified', success.response.emailVerified);
            localStorage.setItem('refresh_token', success.response.refresh);
            localStorage.setItem('subscriptionPlanType', success.response?.subscriptionPlanType)       
            if(success.response.subscriptionPlanType !== 0){
              localStorage.setItem('login_type','after_login');
            }
            this.sharedService.updateTokenData.next(success.response);
            this.sharedService.updateUserType.next(success.response.userType);
            if(success.response.userType ==='CARRIER'){
              if(success.response.subscriptionPlanType == 0){
                this.router.navigateByUrl('/subscription/plan');
                localStorage.setItem('login_type','before_login');
              }
              else{
                this.router.navigateByUrl('profile/overview');
              }
            }else if(success.response.userType ==='BROKER'){
              if(success.response.subscriptionPlanType == 0){
                this.router.navigateByUrl('/subscription/plan');
                localStorage.setItem('login_type','before_login');
              }
              else{
                this.router.navigateByUrl('profile/broker-overview');
              }
            }
            else{
              if(success.response.subscriptionPlanType == 0){
                this.router.navigateByUrl('/subscription/plan');
                localStorage.setItem('login_type','before_login');
              }else{
                this.router.navigateByUrl('profile/non-carrier-overview');
              }
            }
            }else{
            localStorage.setItem('login_type','before_login');
            localStorage.setItem('email', success.response.email);
            localStorage.setItem('user_type', success.response.userType);
            localStorage.setItem('userId', success.response.userId);
            localStorage.setItem('access_token', success.response.verifyOtpToken);
            localStorage.setItem('userId', success.response.userId);
            localStorage.setItem('email_verified', success.response.emailVerified);
            localStorage.setItem('refresh_token', success.response.refresh);
            localStorage.setItem('subscriptionPlanType', success.response.subscriptionPlanType);
            this.sharedService.updateTokenData.next(success.response);
            this.router.navigateByUrl('/verify-otp');
          }
          } 
          else {
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

  goToForgotPassword(){
    this.router.navigate(['forgot-password']);
  }
  signUp(){
    this.router.navigateByUrl('/sign-up-user-type');
    this.sharedService.userDataPass.next('SignUp')
    localStorage.setItem('isSignUp','true')

  }
  
  showHidePassword(hide:any){
    if(hide==true){
      this.hide = false;
    }else{
      this.hide = true;
    }
  }
  
}
