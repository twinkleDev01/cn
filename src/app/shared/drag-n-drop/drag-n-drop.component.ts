import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { AddCardPopupComponent } from '../add-card-popup/add-card-popup.component';
import { CommonPopupComponent } from '../common-popup/common-popup.component';
import { PopupComponent } from '../popup/popup.component';
@Component({
  selector: 'app-drag-n-drop',
  templateUrl: './drag-n-drop.component.html',
  styleUrls: ['./drag-n-drop.component.css']
})
export class DragNDropComponent implements OnInit {
  @Input() currentTab: any;
  public skeletonLoader = false;
  public profileImageForm: FormGroup;
  public loading = false
  public imagmessage: any;
  public userType: any;
  public userId: any;
  public userID: any;
  public mediaData: any;
  public mediaId:any;
  public sliceText:any;
  public images = [];
  public multiImgDisableIndicator = false;
  public multiFileDisableIndicator = false;
  public MultiFileArray = [];
  public multiUploadDisableIndicator = true;
  public multiUploadErrorMsg = false;
  public showAllImage:boolean=false;
  public showAllVideo:boolean=false;
  public showAllPdf:boolean=false;
  public massege: string;
  public erroMassege: string;
 
    constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    public alertService: AlertService,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.skeletonLoader = true;
    this.userId = localStorage.getItem('userId')
    this.getMedia();
    this.userType = localStorage.getItem('user_type');    
    this.profileImageForm = this.formBuilder.group({
      mediaType:[''],
      media: [''],
    });

  }
  

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  getMedia() {
    this.skeletonLoader = true;
    let uri = null;
    let newParams = {
      userId: this.userId,
      limit: 100
    };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.MEDIA.LIST,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if(ServerRes.success === true) {
        this.mediaData = ServerRes.response?.medias;
        this.skeletonLoader=false
      }else{
        this.skeletonLoader=false;
        this.mediaData = [];
      }
    },(error) => {
      this.skeletonLoader=false;
      this.mediaData = [];
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
  }

  removeSelectedFile(index) {
    var totalSize = 0;
    this.MultiFileArray.splice(index, 1);
    if (this.MultiFileArray.length > 0) {
      for (var i = 0; i < this.MultiFileArray.length; i++) {
        totalSize = totalSize + this.MultiFileArray[i].size;

        if (i === this.MultiFileArray.length - 1) {
          var totalSizeMB = totalSize / 1024 / 1024;
          if (totalSizeMB > 10) {
            this.multiUploadDisableIndicator = true;
            this.multiUploadErrorMsg = true;
          } else {
            this.multiUploadDisableIndicator = false;
            this.multiUploadErrorMsg = false;
          }
        }
      }
    } else {
      this.multiImgDisableIndicator = false;
      this.multiFileDisableIndicator = false;
      this.multiUploadDisableIndicator = true;
      this.multiUploadErrorMsg = false;
    }
  }

  multiImageUpload(event,type) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: "670px",
      data: { openPop: type },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "ok") {
        this.getMedia();
      }
    });

  }

  multiUpload(event) {
    var totalSize = 0;
    for (var i = 0; i < event.target.files.length; i++) {
      this.MultiFileArray.push(event.target.files[i]);
      totalSize = totalSize + event.target.files[i].size;
      if (i === event.target.files.length - 1) {
        var totalSizeMB = totalSize / 1024 / 1024;
        if (totalSizeMB > 10) {
          this.multiUploadDisableIndicator = true;
          this.multiUploadErrorMsg = true;
        } else {
          this.multiUploadDisableIndicator = false;
          this.multiUploadErrorMsg = false;
        }
      }
    }
  }

  getSize(bytes) {
    let k = 1024,
      dm = 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  imageCheck(url: any) {
    const extension = url.split('.').pop();
    if (extension === 'pdf') {
      return ('assets/images/pdf_icon.svg');
    } else if(extension === 'xls') {
      return ('assets/images/excel.png');
    }else{
      return ('assets/images/doc.png');
    }
  }

  confirmationPopup(imageData:any){
    const dialogRef = this.dialog.open(CommonPopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: AppSettings.popWidth,
      data: { openPop: 'imageconfirmation',}
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'success') {
        this.mediaRemove(imageData)
      }
    });
  }

  mediaRemove(imageData:any){
    this.loading=true;
    let uri =null;
    let newParams = {
      userId: imageData.userId,
      mediaId : imageData.id
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.MEDIA.DELETE,
      uri: uri,
    };
    this.commonService.delete(APIparams).subscribe(

      (success) => {
        if(this.currentTab=='imageTab'){
          this.massege='You have successfully removed image';
          this.erroMassege='You have not successfully updated image';
        }
        if(this.currentTab=='pdfTab'){
          this.massege='You have successfully removed PDF';
          this.erroMassege='You have not successfully updated image';
        }
        if(this.currentTab=='videoTab'){
          this.massege='You have successfully removed video';
          this.erroMassege='You have not successfully updated video';
        }

        this.loading=false;
        this.getMedia();
        if (success.success === true) {
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            'Remove Lane',
            this.massege
          );
         
        } else if (success.success === false) {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_d',
            'cancel',
            'Remove Lane',
            this.erroMassege
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
        this.loading=false;
      }
    );
  }

  showAllMedia(type) {
    if(type=='image'){
      this.showAllImage = !this.showAllImage;
    }
    else if(type=='pdf'){
      this.showAllPdf = !this.showAllPdf;
    }
    else if(type=='video'){
      this.showAllVideo = !this.showAllVideo;
    }
  }
  
}


