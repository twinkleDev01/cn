import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.scss']
})
export class EditMemberComponent implements OnInit {

  dataToEdit:any
 memberForm: FormGroup;
 permissionList=[]
 public spinnerLoader = false;
 countryFlagUrl = './assets/country/us.png'; // Default flag
 countryList = [
   { value: 'US', flag: './assets/country/us.png', code: '+1' },
   { value: 'MX', flag: './assets/country/mx.png', code: '+52' },
   { value: 'CA', flag: './assets/country/ca.png', code: '+1' }
 ];
  constructor(private router: Router,private fb: FormBuilder,public commonService: CommonService,private cdRef: ChangeDetectorRef,private location: Location,private toastr: ToastrService) {
    this.createForm()
    
    const navigation = this.router.getCurrentNavigation();
    const rowData = navigation?.extras?.state?.['data'];// The full row data
    this.dataToEdit=rowData
    console.log(rowData)
    this.memberForm.patchValue({
      firstName: rowData.firstName,
      lastName: rowData.lastName,
      email: rowData.email,
      contactNumber: rowData.phone,           // Mapping `phone` to `contactNumber`
      countryCode: rowData.countryCode,
      status: rowData.activeStatus === 0 ? 0 : 2   // Mapping `activeStatus` to `status`
    });
    this.onCountryChange(rowData.countryCode); 

    this.getTeamPermissionList();
    console.log(this.memberForm.value);
    this.memberForm.get('email')?.disable();
    this.memberForm.get('countryCode')?.disable();
    this.memberForm.get('contactNumber')?.disable();
    this.memberForm.get('permissions')?.disable();
  
  }

  ngOnInit(): void {
   
  }


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

    onSubmit() {
      if (this.memberForm.valid) {
        console.log('Form Submitted:', this.memberForm.value);
        this.editTeam()
      } else {
        this.memberForm.markAllAsTouched();
      }
    }
    get permissions(): FormArray {
      return this.memberForm.get('permissions') as FormArray;
    }
    // onCheckboxChange(e: any) {
    //   if (e.checked) {
    //     console.log(this.fb.control(e.source.value))
    //     this.permissions.push(this.fb.control(e.source.value));
    //   } else {
    //     const index = this.permissions.controls.findIndex((x) => x.value === e.source.value);
    //     this.permissions.removeAt(index);
    //   }
    // }
    onCheckboxChange(e: any, slug: string) {
      if (e.checked) {
        // Add the permissionSlug if checked
        this.permissions.push(this.fb.control(slug));
      } else {
        // Remove the permissionSlug if unchecked
        const index = this.permissions.controls.findIndex(control => control.value === slug);
        if (index > -1) {
          this.permissions.removeAt(index);
        }
      }
    }
    getControl(controlName: string) {
      return this.memberForm.get(controlName);
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
              this.patchPermissions(this.dataToEdit);
                },
              (error) => {
                console.error('Error fetching carriers:', error);
              }
            );
          }}

          patchPermissions(rowData: any) {
            console.log(rowData)
            if (rowData && rowData.teamPermission && Array.isArray(rowData.teamPermission)) {
              const slugs = rowData.teamPermission.map((perm: any) => perm.permissionSlug);
          
              // Clear existing form array
              this.permissions.clear();
          
              // Loop through the permission list and mark the matching ones as checked
              // this.permissionList.forEach((perm) => {
              //   if (slugs.includes(perm.permissionSlug)) {
              //     this.permissions.push(this.fb.control(perm));
    
              //     this.permissions.updateValueAndValidity();
              //     console.log(perm,this.permissions);
              //   }
              // });
              this.permissionList.forEach((perm) => {
                const isChecked = slugs.includes(perm.permissionSlug);
                const control = this.fb.control(isChecked); // Push `true` or `false` values
                this.permissions.push(control);
              });
              this.permissionList = [...this.permissionList];
              this.cdRef.detectChanges();
              console.log('Patched Permissions:', this.memberForm.value,this.permissionList);
            }
          }


          editTeam(): void {
             this.spinnerLoader = true;
            const selectedPermissions = this.memberForm.value.permissions
            .map((selected: boolean, index: number) => selected ? this.permissionList[index]?.permissionSlug : null)
            .filter(permissionSlug => permissionSlug !== null);
            const APIparams = {
              apiKey:  AppSettings.APIsNameArray.TEAM.EDITTEAM,             
              postBody: {        
                "id": this.dataToEdit?.id,            
                "firstName":  this.memberForm.get('firstName')?.value,
            "lastName":  this.memberForm.get('lastName')?.value,
            "activeStatus":  this.memberForm.get('status')?.value,
            "teamPermission":  selectedPermissions
              }
            };
        
            this.commonService.putAllValue(APIparams).subscribe({
              next: (response) => {
                this.spinnerLoader = false;
                console.log('API Response:', response);
                this.toastr.success('Team Member update successfully!', 'Success');
                this.location.back();
              },
              error: (error) => {
                this.spinnerLoader = false;
                // this.toastr.error('User already exists!', 'Error');
                this.toastr.error(error?.error[0]?.message, 'Error');
                console.error('API Error:', error);
              }
            });
          }
          
          Cancel(){
            this.memberForm.reset();
            this.location.back();
          }
    isInvalid(controlName: string) {
      const control = this.getControl(controlName);
      return control?.invalid && (control?.touched || control?.dirty);
    }
    onCountryChange(selectedValue: string) {
      const selectedCountry = this.countryList.find(country => country.value === selectedValue);
      if (selectedCountry) {
        this.countryFlagUrl = selectedCountry.flag;
      }
    }
}
