import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from '../../commons/helpers/must-match.validator';
import { CommonService } from '../../commons/service/common.service';
import { SharedService } from '../../commons/service/shared.service';
import { AppSettings } from '../../commons/setting/app_setting';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public currentTab='forgot-password';
  public forGotForm: FormGroup;
  public optVerifictionForm: FormGroup;
  public createNewPasswordForm: FormGroup;
  public emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
  public spinnerLoading = false;
  public forpasswordsumbit = false;
  public loading = false;
  public loginmessage = false;
  public loginmessageError: any;
  public setEmail: any;
  public optVerifictionSumit = false;
  public showMessage:any;
  public oopsError:any;
  public setCurrentPassword: any;
  public hide1 = true;
  public hide2 = true;
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    public dialog: MatDialog,
    public sharedService: SharedService,
    public location: Location) { }

  ngOnInit(): void {

    this.forGotForm = this.formBuilder.group({
      username: ['',[Validators.required, Validators.pattern(this.emailPattern), Validators.maxLength(128)]],
    });

    this.optVerifictionForm = this.formBuilder.group({
      email_otp: ['',[Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^-?([1-9]\d*)?$/)]],
    });

    this.createNewPasswordForm = this.formBuilder.group({
        newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16), Validators.pattern(/^[\S]+$/)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: MustMatch('newPassword', 'confirmPassword'),
      }
    );

    this.forGotForm.valueChanges.subscribe(x => {
      if(this.forGotForm.invalid){
       this.oopsError=null;
      }
    });
    this.optVerifictionForm.valueChanges.subscribe(x => {
      if(this.optVerifictionForm.invalid){
       this.oopsError=null;
       this.showMessage=null;
      }
    });
    this.createNewPasswordForm.valueChanges.subscribe(x => {
      if(this.createNewPasswordForm.invalid){
       this.oopsError=null;
       this.showMessage=null;
      }
    });
  }

  goToLogin(){
    this.router.navigate(['sign-in']);
  }


  backVerifyForgot(type:any){
    this.forGotForm.reset();
    this.showMessage='';
    this.optVerifictionForm.reset();
    this.createNewPasswordForm.reset();
    this.currentTab = type;
  }

  forGotPass({ value, valid }) {
    this.forpasswordsumbit = true;
    if (valid) {
      this.showMessage = '';
      this.oopsError = '';
      this.loading = true;
      this.loginmessage = false;
      this.setEmail = this.forGotForm.value.username;
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.AUTH.FORGOTPASSWORDOTP,
        uri: '',
        postBody: value,
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {
          if (success.success === true) {
            // localStorage.setItem('refresh_token', success.response.refresh);
            this.currentTab='email-verify-forgot-password';
            this.loading = false;
            this.showMessage = '';
          } else if (success.success === false) {
            this.oopsError = success.message;
            this.showMessage = '';
            this.loading = false;
          }
        },
        (error) => {
          this.showMessage = '';
          this.oopsError = AppSettings.ERROR;
          this.loading = false;
        }
      );
    }
  }

  keyPasteEmail(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    if (!pattern.test(event.target.value)) {
      return this.optVerifictionForm.get('email_otp').setValue('');
    }
  }

  keyPressEamil(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      this.showMessage = '';
      this.oopsError = '';
      event.preventDefault();
    }
  } 

  optVerifyForPassword({ value, valid }) {
    this.optVerifictionSumit = true;
    if (valid) {
      this.showMessage = '';
      this.oopsError = '';
      this.loading = true;
      let postBody = null;
      postBody = {
        email_otp: this.optVerifictionForm.value.email_otp,
        email: this.setEmail,
      };

      let APIparams = {
        apiKey: AppSettings.APIsNameArray.AUTH.FORGOTPASSWORDVERIFY,
        uri: '',
        postBody: postBody,
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {
          if (success.success === true) {
            this.currentTab='change-password';
            this.setCurrentPassword = success.response.current_password;
            this.loading = false;
          } else if (success.success === false) {
            this.oopsError = success.message;
            this.loading = false;
          }
        },
        (error) => {
          this.loading = false;
          this.oopsError = AppSettings.ERROR;
        }
      );
    }
  }
 
  createPasswordSumbit({ value, valid }) {
    if (valid) {
      this.loading = true;
      this.showMessage = '';
      this.oopsError = '';
      let postBody = null;
      postBody = {
        email: this.setEmail,
        oldPassword: this.setCurrentPassword,
        newPassword: value.newPassword,
      };

      let APIparams = {
        apiKey: AppSettings.APIsNameArray.AUTH.RESETPASSWORD,
        uri: '',
        postBody: postBody,
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {
          if (success.success === true) {
            this.currentTab='success-password';
            this.showMessage = '';
            this.loading = false;
          } else if (success.success === false) {
            this.oopsError = success.message;
            this.showMessage = '';
            this.loading = false;
          }
        },
        (error) => {
          this.showMessage='';
          this.oopsError = AppSettings.ERROR;
          this.loading = false;
        }
      );
    }
  }

  resendOTP() {
    this.showMessage = '';
    this.oopsError = '';
    this.optVerifictionSumit = false;
    this.spinnerLoading = true;
    let postBody = null;
    postBody = { username: this.setEmail };
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.AUTH.FORGOTPASSWORDOTP,
      uri: '',
      postBody: postBody,
    };
    this.commonService.post(APIparams).subscribe(
      (success) => {
        if (success.success === true) {
          this.showMessage = 'Verification code sent successfully';
          this.spinnerLoading = false;
        } else if (success.success === false) {
          this.showMessage = 'Verification code sent successfully';
          this.spinnerLoading = false;
        }
      },
      (error) => {
        this.oopsError = AppSettings.ERROR;
        this.spinnerLoading = false;
      }
    );
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
}
