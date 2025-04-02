import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';

@Component({
  selector: 'app-insurance-alert',
  templateUrl: './insurance-alert.component.html',
  styleUrls: ['./insurance-alert.component.scss']
})
export class InsuranceAlertComponent implements OnInit {
  showAdvancedFilter = false;
  isChecked = true;
  public page=1
  filterForm: FormGroup;
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    
  dateRanges = [
    { label: 'Created', start: 'createdStart', end: 'createdEnd', picker: 'picker1' },
    { label: 'Last Email Sent At', start: 'emailStart', end: 'emailEnd', picker: 'picker2' },
    { label: 'Updated', start: 'updatedStart', end: 'updatedEnd', picker: 'picker3' },
    { label: 'Expire', start: 'expireStart', end: 'expireEnd', picker: 'picker4' }
  ];
  constructor(public commonService: CommonService,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.fetchChangeAlertInsurance()
    this.filterForm = this.fb.group({
      policyNumber: [''],
      status: [''],
      createdStart: [''],
      createdEnd: [''],
      emailStart: [''],
      emailEnd: [''],
      updatedStart: [''],
      updatedEnd: [''],
      expireStart: [''],
      expireEnd: ['']
    });
  }

    fetchChangeAlertInsurance(resetData: boolean = false): void {
      // this.showScrollSpinner=true
      
      let newParams: {
        fromCreatedAtDate?: string;
        toCreatedAtDate?: string;
        fromUpdatedAtDate?: string;
        toUpdatedAtDate?: string;
        fromLastEmailSendDate?: string;
        toLastEmailSendDate?: string;
        fromExpireDate?: string;
        toExpireDate?: string;
        status?: boolean;
        policyNo?:string;
        limit: number;
        page: number;
      } = {
        limit: 10,
        page: this.page,
      };
    
      const { policyNumber, status, createdStart, createdEnd,emailStart,emailEnd, updatedStart,updatedEnd,expireStart,expireEnd } = this.filterForm.value;
    
      if (createdStart) newParams.fromCreatedAtDate = this.formatDateForAPI(createdStart);
      if (createdEnd) newParams.toCreatedAtDate = this.formatDateForAPI(createdEnd);
      if (createdStart) newParams.fromUpdatedAtDate = this.formatDateForAPI(createdStart);
      if (createdEnd) newParams.toUpdatedAtDate = this.formatDateForAPI(createdEnd);
      if (createdStart) newParams.fromLastEmailSendDate = this.formatDateForAPI(createdStart);
      if (createdEnd) newParams.toLastEmailSendDate = this.formatDateForAPI(createdEnd);
      if (createdStart) newParams.fromExpireDate = this.formatDateForAPI(createdStart);
      if (createdEnd) newParams.toExpireDate = this.formatDateForAPI(createdEnd);
      if(policyNumber) newParams.policyNo=policyNumber
      if (status) newParams.status = status;
    
  
  //     console.log('Selected Filters:', newParams);
    
  //    // ✅ Conditionally add parameters only if they have values
  // const queryParams = new URLSearchParams();
  // if (this.page) queryParams.set('page', this.page.toString());
  // if (newParams.limit) queryParams.set('limit', newParams.limit.toString());
  // if (newParams.fromStartDate) queryParams.set('fromDate', newParams.fromStartDate);
  // if (newParams.toStartDate) queryParams.set('toDate', newParams.toStartDate);
  // if (newParams.userType) queryParams.set('userType', newParams.userType);
  // if (newParams.postalCode) queryParams.set('postalCode', newParams.postalCode);
  // if (newParams.location) queryParams.set('location', newParams.location);
  
  // // Replace the current history entry with new params
  // history.replaceState(null, '', `${window.location.pathname}?${queryParams.toString()}`);
 
  
  // Conditionally set the API key for CARRIER or BROKER
  const apiKey = AppSettings.APIsNameArray.CHANGEALTERT.INSURANCE 
  
  // Only call the API if a valid API key is present
  if (apiKey) {
    let APIparams = {
      apiKey: apiKey,
      uri: this.commonService.getAPIUriFromParams(newParams),
    };
      this.commonService.getList(APIparams).subscribe(
        (response) => {
          console.log(response)
          
          if (response && response.response && response.response.data ) {
            const newData = response.response.data;
            if (resetData) {
              this.dataSource.data = newData;
            
            } else {
              const existingIds = new Set(this.dataSource.data.map(item => item.id));
              const uniqueData = newData.filter(item => !existingIds.has(item.id));
              this.dataSource.data = [...this.dataSource.data, ...uniqueData];
             
            }
          
          // this.uniqueUserTypes = Array.from(new Set([...this.uniqueUserTypes, ...newUserTypes]));
          //   this.showScrollSpinner=false
          //   console.log(this.dataSource, 'Updated DataSource');
          //   this.totalPages = response.response.totalPages;
          //   this.totalRecords = response.response.totalRecords;
          //   this.loading = false;
          //   this.cdRef.detectChanges();
          }
        },
        (error) => {
          // this.showScrollSpinner=false
          
          console.error('Error fetching carriers:', error);
        }
      );
    }
  }

  applyFilters() {
    console.log('Applied Filters:', this.filterForm.value);
    // 
    // Here you can call your API with the filter form values
  }
  clearForm() {
    this.filterForm.reset();
    console.log('Filters cleared');
  }

  formatDateForAPI(date: any): string {
    if (!date) return '';
    let d = new Date(date);
    let month = ('0' + (d.getMonth() + 1)).slice(-2); 
    let day = ('0' + d.getDate()).slice(-2); 
    let year = d.getFullYear();
    return `${month}/${day}/${year}`; 
  }

  // Profile analytics table
  displayedColumns: string[] = ['alertID', 'policyNumber', 'companyName', 'status', 'createdOn', 'lastEmailsendAt', 'lastUpdated', 'emailExpiryDate', 'action'];
  // Advanced filter toggle
  toggleFilter() {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }

}
