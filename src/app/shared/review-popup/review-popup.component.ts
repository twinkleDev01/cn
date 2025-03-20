import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '../../commons/service/alert.service';
import { CommonService } from '../../commons/service/common.service';
import { AppSettings } from '../../commons/setting/app_setting';

export interface DialogData {
  openPop: string;
}

@Component({
  selector: 'app-review-popup',
  templateUrl: './review-popup.component.html',
  styleUrls: ['./review-popup.component.css']
})

export class ReviewPopupComponent implements OnInit {
  public reviewForm: FormGroup;
  public loading=false;
  constructor( 
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private commonService: CommonService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ReviewPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,) { }

  ngOnInit(): void {

    this.reviewForm = this.formBuilder.group({
      email: ['',[Validators.required,Validators.email,Validators.maxLength(128),Validators.pattern(AppSettings.emailPattern)],],
      firstName: ['',[Validators.required, Validators.maxLength(64)],],
      lastName: ['',[Validators.required, Validators.maxLength(64)],],
    });
  }

  onNoClick(): void {
    this.dialogRef.close({ event: 'fail' });
  }

  reviewFormSubmit({value,valid}){
    if (valid) {
      this.loading=true;
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.REVIEW.ADDREVIEW,
        uri: '',
        postBody: value,
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {
          this.loading=false;
          if (success.success === true) {
            this.onNoClick();
            this.alertService.showNotificationMessage(
              'success',
              'bottom',
              'left',
              'txt_s',
              'check_circle',
              'Invited',
              'User has invited successfully.'
            );
          } else if (success.success === false) {

            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'Invited',
              'User has invited successfully.'
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
        }
      );
      }

  }

}
