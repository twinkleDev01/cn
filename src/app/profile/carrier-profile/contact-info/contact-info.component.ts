import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CommonService } from 'src/app/commons/service/common.service';
import { AlertService } from 'src/app/commons/service/alert.service';
import { SharedService } from 'src/app/commons/service/shared.service';
import { StatusSetting } from 'src/app/commons/setting/status_setting';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { PopupComponent } from 'src/app/shared/popup/popup.component';
import { SubscriptionPopupComponent } from 'src/app/shared/subscription-popup/subscription-popup.component';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css']
})
export class ContactInfoComponent implements OnInit {
  public emailFormGroup: FormGroup;
  public phoneFormGroup: FormGroup;
  public countryList: any;
  public carrierInfo: any;
  public emailID: any;
  public removeEmail: any;
  public phoneID: any;
  public removePhone: any;
  public loading = false;
  public skeletonLoader = false;
  public hide = false;
  public show = true;
  public configData: any;
  public countryFlagMX: any;
  public countryFlagUS: any;
  public countryFlagCA: any;
  public defualtPickupCountryFlag: any;
  public getRecord: any;
  public checkPlan: boolean = false;
  public getUserData: any;
  constructor(private formBuilder: FormBuilder, public dialog: MatDialog,
    public alertService: AlertService,
    private commonService: CommonService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.skeletonLoader = true;
    let configValue = this.sharedService.getConfig();
    if (configValue !== undefined) {
      this.getConfigSet(configValue);
    }
    this.commonService.configData.subscribe((userData) => {
      this.getConfigSet(userData);
    });
    this.getCarrierContactInfo()
    this.getUserProfile();
    this.countryList = StatusSetting.countryList;
    this.emailFormGroup = this.formBuilder.group({
      emailForm: this.formBuilder.array([this.formBuilder.group({
        email: [, [Validators.required, , Validators.pattern(AppSettings.emailPattern)]],
        emailBelong: [, [Validators.required, , Validators.pattern(AppSettings.emailPattern)]],
      }),]),
    });

    this.phoneFormGroup = this.formBuilder.group({
      phoneForm: this.formBuilder.array([
        this.formBuilder.group({
          coutryCode: ['US', [Validators.required]],
          phone: [, [Validators.required]],
          phoneBelong: [, [Validators.required]],
          checkWhatsapp: [, []],
        })]),
    })
  }
  getConfigSet(configValue: any) {
    this.configData = configValue;
  }
  get emailForm() {
    return this.emailFormGroup.get('emailForm') as FormArray;
  }

  get phoneForm() {
    return this.phoneFormGroup.get('phoneForm') as FormArray;
  }

  removeEmailAddress(index) {
    this.loading = true;
    let uri = null;
    let APIContactInfoDelete;
    let newParams
    // dynamic api implimented 
    APIContactInfoDelete = AppSettings.APIsNameArray.CARRIERSCONTACTINFOR.DELETE;
    newParams = {
      carrierContactInformationId: this.emailID,
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: APIContactInfoDelete,
      uri: uri,
    };
    this.commonService.delete(APIparams).subscribe(
      (success) => {
        if (success.success === true) {
          this.loading = false;
          this.carrierInfo?.emailAddress.splice(index, 1);
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            'Remove Email Address',
            'You have successfully removed email address.'
          );

        } else if (success.success === false) {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_d',
            'cancel',
            'Remove Email Address',
            'There is some issue, Please try again'
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

  removePhoneAddress(index) {
    this.loading = true;
    let uri = null;
    let APIContactInfoDelete;
    let newParams
    APIContactInfoDelete = AppSettings.APIsNameArray.CARRIERSCONTACTINFOR.DELETE;
    newParams = {
      carrierContactInformationId: this.phoneID
    }

    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: APIContactInfoDelete,
      uri: uri,
    };
    this.commonService.delete(APIparams).subscribe(
      (success) => {
        if (success.success === true) {
          this.loading = false;
          this.carrierInfo?.phone.splice(index, 1)
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            'Remove Phone Address',
            'You have successfully removed phone address.'
          );

        } else if (success.success === false) {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_d',
            'cancel',
            'Remove phone Address',
            'There is some issue, Please try again'
          );
        }
        this.loading = false;
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

  addEmailField() {
    let control = <FormArray>this.emailFormGroup.controls.emailForm;
    control.push(
      this.formBuilder.group({
        email: [, [Validators.required]],
        emailBelong: [, [Validators.required]],
      }))
    this.emailFormGroup.setControl('emailForm', control);
  }

  addPhoneField() {
    let control = <FormArray>this.phoneFormGroup.controls.phoneForm;
    control.push(
      this.formBuilder.group({
        phone: ['US', [Validators.required]],
        phoneBelong: [, [Validators.required]],
        checkWhatsapp: [, []],
      }))
    this.phoneFormGroup.setControl('phoneForm', control);
  }

  addEmailFieldPopup() {
    if (this.checkPlan == false) {
      const dialogRef = this.dialog.open(PopupComponent, {
        disableClose: true,
        // backdropClass: AppSettings.backdropClass,
        backdropClass: 'cn_custom_popup',
        width: '1000px',
        data: { openPop: 'addEmail' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result.event == 'ok') {
          this.getCarrierContactInfo();
        }
      });
    }
  }

  addPhoneFieldPopup() {
    if (this.checkPlan == false) {

      const dialogRef = this.dialog.open(PopupComponent, {
        disableClose: true,
        // backdropClass: AppSettings.backdropClass,
        backdropClass: 'cn_custom_popup',
        width: '460px',
        data: { openPop: 'addPhone' },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.event == 'ok') {
          this.getCarrierContactInfo();
        }
      });
    }
  }

  emailConfimation(index: any, emailInfo: any) {
    this.emailID = emailInfo.id
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      // backdropClass: AppSettings.backdropClass,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: { openPop: 'emailConfirmation' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'ok') {
        this.removeEmailAddress(index);
      }
      else {
        this.loading = false;

      }
    });

  }

  phoneConfimation(phoneInfo: any, index: any) {
    this.phoneID = phoneInfo.id;
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      // backdropClass: AppSettings.backdropClass,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: { openPop: 'phoneConfirmation' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'ok') {
        this.removePhoneAddress(index);

      }
      else {
        this.loading = false;

      }
    });
  }

  // calling getApi for crrier type 
  getUserProfile() {
    this.skeletonLoader = true
    let uri = null;
    let newParams = {};
    let APIuserget;
    APIuserget = AppSettings.APIsNameArray.USER.GET;
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);

    let APIparams = {
      apiKey: APIuserget,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.getUserData = ServerRes.response;
        if (this.getUserData && this.getUserData.subscriptionPlanType == '1') {
          this.checkPlan = true;
        } else {
          this.checkPlan = false;
        }
      } else {
      }
    })
  }
  getCarrierContactInfo() {
    this.skeletonLoader = true;
    let uri = null;
    let APIContactInfo
    APIContactInfo = AppSettings.APIsNameArray.CARRIERSCONTACTINFOR.LIST;

    let newParams = {
    };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: APIContactInfo,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {


      if (ServerRes.success === true) {

        this.carrierInfo = ServerRes.response;
        for (this.emailID of this.carrierInfo?.emailAddress) {
          this.removeEmail = this.emailID?.id;
        }
        for (this.phoneID of this.carrierInfo?.phone) {
          this.removePhone = this.phoneID?.id
          this.selectPickCountryCode(this.phoneID?.countryCode)
        }
        this.skeletonLoader = false;

      }
    });
  }

  editEmailAddress(emailInfoData: any, index: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      // backdropClass: AppSettings.backdropClass,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: {
        openPop: 'editEmail',
        email: emailInfoData.email,
        belongFor: emailInfoData.belongFor,
        index: index,
        emailId: emailInfoData.id,

      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'ok') {
        this.loading = false;
        this.getCarrierContactInfo();
      }
      else {
        this.loading = false;
      }
    });
  }

  editPhoneAddress(phoneInfoData: any, index: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      // backdropClass: AppSettings.backdropClass,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: {
        openPop: 'editPhone',
        // allowWhatsappChat:this.phoneID.,
        mobileCountryCode: phoneInfoData.countryCode,
        belongFor: phoneInfoData.belongFor,
        mobile: phoneInfoData.mobile,

        // belongFor:belongFor,
        allowWhatsAppChat: phoneInfoData.allowWhatsAppChat,
        index: index,
        phoneId: phoneInfoData.id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'ok') {
        this.getCarrierContactInfo();
      }
      else {
        this.loading = false;
      }
    });
  }

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  selectPickCountryCode(event: any) {
    this.countryList = this.configData?.countryArrayObject;
    this.getRecord = this.countryList?.filter((item) => item.code == event);
    this.defualtPickupCountryFlag = this.getRecord[0]?.flag;
    if (event == 'MX') {
      this.countryFlagMX = this.getRecord[0]?.flag;
    }
    else if (event == 'US') {
      this.countryFlagUS = this.getRecord[0]?.flag;
    }
    else if (event == 'CA') {
      this.countryFlagCA = this.getRecord[0]?.flag;
    }
  }
  subsciptionPlanCheck() {
    if (this.checkPlan == true) {
      this.subscriptionUpgrade();
    }
  }
  subscriptionUpgrade() {
    const dialogRef = this.dialog.open(SubscriptionPopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: '1000px',
      data: { openPop: 'freePlan', type: 'checkPremium' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'ok') {
      }
    });
  }

}
