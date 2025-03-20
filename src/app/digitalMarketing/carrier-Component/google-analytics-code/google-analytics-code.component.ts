import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "src/app/commons/service/alert.service";
import { CommonService } from "src/app/commons/service/common.service";
import { AppSettings } from "src/app/commons/setting/app_setting";

@Component({
  selector: 'app-google-analytics-code',
  templateUrl: './google-analytics-code.component.html',
  styleUrls: ['./google-analytics-code.component.css']
})
export class GoogleAnalyticsCodeComponenet implements OnInit {
  public googleAnalyticsForm: FormGroup;
  public skeletonLoader = false;
  public loading = false;
  public seoForm: any;
  public seoFormListData: any;
  constructor(
    public formBuilder: FormBuilder,
    public commonService: CommonService,
    public alertService: AlertService,
  ) { }
  ngOnInit(): void {
    this.googleAnalyticsForm = this.formBuilder.group({
      googleAnalyticsCode: ['', [Validators.required, Validators.maxLength(255)]]
    })
    this.getGoogleAnalyticsData();
  }
  //
  getGoogleAnalyticsData() {

    this.skeletonLoader = true;
    let uri = null;
    let newParams = {
    };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.DIGITALMARKETING.GET,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
       if (ServerRes.success === true) {
        this.seoFormListData = ServerRes.response;
        this.getSeoForm(this.seoFormListData)
        this.skeletonLoader=false;
      } else {       
        this.skeletonLoader=false;

      }
    });
  }
  //googleAnalytics form Submit method
  googleAnalyticsSubmit({ value, valid }) {
    // this.submit = true
    if (valid) {
      this.loading = true;
      let APIparams
      APIparams = {
        apiKey: AppSettings.APIsNameArray.DIGITALMARKETING.ADD,
        uri: '',
        postBody: value,
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {
          if (success.success === true) {
            // this.errorMessage = null
            this.loading = false;
            // this.submit = false
            this.getGoogleAnalyticsData() 
            this.alertService.showNotificationMessage(
              'success',
              'bottom',
              'left',
              'txt_s',
              'check_circle',
              'Google Analytics',
              'Google Analytics submitted successfully!.'
            );
            // this.dialogRef.close({ event: 'ok' });
          } else if (success.success === false) {
            this.loading = false;
            // this.submit = false
            // this.errorMessage = success.message
            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'Google Analytics',
              'Google Analytics not submitted successfully!'
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
          // this.submit = false
          // this.errorMessage = error.error.message;
        }
      )
    }
  }
  
  getSeoForm(seoFormData) {
    this.googleAnalyticsForm = this.formBuilder.group({
      googleAnalyticsCode:[seoFormData.googleAnalyticsCode,[Validators.required, Validators.maxLength(255)]]
      
    })
    
  }
  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }
}