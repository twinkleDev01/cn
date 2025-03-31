import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {
  memberForm: FormGroup;
permissionList=[]
  constructor(private fb: FormBuilder, public commonService: CommonService,private location: Location,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.createForm();
    this.getTeamPermissionList();

  }

  getTeamPermissionList(): void {
        
    let newParams: {}
    
    const apiKey = AppSettings.APIsNameArray.TEAM.TEAMPERMISSIONLIST
    
    // Only call the API if a valid API key is present
    if (apiKey) {
      let APIparams = {
        apiKey: apiKey,
        uri: this.commonService.getAPIUriFromParams(newParams),
      };
        this.commonService.getList(APIparams).subscribe(
          (response) => {
            console.log(response)
          this.permissionList=response.response
            },
          (error) => {
            console.error('Error fetching carriers:', error);
          }
        );
      }}

  createForm() {
    this.memberForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required]],
      countryCode: ['', Validators.required],
      status: ['', Validators.required],
      permissions: this.fb.array([], Validators.required)
    });
  }

  get permissions(): FormArray {
    return this.memberForm.get('permissions') as FormArray;
  }

  onCheckboxChange(e: any) {
    if (e.checked) {
      this.permissions.push(this.fb.control(e.source.value));
    } else {
      const index = this.permissions.controls.findIndex((x) => x.value === e.source.value);
      this.permissions.removeAt(index);
    }
  }

  onSubmit() {
    if (this.memberForm.valid) {
      console.log('Form Submitted:', this.memberForm.value);
      this.addTeam()
    } else {
      this.memberForm.markAllAsTouched();
    }
  }

  addTeam(): void {
    const APIparams = {
      apiKey:  AppSettings.APIsNameArray.TEAM.TEAMADD,               // Add your URI parameters if needed
      postBody: {                       // Add your POST body data
        "firstName":  this.memberForm.get('firstName')?.value,
    "lastName":  this.memberForm.get('lastName')?.value,
    "email":  this.memberForm.get('email')?.value,
    "phone":  this.memberForm.get('contactNumber')?.value,
    "countryCode":  this.memberForm.get('countryCode')?.value,
    "activeStatus":  this.memberForm.get('status')?.value,
    "teamPermission":  this.memberForm.get('permissions')?.value
      }
    };

    this.commonService.postAllValue(APIparams).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.toastr.success('Data saved successfully!', 'Success');
        this.location.back();
      },
      error: (error) => {
        console.error('API Error:', error);
        this.toastr.error('Something went wrong!', 'Error');
      }
    });
  }

  Cancel(){
    this.memberForm.reset();
    this.location.back();
  }

  getControl(controlName: string) {
    return this.memberForm.get(controlName);
  }

  isInvalid(controlName: string) {
    const control = this.getControl(controlName);
    return control?.invalid && (control?.touched || control?.dirty);
  }

}
