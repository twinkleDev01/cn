import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { AlertService } from "src/app/commons/service/alert.service";
import { CommonService } from "src/app/commons/service/common.service";
import { AppSettings } from "src/app/commons/setting/app_setting";
import { PopupComponent } from "src/app/shared/popup/popup.component";

@Component({
  selector: 'app-seo',
  templateUrl: './social-media.componenet.html',
  styleUrls: ['./social-media.componenet.css']
})
export class SocialMediaComponenet implements OnInit {
  public socialMediaForm: FormGroup;
  public dialogRef: MatDialogRef<PopupComponent>
  public loading = false;
  public skeletonLoader=false;
  public socialmedialFormListData: any;

  constructor(
    public formBuilder: FormBuilder,
    public commonService: CommonService,
    public alertService: AlertService
  ) { }
  ngOnInit() {
    this.socialMediaForm = this.formBuilder.group({
      facebookPage: ['', [Validators.pattern(
        '^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'
      ),]],
      instagramPage: ['', [Validators.pattern(
        '^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'
      ),]],
      youtubePage: ['', [Validators.pattern(
        '^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'
      ),]],
      twitterPage: ['', [Validators.pattern(
        '^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'
      ),]],
      linkedinPage: ['', [Validators.pattern(
        '^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'
      ),]],
      tiktokPage: ['', [Validators.pattern(
        '^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'
      ),]],
    });
    this.getsocialMediaData()
  }
  getsocialMediaData() {
    this.skeletonLoader=true;
    let uri = null;
    let newParams = {
    };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.DIGITALMARKETING.SOCIALMEDIAGET,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.socialmedialFormListData = ServerRes.response;
      if (this.socialmedialFormListData) {
        this.socialMediaData(this.socialmedialFormListData)
      }
        this.skeletonLoader=false;
      } else {       
        this.skeletonLoader=false;
      }
    });
  }
  //social media submit form
  onSubmit({ value, valid }) {
    if (valid) {
      // Handle form submission
      this.loading = true;
      let APIparams
      APIparams = {
        apiKey: AppSettings.APIsNameArray.DIGITALMARKETING.SOCIALMEDIAADD,
        uri: '',
        postBody: value,
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {
          this.getsocialMediaData()
          if (success.success === true) {
            this.loading = false;
            this.alertService.showNotificationMessage(
              'success',
              'bottom',
              'left',
              'txt_s',
              'check_circle',
              'Social Media',
              'You have successfully uploaded social media links.'
            );
          } else if (success.success === false) {
            this.loading = false;
            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'Social Media',
              'You have not successfully uploaded social media links.'
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
      )
    }
  }
  //method for update title and description from api
  socialMediaData(seoFormData) {
      this.socialMediaForm = this.formBuilder.group({
      facebookPage: [seoFormData?.facebookPage ? seoFormData?.facebookPage : '', [Validators.pattern('^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$')]],
      instagramPage: [seoFormData?.instagramPage ? seoFormData?.instagramPage : '', [Validators.pattern('^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$')]],
      youtubePage: [seoFormData?.youtubePage ? seoFormData?.youtubePage : '', [Validators.pattern('^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$')]],
      twitterPage: [seoFormData?.twitterPage ? seoFormData?.twitterPage : '', [Validators.pattern('^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$')]],
      linkedinPage: [seoFormData?.linkedinPage ? seoFormData?.linkedinPage : '', [Validators.pattern('^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$')]],
      tiktokPage: [seoFormData?.tiktokPage ? seoFormData?.tiktokPage : '', [Validators.pattern('^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$')]]
    });
    
  }
  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }
  isAnyFieldFilled(): boolean {
    return Object.values(this.socialMediaForm.controls).some(control => control.value && control.value.trim() !== '');
  }
}
