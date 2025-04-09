import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';

@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.scss'],
})
export class UserNotificationComponent implements OnInit {
  constructor( public commonService: CommonService,private fb: FormBuilder,private toastr: ToastrService) { }
  notificationForm!: FormGroup;
  notificationdata:any
  ngOnInit(): void {
   
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
         this.toastr.success('Notification update successfully!', 'Success');
         
       },
       error: (error) => {
         
         // this.toastr.error('User already exists!', 'Error');
         this.toastr.error(error?.error[0]?.message||'Something went wrong', 'Error');
         console.error('API Error:', error);
       }
     });
   }
    onSubmit() {
      console.log(this.notificationForm.value);
      this.editNotification();
    }
}
