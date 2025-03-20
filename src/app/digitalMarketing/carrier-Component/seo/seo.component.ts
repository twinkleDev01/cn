import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { AlertService } from "src/app/commons/service/alert.service";
import { CommonService } from "src/app/commons/service/common.service";
import { SharedService } from "src/app/commons/service/shared.service";
import { AppSettings } from "src/app/commons/setting/app_setting";
import { PopupComponent } from "src/app/shared/popup/popup.component";
import { environment } from "src/environments/environment";
@Component({
  selector: 'app-seo',
  templateUrl: './seo.component.html',
  styleUrls: ['./seo.component.css']
})
export class SEOComponent implements OnInit {
  public seoForm: FormGroup
  public selectedIndex = 0;
  public title = '';
  public description = '';
  public imageData: any;
  public getUserData: any;
  public skeletonLoader = false;
  public profilUrl: string;
  public loading = false;
  public seoFormListData: any;
  public companyName: any;
  public aboutCompany: any;

  constructor(
    public FormBuilder: FormBuilder,
    public commonService: CommonService,
    private alertService: AlertService,
    public dialog: MatDialog,
    public sharedService: SharedService
  ) { }

  ngOnInit() {
    this.seoForm = this.FormBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(64)]],
      descriptions: ['', [Validators.required, Validators.maxLength(1024)]]
    });
    // Subscribe to change title and description real time
    this.seoForm.get('title').valueChanges.subscribe(value => {
      this.title = value;
    });
    this.seoForm.get('descriptions').valueChanges.subscribe(value => {
      this.description = value;
    });
    // call the function 
    this.getUserProfile()
    this.getDigitalMarkeingSeoData()
    
  }

// function for get user profile ie image company name and description 
  getUserProfile() {
    this.skeletonLoader = true
    let uri = null;
    let newParams = {};
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: this.sharedService.getUrl(),
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.getUserData = ServerRes.response;
        // this.skeletonLoader = false;
        this.companyName = this.getUserData?.companyName;
        this.aboutCompany = this.getUserData?.aboutCompany;

        this.imageData = this.getUserData?.profileImage;
        // this.skeletonLoader = false;
        this.redirectPageCarrier(this.getUserData?.dotNumber, this.getUserData?.companyName)
        //fucntion call because show company name to new user in title
        this.getDigitalMarkeingSeoData()
      } else {
        this.getDigitalMarkeingSeoData()
        // this.skeletonLoader = false;
      }
    })
  }

  //method for get seo data 
  getDigitalMarkeingSeoData() {
    let uri = null;
    let newParams = {};
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.DIGITALMARKETING.GET,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.seoFormListData = ServerRes.response;
        this.getSeoForm(this.seoFormListData)
      } else {
        this.getSeoForm(this?.seoFormListData)
      }
    })
  }
  //method for uppdate image
  updateProfileImage(type) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: "670px",
      data: { openPop: type },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "ok") {
        //  this.imageData = result.event.profileImage;
        this.getUserProfile();
        this.getDigitalMarkeingSeoData();
      }
    });
  }
  //method for submit form
  ngSubmit({ value, valid }) {
    if (valid) {
      this.loading = true;
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.DIGITALMARKETING.ADD,
        uri: '',
        postBody: value,
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {
          this.loading = false;
          if (success.success === true) {
            this.getDigitalMarkeingSeoData();
            this.alertService.showNotificationMessage(
              'success',
              'bottom',
              'left',
              'txt_s',
              'check_circle',
              'SEO',
              'You have added image title and descriptions.'
            );
          } else if (success.success === false) {
            this.loading = false;
            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'SEO',
              'You have not added image title and descriptions.'
            );
          }
        },
        (error) => {
          this.loading = false;
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_g',
            'error',
            'Unexpected Error',
            AppSettings.ERROR
          );
        });

    } else {
      this.loading = false;
    }
  }
  //mat form group tab metod
  onTabChanged(event: any): void {
    this.selectedIndex = event;
  }
  //seo Url 
  redirectPageCarrier(dotNumber: any, companyName: any) {
    let newCompanyName = companyName?.replace(/\s/g, '-').toLowerCase();
    const data = environment.domain + "/carrier-profile/" + dotNumber + "/" + newCompanyName;
    this.profilUrl = data;
  }
  //method for update title and description from api
  getSeoForm(seoFormData) {

    this.seoForm = this.FormBuilder.group({
      title: [seoFormData?.title ? seoFormData?.title : this.companyName, [Validators.required, Validators.maxLength(64)]],
      descriptions: [seoFormData?.descriptions ? seoFormData?.descriptions : this.aboutCompany, [Validators.required, Validators.maxLength(1024)]]
    })
    //update data in the all socialmedia mat-tab
    this.title = seoFormData?.title ? this.title = seoFormData?.title : this.title = this.companyName;
    this.description = seoFormData?.descriptions ? seoFormData?.descriptions : this.description = this.aboutCompany;

    //when user edit title and description so it will update real time 
    this.seoForm.get('title').valueChanges.subscribe(value => {
      this.title = value;
    });
    this.seoForm.get('descriptions').valueChanges.subscribe(value => {
      this.description = value;
    });
    this.skeletonLoader = false;
  }
  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }
}