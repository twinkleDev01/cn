import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from '../../commons/service/common.service';
import { SharedService } from '../../commons/service/shared.service';


@Component({
  selector: 'app-user-sign-up',
  templateUrl: './user-sign-up.component.html',
  styleUrls: ['./user-sign-up.component.css']
})
export class UserSignUpComponent implements OnInit {
  public countryList: any;
  public configData:any;
  public defualtCountryFlag:any
  public signUpForm: FormGroup;
  public getRecord:any;
  public hide = true;
  public loading = false;
  public submitted = false;
  public loginmessageError:any;
  public emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    public dialog: MatDialog,
    public sharedService: SharedService,
    public location: Location) { }

  ngOnInit(): void {  
    
    let configValue = this.sharedService.getConfig();
    if (configValue !== undefined) {
      this.getConfigSet(configValue);
    }
    this.commonService.configData.subscribe((userData) => {
      this.getConfigSet(userData);
    });
    this.signUpForm = this.formBuilder.group({
      countryCode: ['US', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(128), Validators.pattern(this.emailPattern)]],
      firstName: ['', [Validators.required, Validators.maxLength(128)]],
      companyName: ['', [Validators.required, Validators.maxLength(128)]],
      lastName: ['', [Validators.required, Validators.maxLength(128),]],
      phone: ['', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,3})?$'),Validators.minLength(10),Validators.maxLength(10),]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16), Validators.pattern(/^[\S]+$/)]]
    });
  }
  
  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null :  event.charCode >= 48 && event.charCode <= 57;
  }

  getConfigSet(configValue: any) {
    this.configData = configValue;
    this.countryList = configValue.countryArrayObject;
  }

  signUpFormSubmit({ value, valid }) {
    this.submitted = true;
    this.loginmessageError=null;
    if (valid) {
      this.loading = true;
      let APIparams = {
        apiKey : this.sharedService.userRegistration(),
        uri: '',
        postBody: value,
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {
          this.loading=false;
          if (success.success === true) {
              localStorage.setItem('login_type','before_login');
              localStorage.setItem('email', success.response.email);
              localStorage.setItem('user_type', success.response.userType);
              localStorage.setItem('userId', success.response.userId);
              localStorage.setItem('access_token', success.response.verifyOtpToken);
              localStorage.setItem('email_verified', success.response.emailVerified);
              localStorage.setItem('refresh_token', success.response.refresh);
              this.sharedService.updateTokenData.next(success.response);
              this.router.navigateByUrl('/verify-otp');

          } else {
            this.loading = false;
            this.loginmessageError = success.message;
          }
        },
        (error) => {
          this.loading = false;
          if (error.status === 401) {
            this.loginmessageError = error.message;
           }
        }
      );
    }
  }
  signIn(){
    this.router.navigate(['sign-in']);
  }
  showHidePassword(hide:any){
    if(hide==true){
      this.hide = false;
    }else{
      this.hide = true;
    }
  }

  selectCountryCode(event:any){
    this.countryList = this.configData?.countryArrayObject;
    this.getRecord = this.countryList.filter((item) => item.code == event);
    this.defualtCountryFlag = this.getRecord[0]?.flag;
  }

}
