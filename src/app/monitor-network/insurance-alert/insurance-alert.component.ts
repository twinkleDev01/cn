import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
     searchControl = new FormControl('');
     isFilterApplied = false;
  dateRanges = [
    { label: 'Created', start: 'createdStart', end: 'createdEnd', picker: 'picker1' },
    { label: 'Last Email Sent At', start: 'emailStart', end: 'emailEnd', picker: 'picker2' },
    { label: 'Updated', start: 'updatedStart', end: 'updatedEnd', picker: 'picker3' },
    { label: 'Expire', start: 'expireStart', end: 'expireEnd', picker: 'picker4' }
  ];
  totalPages: number = 0;
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
      expireEnd: ['']
    });
   }

  ngOnInit(): void {
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

  setupSearchFilter() {
  this.searchControl.valueChanges.subscribe(() => {
    this.applyFilter();
  });
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
