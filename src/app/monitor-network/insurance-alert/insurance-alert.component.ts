import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
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
     filteredOptions: Observable<any[]>;
  dateRanges = [
    { label: 'Created', start: 'createdStart', end: 'createdEnd', picker: 'picker1' },
    { label: 'Last Email Sent At', start: 'emailStart', end: 'emailEnd', picker: 'picker2' },
    { label: 'Updated', start: 'updatedStart', end: 'updatedEnd', picker: 'picker3' },
    { label: 'Expire', start: 'expireStart', end: 'expireEnd', picker: 'picker4' }
  ];
  totalPages: number = 0;
  public spinnerLoader = false;
  constructor(public commonService: CommonService,private fb: FormBuilder) {
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
      dotNumber:['']
    });
   }
   
  ngOnInit(): void {
    this.fetchChangeAlertInsurance();
    this.autocompleteSearchData();
    this.filterForm.get('dotNumber')?.valueChanges.pipe(
      startWith(''),
    ).subscribe(value => {
      const filterValue = typeof value === 'string' ? value.toLowerCase() : value?.dotNumber?.toLowerCase();
      this.filteredOptions = of(
        this.AutoCompleteOptions.filter(option =>
          option.dotNumber.toLowerCase().includes(filterValue)
        )
      );
    });
  }

  onInputFocus(currentValue: string) {
    const filterValue = currentValue?.toLowerCase() || '';
    this.filteredOptions = of(
      this.AutoCompleteOptions.filter(option =>
        option.dotNumber.toLowerCase().includes(filterValue)
      )
    );
  }
 
  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.AutoCompleteOptions.filter(option =>
      option.dotNumber.toLowerCase().includes(filterValue)
    );
  }
  autocompleteSearchData(): void {
    let newParams = {};
    const apiKey = AppSettings.APIsNameArray.EXTRA.AUTOCOMPLETE;

    if (apiKey) {
      let APIparams = {
        apiKey: apiKey,
        uri: this.commonService.getAPIUriFromParams(newParams),
      };

      this.commonService.getList(APIparams).subscribe(
        (response) => {
          this.AutoCompleteOptions = response.response.carrierData;
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
      } = {
        limit: 10,
        page: this.page,
      };
    
      const { policyNumber, status, createdStart, createdEnd,emailStart,emailEnd, updatedStart,updatedEnd,expireStart,expireEnd,dotNumber } = this.filterForm?.value;
    
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
  
  
  history.replaceState(null, '', `${window.location.pathname}?${queryParams.toString()}`);
 
  
  const apiKey = AppSettings.APIsNameArray.CHANGEALTERT.INSURANCE 
  
  if (apiKey) {
    let APIparams = {
      apiKey: apiKey,
      uri: this.commonService.getAPIUriFromParams(newParams),
    };
      this.commonService.getList(APIparams).subscribe(
        (response) => {
          this.spinnerLoader = false;
          
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
            this.totalPages = response.response.totalPages;
            // this.totalRecords = response.response.totalRecords;
          //   this.loading = false;
          //   this.cdRef.detectChanges();
          }
        },
        (error) => {
          this.spinnerLoader = false;
          console.error('Error fetching carriers:', error);
        }
      );
    }
  }

  applyFilters() {
    this.isFilterApplied = true;
    this.page = 1;
    this.dataSource.data = [];
    this.fetchChangeAlertInsurance(true);
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

 @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const scrollHeight = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    if (documentHeight - scrollHeight <= 1) {
      if (this.page < this.totalPages ){
        this.page += 1;
        this.fetchChangeAlertInsurance();
      }
    }
    this.getCurrentPage()
  }
  getCurrentPage() {
    const tbody = document.querySelector("tbody");
    const table = document.querySelector("table")
    const itemsPerPage = 10; 
    const scrollTop = $(window).scrollTop();
    const rowHeight = tbody.querySelector("tr")?.clientHeight || 0; 
    if (rowHeight === 0) return 1;
    const alreadyLoaded = Math.floor((window.innerHeight - table.offsetTop) / rowHeight) - 1
    const currentPage = Math.ceil(((scrollTop + table.offsetTop) + 1) / ((rowHeight * itemsPerPage) - (alreadyLoaded * rowHeight) ));
    if (currentPage > this.totalPages) return; 
    console.log(currentPage,"219")
  //   if (this.page !== currentPage) {
  //     this.page = currentPage;
  //     this.fetchCarriers();
  // }
  this.addParams(currentPage)
    return currentPage;
}
addParams(currentPage?:any){
  
  let newParams: {
    limit: number;
    page: number;
    fromStartDate?: string;
    toStartDate?: string;
    postalCode?: string;
    impressionType?: string;
    position?: string;
  } = {
    limit: 10,
    page: this.page,
  };
  const queryParams = new URLSearchParams();
    if (currentPage) queryParams.set('page', currentPage.toString());
if (newParams.limit) queryParams.set('limit', newParams.limit.toString());
if (newParams.fromStartDate) queryParams.set('fromDate', newParams.fromStartDate);
if (newParams.toStartDate) queryParams.set('toDate', newParams.toStartDate);
if (newParams.postalCode) queryParams.set('postalCode', newParams.postalCode);
if (newParams.impressionType) queryParams.set('impressionType', newParams.impressionType);
if (newParams.position) queryParams.set('position', newParams.position);
  
  history.replaceState(null, '', `${window.location.pathname}?${queryParams}`);
 }
}
