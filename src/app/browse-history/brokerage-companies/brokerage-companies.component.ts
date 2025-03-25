import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CarrierView } from 'src/app/commons/interface/browse-history';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-brokerage-companies',
  templateUrl: './brokerage-companies.component.html',
  styleUrls: ['./brokerage-companies.component.scss']
})
export class BrokerageCompaniesComponent implements OnInit {
 @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
   showAdvancedFilter = false;
   errorMessage: string = '';
   displayedColumns: string[] = [
     'companyName',
     'pageSource',
     'profileRank',
    //  'location',
     'accessedAt',
     'timeSinceAccess',
     'rowAction',
   ];
   dataSource: MatTableDataSource<CarrierView> = new MatTableDataSource();
   public page = 1;
   carriers: CarrierView[] = [];
   totalRecords: number = 0;
   totalPages: number = 0;
   searchControl = new FormControl('');
   apiUrl = environment.apiUrl;
   subscriptionPlanType: number | null = null;
   isFilterApplied = false;
   fromDate: string | null = null;
   toDate: string | null = null;
   selectedUserType: string | null = null;
   loading = false;
   spinner = false;
   public skeletonLoader = false;
   public spinnerLoader = false;
   filterForm: FormGroup;
 
    constructor(
      private fb: FormBuilder,
      private cdRef: ChangeDetectorRef,
      public commonService: CommonService,
          private router: Router,
          private route: ActivatedRoute,
    ) {
    }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.filterForm = this.fb.group({
        fromDate: [''],
        toDate: [''],
        impressionType: [''],
        postalCode: [''],
        position: [''],
      });
      if (params && Object.keys(params).length) {
          this.filterForm.patchValue({
              fromDate: params['fromDate'] ? new Date(params['fromDate']) : null,
              toDate: params['toDate'] ? new Date(params['toDate']) : null,
              impressionType : params['impressionType'] || '',
              postalCode: params['postalCode'] || '',
              position:params['position'] || '',
          });
          this.cdRef.detectChanges();
          this.fetchBroker(false);
      }else{
        this.fetchBroker(true);
      }
  });console.log(this.filterForm.value)
    this.setupSearchFilter();
    this.getSubscriptionPlan();
  }

 getSubscriptionPlan(): void {
     const plan = localStorage.getItem('subscriptionPlanType');
     this.subscriptionPlanType = plan ? parseInt(plan, 10) : null;
     // this.subscriptionPlanType = 0
     console.log('Subscription Plan Type:', this.subscriptionPlanType);
   }
   isAdvancedFilterVisible(): boolean {
     return this.subscriptionPlanType === 2 || this.subscriptionPlanType === 3;
   }
 
   fetchBroker(resetData: boolean = false): void {
     this.spinnerLoader = true;
     let newParams: {
       limit: number;
       page: number;
       fromStartDate?: string;
       toStartDate?: string;
       postalCode?: number;
       position?: number;
       impressionType?: string;
     } = {
       limit: 8,
       page: this.page,
     };
 
     const { fromDate, toDate, postalCode, position, impressionType } = this.filterForm.value;

     if (fromDate) newParams.fromStartDate =this.fromDate;
     if (toDate) newParams.toStartDate = this.toDate;
     if (postalCode) newParams.postalCode = postalCode;
     if (position) newParams.position = position;
     if (impressionType) newParams.impressionType=impressionType;
     console.log('Selected Filters:');
     console.log('postalCode', postalCode)
     console.log('From Date:', fromDate);
     console.log('To Date:', toDate);
     console.log('Impressiontype', newParams.impressionType,impressionType);
 // ✅ Update route with query parameters
 this.router.navigate([], {
  relativeTo: this.route,
  queryParams: {
    fromDate: newParams.fromStartDate || null,
    toDate: newParams.toStartDate || null,
    postalCode: newParams.postalCode || null,
    page: this.page,
    limit: newParams.limit,
    impressionType: newParams.impressionType 
  },
  queryParamsHandling: 'merge', // Merge with existing query params
});
     let APIparams = {
       apiKey: AppSettings.APIsNameArray.RECENTVIEW.BROKERVIEW,
       uri: this.commonService.getAPIUriFromParams(newParams),
     };
     console.log(APIparams,"123")
     this.commonService.getList(APIparams).subscribe(
       (response) => {
         if (response && response.response) {
           const newData = response.response;
           if (resetData) {
             this.dataSource.data = newData;
           } else {
            //  this.dataSource.data = [...this.dataSource.data, ...newData];
            const existingIds = new Set(this.dataSource.data.map(item => item.id));
            const uniqueData = newData.filter(item => !existingIds.has(item.id));
            this.dataSource.data = [...this.dataSource.data, ...uniqueData];
           }
         
           console.log(this.dataSource, 'Updated DataSource');
           this.totalPages = response.totalPages;
           this.totalRecords = response.totalRecords;
           this.loading = false;
           this.skeletonLoader = false;
           this.cdRef.detectChanges();
         }
       },
       (error) => {
         this.errorMessage = 'Failed to load recent carriers. Please try again.';
         this.loading = false;
         console.error('Error fetching carriers:', error);
       }
     );
   }
   refresh(){
    this.fetchBroker(true);
  }
  resetFilters(): void {
    console.log('Reset Filters Clicked');
    this.showAdvancedFilter = false;
    this.searchControl.setValue('');
    this.isFilterApplied = false;
    this.dataSource.filter = '';
    this.page = 1;
    this.dataSource.data = [];
    this.filterForm.reset();
    this.fetchBroker(true);
    
  } 
   @HostListener('window:scroll', ['$event'])
   onWindowScroll(event: Event) {
     const scrollHeight = window.innerHeight + window.scrollY;
     const documentHeight = document.documentElement.scrollHeight;
     if (documentHeight - scrollHeight <= 1) {
       if (this.page < this.totalPages && !this.spinner  && !this.loading) {
         this.page += 1;
         this.fetchBroker();
       }
     }
   }
 
   setupSearchFilter() {
     this.searchControl.valueChanges.subscribe(() => {
       this.applyFilter();
     });
   }

  applyFilter() {
    const filterValue = this.searchControl.value.trim().toLowerCase();
  
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const companyName = data.broker?.companyName?.toLowerCase();
      const title = data.title?.toLowerCase();
  
      return (companyName && companyName.includes(filter)) || (title && title.includes(filter));
    };
  
    this.dataSource.filter = filterValue;
    this.isFilterApplied = filterValue.length > 0;
  }
  
 
  calculateTimeSince(timestamp: string): string {
    if (!timestamp) return 'Unknown';
  
    const accessedDate = new Date(timestamp);
    const now = new Date();
    
    let diffMs = now.getTime() - accessedDate.getTime();
    let diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
    if (diffDays < 1) return 'Just now';
  
    let months = Math.floor(diffDays / 30);
    let days = diffDays % 30;
  
    if (months > 0 && days > 0) return `${months} months ${days} days ago`;
    if (months > 0) return `${months} months ago`;
    return `${days} days ago`;
  }
  
 
   toggleFilter() {
     this.showAdvancedFilter = !this.showAdvancedFilter;
   }
   applyAdvancedFilter() {
     this.isFilterApplied = true;
     this.page = 1;
     this.dataSource.data = [];
     this.fetchBroker(true);
   }
 
   UTCDate(date: any) {
     date = new Date(date + ' ' + 'UTC');
     return date;
   }
   formatDateForAPI(date: any): string {
     if (!date) return '';
     let d = new Date(date);
     let month = ('0' + (d.getMonth() + 1)).slice(-2); // Ensure 2-digit month
     let day = ('0' + d.getDate()).slice(-2); // Ensure 2-digit day
     let year = d.getFullYear();
     return `${month}/${day}/${year}`; // Format: MM/DD/YYYY
   }
    
}
