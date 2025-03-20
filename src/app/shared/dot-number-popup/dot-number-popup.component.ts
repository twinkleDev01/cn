import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/commons/service/shared.service';
import { AlertService } from '../../commons/service/alert.service';
import { CommonService } from '../../commons/service/common.service';
import { AppSettings } from '../../commons/setting/app_setting';
export interface DialogData {
  openPop: string;
  dotNumber:string;
}
@Component({
  selector: 'app-dot-number-popup',
  templateUrl: './dot-number-popup.component.html',
  styleUrls: ['./dot-number-popup.component.css']
})
export class DotNumberPopupComponent implements OnInit {
  public loading=false;
  public requestDotForm: FormGroup;
  public getRecord:any;
  public countryList:any;
  public defualtCountryFlag:any;
  public getUserData:any;
  public showMessage :''
  constructor(
    private sharedService: SharedService,
    public alertService: AlertService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<DotNumberPopupComponent>,    
    @Inject(MAT_DIALOG_DATA) public data: DialogData,) { }
  ngOnInit(): void {
    this.requestDotForm = this.formBuilder.group({
      dotNumber: [this.data.dotNumber,[Validators.required, Validators.maxLength(9)],],
      email: ['',[Validators.required,Validators.email,Validators.maxLength(128),Validators.pattern(AppSettings.emailPattern)],],
      companyName: ['', [Validators.required, Validators.maxLength(64)]],
      countryCode: ['US', [Validators.required]],
      phone: ['', [ Validators.required,Validators.pattern(/^[0-9]\d*$/),Validators.minLength(10),
        Validators.maxLength(10),]],
    });
    let configValue = this.sharedService.getConfig();
    if (configValue !== undefined) {
      this.getConfigSet(configValue);
    }
    this.commonService.configData.subscribe((userData) => {
      this.getConfigSet(userData);
    });
  }  
 
  getConfigSet(configValue: any) {
    this.countryList = configValue.countryArrayObject;
  }
  onNoClick(): void {
    this.dialogRef.close({ event: 'fail' });
  }  
 
  requestDotFormSubmit({value ,valid}){
    if(valid){
      this.loading=true;
      let APIparams;
         APIparams = {
          apiKey: AppSettings.APIsNameArray.CARRIERS.DOTNUMBER,
          uri: '',
          postBody: value,          
        };
        this.commonService.post(APIparams).subscribe(
          (success) => {
            this.loading = false;
            if (success.success === true) {
 
                this.router.navigateByUrl('/carrier-sign-up?dotNumber='+this.data.dotNumber);
              this.dialogRef.close({ event: 'ok' });  
            } else if (success.success === false) {
              this.showMessage = success.message             
            }
          },
          (error) => {
            this.loading = false;
          });     
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
