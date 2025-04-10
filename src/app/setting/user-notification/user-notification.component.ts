import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.scss'],
})
export class UserNotificationComponent implements OnInit {
  constructor( public commonService: CommonService,private fb: FormBuilder,public alertService: AlertService,) { }
  notificationForm!: FormGroup;
  notificationdata:any;
  userType:any;
  ngOnInit(): void {
    this.userType = localStorage.getItem('user_type');
    this.notificationForm = this.fb.group({
      profileViewAlert: [true],
      profileViewFrequency: ['daily'],
      teamMemberAdd: [true],
      teamMemberLoginAccess: [true],
      incompleteProfileRemind: [true],
      loadQuoteRequest: [true],
      gotANewReview: [true],
      respondToReviewReminder: [true],
      truckAvailabilityExpiringSoon: [true],
      monthlyProfileViewAlert: [true],
      insuranceExpiryAlert: [true],
      authorityStatusChangeAlert: [true],
      monthlyContactViewAlert: [true],
    });
    this.notificationControlList();
    // this.notificationForm.valueChanges.subscribe((formValue) => {
    //   // Call your update API here with the updated form value
    //   this.editNotification();
    // });
  }
  notificationControlList(){
    
    let newParams: {
     
    } = {};
  
  const apiKey = AppSettings.APIsNameArray.NOTIFICATIONCONTROL.NOTIFICATIONCONTROLLIST
  
  if (apiKey) {
    let APIparams = {
      apiKey: apiKey,
      uri: this.commonService.getAPIUriFromParams(newParams),
    };
    console.log(APIparams)
      this.commonService.getList(APIparams).subscribe(
        (response) => {
          console.log(response,"249hhhhhhhhhhhhh")
          console.log(this.notificationForm.value)
         this.notificationdata= response.notification;
         this.notificationForm.patchValue(this.notificationdata);
         console.log(this.notificationForm.value)
        },
        (error) => {
          
          console.error('Error fetching carriers:', error);
        }
      );
    }}
    editNotification(): void {
     const APIparams = {
       apiKey:  AppSettings.APIsNameArray.NOTIFICATIONCONTROL.NOTIFICATIONCONTROLEDIT,             
       postBody: {
        ...this.notificationForm.value,
        id: this.notificationdata.id
      }
     };
 
     this.commonService.putAllValue(APIparams).subscribe({
       next: (response) => {
         console.log('API Response:', response);
         this.alertService.showNotificationMessage(
          'success',
          'bottom',
          'left',
          'txt_s',
          'check_circle',
          'Success',
          'Notification update successfully!'
        );
         
       },
       error: (error) => {
         this.alertService.showNotificationMessage(
          'danger',
          'bottom',
          'left',
          'txt_d',
          'check_circle',
          'Error',
          'Something went wrong'
        );
         console.error('API Error:', error);
       }
     });
   }
    onSubmit() {
      console.log(this.notificationForm.value);
      this.editNotification();
    }
}
 