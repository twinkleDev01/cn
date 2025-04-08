import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, of, startWith } from 'rxjs';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
interface Carrier {
  id: string;
  dotNumber: string;
  companyName: string;
  phyCity: string;
  phyStateCode: string | null;
  phyCountryCode: string;
  phyZip: string | null;
  driversNumbers: string | null;
  trucksNumbers: string;
  countryFlag: string;
}
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
     searchControl = new FormControl('');
     isFilterApplied = false;
     myControl = new FormControl('');
     AutoCompleteOptions: any[] = [];
     filteredOptions: any[] = [];
     loaddedScreens = 0;
     teamIdList :any=[];
  dateRanges = [
    { label: 'Created', start: 'createdStart', end: 'createdEnd', picker: 'picker1' },
    { label: 'Last Email Sent At', start: 'emailStart', end: 'emailEnd', picker: 'picker2' },
    { label: 'Updated', start: 'updatedStart', end: 'updatedEnd', picker: 'picker3' },
    { label: 'Expire', start: 'expireStart', end: 'expireEnd', picker: 'picker4' }
  ];
  totalPages: number = 0;
  public spinnerLoader = false;
  constructor(public commonService: CommonService,private fb: FormBuilder,private router: Router,
                private route: ActivatedRoute,  private cdRef: ChangeDetectorRef,) {
   
  }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
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
        expireEnd: [''],
        dotNumber:[''],
        teamIds: [],
      });
      if (params && Object.keys(params).length) {
        console.log(params,"89");
        this.filterForm.patchValue({
          createdStart: params['fromCreatedAtDate'] ? new Date(params['fromCreatedAtDate']) : null,
          createdEnd: params['toCreatedAtDate'] ? new Date(params['toCreatedAtDate']) : null,
          updatedStart: params['fromUpdatedAtDate'] ? new Date(params['fromUpdatedAtDate']) : null,
          updatedEnd: params['toUpdatedAtDate'] ? new Date(params['toUpdatedAtDate']) : null,
          emailStart: params['fromLastEmailSendDate'] ? new Date(params['fromLastEmailSendDate']) : null,
          emailEnd: params['toLastEmailSendDate'] ? new Date(params['toLastEmailSendDate']) : null,
          expireStart: params['fromExpireDate'] ? new Date(params['fromExpireDate']) : null,
          expireEnd: params['toExpireDate'] ? new Date(params['toExpireDate']) : null,
          policyNumber: params['policyNo'] || '',
          status: params['status'] || '',
          teamIds: params['teamIds'] || '',
          dotNumber: params['dotNumber'] || ''
        });
          this.filterForm.updateValueAndValidity();
      }
  });
    this.fetchChangeAlertInsurance();
    this.autocompleteSearchData();
    this.teamList();
  }
 
  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.AutoCompleteOptions.filter(option =>
      option.dotNumber.toLowerCase().includes(filterValue)
    );
  }
  autocompleteSearchData(searchdata?:any): void {
    let newParams = {
      search: searchdata
    };
    const apiKey = AppSettings.APIsNameArray.EXTRA.AUTOCOMPLETE;

    if (apiKey) {
      let APIparams = {
        apiKey: apiKey,
        uri: this.commonService.getAPIUriFromParams(newParams),
      };

      this.commonService.getList(APIparams).subscribe(
        (response) => {
          this.AutoCompleteOptions = response.response.carrierData;
          console.log(this.AutoCompleteOptions)
         this.filteredOptions=this.AutoCompleteOptions
         console.log('kkkkkkkkkkkk',this.filteredOptions)
        },
        (error) => {
          console.error('Error fetching carriers:', error);
        }
      );
    }
  }
    fetchChangeAlertInsurance(resetData: boolean = false): void {
      this.spinnerLoader = true;
      
      let newParams: {
        fromCreatedAtDate?: string;
        toCreatedAtDate?: string;
        fromUpdatedAtDate?: string;
        toUpdatedAtDate?: string;
        fromLastEmailSendDate?: string;
        toLastEmailSendDate?: string;
        fromExpireDate?: string;
        toExpireDate?: string;
        status?: string;
        policyNo?:string;
        limit: number;
        page: number;
        dotNumber?: string;
        teamIds?: string;
      } = {
        limit: 10,
        page: this.page,
      };
    
      const { policyNumber, status,teamIds, createdStart, createdEnd,emailStart,emailEnd, updatedStart,updatedEnd,expireStart,expireEnd,dotNumber } = this.filterForm?.value;
    
      if (createdStart) newParams.fromCreatedAtDate = this.formatDateForAPI(createdStart);
      if (createdEnd) newParams.toCreatedAtDate = this.formatDateForAPI(createdEnd);
      if (updatedStart) newParams.fromUpdatedAtDate = this.formatDateForAPI(updatedStart);
      if (updatedEnd) newParams.toUpdatedAtDate = this.formatDateForAPI(updatedEnd);
      if (emailStart) newParams.fromLastEmailSendDate = this.formatDateForAPI(emailStart);
      if (emailEnd) newParams.toLastEmailSendDate = this.formatDateForAPI(emailEnd);
      if (expireStart) newParams.fromExpireDate = this.formatDateForAPI(expireStart);
      if (expireEnd) newParams.toExpireDate = this.formatDateForAPI(expireEnd);
      if(policyNumber) newParams.policyNo=policyNumber
      if (status) newParams.status = status;
      if(dotNumber) newParams.dotNumber=dotNumber;
      if (teamIds) newParams.teamIds = teamIds?.join(',');
  
      console.log('Selected Filters:', newParams);
    
     // ✅ Conditionally add parameters only if they have values
  const queryParams = new URLSearchParams();
  if (this.page) queryParams.set('page', this.page.toString());
  if (newParams.limit) queryParams.set('limit', newParams.limit.toString());
  if (newParams.fromCreatedAtDate) queryParams.set('fromCreatedAtDate', newParams.fromCreatedAtDate);
  if (newParams.toCreatedAtDate) queryParams.set('toDate', newParams.toCreatedAtDate);
  if (newParams.fromUpdatedAtDate) queryParams.set('toCreatedAtDate', newParams.fromUpdatedAtDate);
  if (newParams.toUpdatedAtDate) queryParams.set('toUpdatedAtDate', newParams.toUpdatedAtDate);
  if (newParams.fromLastEmailSendDate) queryParams.set('fromLastEmailSendDate', newParams.fromLastEmailSendDate);
  if (newParams.toLastEmailSendDate) queryParams.set('toLastEmailSendDate', newParams.toLastEmailSendDate);
  if (newParams.fromExpireDate) queryParams.set('fromExpireDate', newParams.fromExpireDate);
  if (newParams.toExpireDate) queryParams.set('toExpireDate', newParams.toExpireDate);
  if (newParams.policyNo) queryParams.set('policyNo', newParams.policyNo);
  if (newParams.status) queryParams.set('status', newParams.status);
 if (newParams.dotNumber) queryParams.set('dotNumber', newParams.dotNumber);
 if (newParams.teamIds) queryParams.set('teamIds', newParams.teamIds);
 
  history.replaceState(null, '', `${window.location.pathname}?${queryParams.toString()}`);
 
  
  const apiKey = AppSettings.APIsNameArray.CHANGEALTERT.INSURANCE 
  
  if (apiKey) {
    let APIparams = {
      apiKey: apiKey,
      uri: this.commonService.getAPIUriFromParams(newParams),
    };
    this.loaddedScreens = this.page;
      this.commonService.getList(APIparams).subscribe(
        (response) => {
          this.spinnerLoader = false;
          
          if (response && response.response && response.response.data ) {
            // const newData = response.response.data;

            const newData = response.response.data.map((item:any)=>({
              ...item,
              
              createdAt: this.formatDate(item.createdAt),
              // emailExpiryDate:this.formatDate(item.emailExpiryDate),
              lastEmailSendAt:this.formatDate(item.lastEmailSendAt),
              updatedAt:this.formatDate(item.updatedAt)

            }));
            if (resetData) {
              this.dataSource.data = newData;
            
            } else {
              const existingIds = new Set(this.dataSource.data.map(item => item.id));
              const uniqueData = newData.filter(item => !existingIds.has(item.id));
              this.dataSource.data = [...this.dataSource.data, ...uniqueData];
            }
          
       
          this.totalPages = response.response.totalPages;
          // this.totalRecords = response.response.totalRecords;
            this.spinnerLoader = false;
            this.cdRef.detectChanges();
          }
        },
        (error) => {
          this.loaddedScreens--;
          this.spinnerLoader = false;
          console.error('Error fetching carriers:', error);
        }
      );
    }
  }

  applyFilters() {
    this.showAdvancedFilter = false;
    this.isFilterApplied = true;
    this.page = 1;
    this.dataSource.data = [];
    this.fetchChangeAlertInsurance(true);
  }
  clearForm() {
    this.filterForm.reset();
    console.log('Filters cleared');
  }

  setupSearchFilter() {
    this.searchControl.valueChanges.subscribe(() => {
      this.applyFilter();
    });
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
  displayedColumns: string[] = ['alertID','DOTnumber', 'policyNumber', 'companyName', 'status', 'createdOn', 'lastEmailsendAt', 'lastUpdated', 'emailExpiryDate', 'action'];

  toggleFilter() {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }
  checkExpiry(expiryDate?: string): string {
    if (!expiryDate) return "Active"; // If no date is provided, return "active"
  
    const expiry = new Date(expiryDate).getTime();
    const current = new Date().getTime();
  
    return current > expiry ? "Expired" : "Active";
  }
  refresh(){
    this.fetchChangeAlertInsurance(true);
  }
  resetFilters(): void {
    console.log('Reset Filters Clicked');
    this.showAdvancedFilter = false;
    // this.searchControl.setValue('');
    this.isFilterApplied = false;
    this.dataSource.filter = '';
    this.page = 1;
    this.dataSource.data = [];
    this.filterForm.reset();
    this.fetchChangeAlertInsurance(true);
    
  }

  formatDate(inputDate:string): string {
    if(inputDate == null){
      return
    }
    // Parse the input date string
    let [datePart, timePart] = inputDate.split(' ');
    let [month, day, year] = datePart.split('/');

    // Construct the formatted date
    let formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(
      2,
      '0'
    )}T${timePart}.000Z`;

    return formattedDate;
  }

applyFilter() {
  const filterValue = this.searchControl.value.trim().toLowerCase();

  this.dataSource.filterPredicate = (data: any, filter: string) => {
    return data.carrier?.companyName?.toLowerCase().includes(filter);
  };

  this.dataSource.filter = filterValue;
  this.isFilterApplied = filterValue.length > 0;
} 


onDotInputChange(value: string) {
  console.log('Current DOT value:', value);
  this.autocompleteSearchData(value);
}

addParams(currentPage:any = this.page){
this.page = currentPage;
  let newParams: {
    fromCreatedAtDate?: string;
    toCreatedAtDate?: string;
    fromUpdatedAtDate?: string;
    toUpdatedAtDate?: string;
    fromLastEmailSendDate?: string;
    toLastEmailSendDate?: string;
    fromExpireDate?: string;
    toExpireDate?: string;
    status?: string;
    policyNo?:string;
    limit: number;
    page: number;
    dotNumber?: string;
  } = {
    limit: 10,
    page: currentPage,
  };

const queryParams = new URLSearchParams();
  if (currentPage) queryParams.set('page', currentPage.toString());
  if (newParams.limit) queryParams.set('limit', newParams.limit.toString());
  if (newParams.fromCreatedAtDate) queryParams.set('fromCreatedAtDate', newParams.fromCreatedAtDate);
  if (newParams.toCreatedAtDate) queryParams.set('toDate', newParams.toCreatedAtDate);
  if (newParams.fromUpdatedAtDate) queryParams.set('toCreatedAtDate', newParams.fromUpdatedAtDate);
  if (newParams.toUpdatedAtDate) queryParams.set('toUpdatedAtDate', newParams.toUpdatedAtDate);
  if (newParams.fromLastEmailSendDate) queryParams.set('fromLastEmailSendDate', newParams.fromLastEmailSendDate);
  if (newParams.toLastEmailSendDate) queryParams.set('toLastEmailSendDate', newParams.toLastEmailSendDate);
  if (newParams.fromExpireDate) queryParams.set('fromExpireDate', newParams.fromExpireDate);
  if (newParams.toExpireDate) queryParams.set('toExpireDate', newParams.toExpireDate);
  if (newParams.policyNo) queryParams.set('policyNo', newParams.policyNo);
  if (newParams.status) queryParams.set('status', newParams.status);
   if (newParams.dotNumber) queryParams.set('dotNumber', newParams.dotNumber);
history.replaceState(null, '', `${window.location.pathname}?${queryParams}`);
}
onStatusToggle(newStatus: boolean, rowData: any): void {
  console.log(newStatus, rowData
  )
  const payload = {
    "policyNo": rowData.policyNo,
    "status": newStatus,
    "emailExpiryDate": rowData.emailExpiryDate,
    "dotType": rowData.dotType,
    "dotNumber": rowData.dotNumber
};
console.log(payload)

const APIparams = {
  apiKey: AppSettings.APIsNameArray.CHANGEALTERT.INSURANCEADD,
  postBody: payload
};

this.commonService.post(APIparams).subscribe({
  next: (res) => {
    console.log('Status updated successfully:', res);
  },
  error: (err) => {
    console.error('Error updating status:', err);
  }
});
}
formatCompanyName(name: string): string {
  return name ? name.replace(/\s+/g, '-') : '';
}
// For team dropdown pagination
teamPage = 1;
teamLimit = 10; // Items per load
totalTeams = 0;
loadingMoreTeams = false;
hasMoreTeams = true;
teamList(loadMore: boolean = false): void {
  if (loadMore) {
    if (!this.hasMoreTeams || this.loadingMoreTeams) return;
    this.teamPage++;
  } else {
    // Initial load - reset
    this.teamPage = 1;
    this.teamIdList = [];
    this.hasMoreTeams = true;
  }

  this.loadingMoreTeams = true;
  if (!loadMore) this.spinnerLoader = true;

  const params = {
    limit: this.teamLimit,
    page: this.teamPage
  };

  const apiKey = AppSettings.APIsNameArray.TEAM.TEAMLIST;
  if (apiKey) {
    let APIparams = {
      apiKey: apiKey,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    
    this.commonService.getList(APIparams).subscribe(
      (response) => {
        this.loadingMoreTeams = false;
        this.spinnerLoader = false;
        
        if (response?.response?.teamArray) {
          this.teamIdList = [...this.teamIdList, ...response.response.teamArray];
          // Check if more teams are available
          this.hasMoreTeams = response.response.teamArray.length >= this.teamLimit;
          this.totalTeams = response.response.totalCount || 0;
        }
      },
      (error) => {
        this.loadingMoreTeams = false;
        this.spinnerLoader = false;
        console.error('Error fetching teams:', error);
      }
    );
  }
}
@ViewChild('teamSelect') teamSelect: MatSelect;

onTeamDropdownOpened(): void {
  // Initialize scroll listener when dropdown opens
  setTimeout(() => {
    if (this.teamSelect && this.teamSelect.panel) {
      const panel = this.teamSelect.panel.nativeElement;
      panel.addEventListener('scroll', this.onTeamDropdownScroll.bind(this));
    }
  });
}

onTeamDropdownScroll(event: Event): void {
  const panel = event.target as HTMLElement;
  const scrollThreshold = 50; // pixels from bottom
  const atBottom = panel.scrollHeight - panel.scrollTop <= panel.clientHeight + scrollThreshold;
  
  if (atBottom && this.hasMoreTeams && !this.loadingMoreTeams) {
    this.teamList(true); // Load more teams
  }
}

ngOnDestroy(): void {
  // Clean up scroll listener
  if (this.teamSelect && this.teamSelect.panel) {
    const panel = this.teamSelect.panel.nativeElement;
    panel.removeEventListener('scroll', this.onTeamDropdownScroll);
  }
}
}
