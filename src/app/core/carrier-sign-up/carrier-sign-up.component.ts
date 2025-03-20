import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../commons/service/common.service';
import { SharedService } from '../../commons/service/shared.service';
import { AppSettings } from '../../commons/setting/app_setting';


@Component({
  selector: 'app-carrier-sign-up',
  templateUrl: './carrier-sign-up.component.html',
  styleUrls: ['./carrier-sign-up.component.css']
})

export class CarrierSignUpComponent implements OnInit {
  public signUpForm: FormGroup;
  public hide = true;
  public loading = false;
  public submitted = false;
  public loginmessageError:any;
  public dotNumber: any;
  public emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
  public getDotNumber:any;
  public userSearchRecord:any=[];
  public countryList: any;
  public defualtCountryFlag:any;
  public getRecord:any;
 public configData:any;
 
  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
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
    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length > 0) {
        this.loading=true;
        this.getDotNumber=params['dotNumber'];
        this.searchRecord(params['dotNumber']);
      }
    })
    this.signUpForm = this.formBuilder.group({
      countryCode: ['US', [Validators.required]],
      dotNumber: ['', [Validators.required]],
      // emailAddress: ['', [Validators.required, Validators.email, Validators.maxLength(128), Validators.pattern(this.emailPattern)]],
      emailAddress: ['', []],
      firstName: ['', [Validators.required, Validators.maxLength(128)]],
      lastName: ['', [Validators.required, Validators.maxLength(128),]],
      // mobile: ['', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,3})?$'),Validators.minLength(10),Validators.maxLength(10),]],
      mobile: ['', []],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16), Validators.pattern(/^[\S]+$/)]],
      companyName: ['', [Validators.required, Validators.maxLength(128)]]
    });
  }


  getConfigSet(configValue: any) {
    this.configData = configValue;
    this.countryList = configValue?.countryArrayObject;
  }


  getAPIInParam(searchStr) {
    let APIparams, params;
    if (searchStr) params = { search: searchStr ,limit:'1'};
    else params = {  };
    APIparams = {
      apiKey: AppSettings.APIsNameArray.EXTERNAL.CARRIERSEARCHDOT,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }
  
  searchRecord(searchStr:any){
      var APIparams = this.getAPIInParam(searchStr);
      this.commonService.getList(APIparams).subscribe((ServerRes) => {
        this.loading=false;
        if(ServerRes.success==true){
          if(ServerRes.response.carrierData?.length > 0){
            this.userSearchRecord = ServerRes.response?.carrierData;
            this.selectCountryCode( this.userSearchRecord[0]?.countryCode)
            // let parts = ServerRes.response.carrierData[0]?.email?.split('@');    
              this.signUpForm = this.formBuilder.group({
                countryCode : [ServerRes.response?.carrierData[0]?.countryCode ? ServerRes.response.carrierData[0].countryCode : 'US',[Validators.required]],
                dotNumber :[ServerRes.response.carrierData[0].dotNumber, [Validators.required,]],
                // emailAddress: [ServerRes.response.carrierData[0].email, [Validators.required, Validators.email, Validators.maxLength(128), Validators.pattern(this.emailPattern)]],
                emailAddress: [ServerRes.response.carrierData[0]?.email],
                firstName: [ServerRes.response.carrierData[0]?.firstName, [Validators.required, Validators.maxLength(128)]],
                lastName: [ServerRes.response.carrierData[0]?.lastName, [Validators.required, Validators.maxLength(128),]],
                // mobile: [ServerRes.response.carrierData[0].phone, [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,3})?$'),Validators.minLength(10),Validators.maxLength(10),]],
                mobile: [ServerRes.response.carrierData[0]?.phone],
                password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16), Validators.pattern(/^[\S]+$/)]],
                companyName: [ServerRes.response.carrierData[0].companyName ? ServerRes.response.carrierData[0].companyName : '', [Validators.required, Validators.maxLength(128)]],
              });     
          }else{
            this.router.navigateByUrl('/sign-up-user-type');
          }
        }else{
          this.router.navigateByUrl('/sign-up-user-type');
          this.userSearchRecord = null;
        }
      });
  }

  checkValidation(emailAddress:any, phone:any){
    if (!emailAddress) {
      this.signUpForm.get('emailAddress').setValidators([Validators.required, Validators.email, Validators.maxLength(128), Validators.pattern(this.emailPattern)]);
      this.signUpForm.get('emailAddress').updateValueAndValidity();
    }
     
   if(!phone){
      this.signUpForm.get('mobile').setValidators([Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,3})?$'),Validators.minLength(10),Validators.maxLength(10),]);
      this.signUpForm.get('mobile').updateValueAndValidity();
    } 
    
    
  }

  signUpFormSubmit({ value, valid }) {
    this.checkValidation(this.userSearchRecord[0]?.email,this.userSearchRecord[0]?.phone)
    this.submitted = true;
    this.loginmessageError=null;
    if (valid) {
      this.loading = true;
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.AUTH.CARRIERADD,
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
            this.sharedService.updateTokenData.next(success.response);
             this.router.navigateByUrl('/verify-otp');
          } else {
          this.submitted=false;
            this.loading = false;
            this.loginmessageError = success.message;
          }
        },
        (error) => {
          this.loading = false;
          this.submitted=false;
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
  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null :  event.charCode >= 48 && event.charCode <= 57;
  }

  selectCountryCode(event:any){
    this.getRecord = this.countryList.filter((item) => item.code == event);
    this.defualtCountryFlag = this.getRecord[0]?.flag;
  }
}
