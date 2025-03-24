import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CarrierView } from 'src/app/commons/interface/browse-history';
import { CommonService } from 'src/app/commons/service/common.service';
import { SharedService } from 'src/app/commons/service/shared.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trucking-companies',
  templateUrl: './trucking-companies.component.html',
  styleUrls: ['./trucking-companies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TruckingCompaniesComponent implements OnInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  showAdvancedFilter = false;
  errorMessage: string = '';
  displayedColumns: string[] = [
    'companyName',
    'pageSource',
    'profileRank',
    'location',
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
  uniquePositions:any=[]

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    public commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      selectedUserType: [''],
      postalCode: [''],
      location: [''],
      position: [''],
      toggleControl: [null as boolean | null]
    });
  }

  ngOnInit(): void {
    console.log("aaa")
    // this.fetchCarriers();
    this.route.queryParams.subscribe((params) => {
      if (params && Object.keys(params).length) {
          this.filterForm.patchValue({
              fromDate: params['fromDate'] ? new Date(params['fromDate']) : null,
              toDate: params['toDate'] ? new Date(params['toDate']) : null,
              selectedUserType: params['userType'] || '',
              postalCode: params['postalCode'] || '',
              location: params['location'] || '',
              toggleControl: params['isClick'] === 'true'
          });
          this.cdRef.detectChanges();
          this.fetchCarriers(false);
      }else{
        this.fetchCarriers(false);
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

  // fetchCarriers(resetData: boolean = false): void {
  //   this.spinnerLoader = true;
  //   let newParams: {
  //     limit: number;
  //     page: number;
  //     fromStartDate?: string;
  //     toStartDate?: string;
  //     userType?: string;
  //     postalCode?: string;
  //     location?: string;
  //     position?:number;
  //     isClick?:boolean
  //   } = {
  //     limit: 8,
  //     page: this.page,
  //   };

  //   const { fromDate, toDate, selectedUserType, postalCode, location, position, toggleControl } = this.filterForm.value;

  //   if (fromDate) newParams.fromStartDate =this.formatDateForAPI(fromDate);
  //   if (toDate) newParams.toStartDate = this.formatDateForAPI(toDate);
  //   if (selectedUserType)
  //     newParams.userType = selectedUserType?.toString()?.toUpperCase();
  //   if (postalCode) newParams.postalCode = postalCode;
  //   if (location) newParams.location = location;
  //   if (position) newParams.position = position;
  //   if (toggleControl) newParams.isClick=toggleControl;
  //   console.log('Selected Filters:');
  //   console.log('From Date:', fromDate);
  //   console.log('To Date:', toDate);
  //   console.log('postal', newParams.location, position,  newParams.position );
  //   console.log('Toggle', newParams.isClick,toggleControl);

  //   let APIparams = {
  //     apiKey: AppSettings.APIsNameArray.RECENTVIEW.CARRIERRECETVIEW,
  //     uri: this.commonService.getAPIUriFromParams(newParams),
  //   };
  //   console.log(APIparams,"123")
  //   this.commonService.getList(APIparams).subscribe(
  //     (response) => {
  //       if (response && response.response && response.response.data) {
  //         const newData = response.response.data;
  //         if (resetData) {
  //           this.dataSource.data = newData;
  //         } else {
  //           this.dataSource.data = [...this.dataSource.data, ...newData];
  //         }
  //         // this.dataSource.data = [...this.dataSource.data, ...newData];
  //         console.log(this.dataSource, 'Updated DataSource');
  //         this.totalPages = response.response.totalPages;
  //         this.totalRecords = response.response.totalRecords;
  //         this.loading = false;
  //         this.skeletonLoader = false;
  //         this.cdRef.detectChanges();
  //       }
  //     },
  //     (error) => {
  //       this.errorMessage = 'Failed to load recent carriers. Please try again.';
  //       this.loading = false;
  //       console.error('Error fetching carriers:', error);
  //     }
  //   );
  // }
  fetchCarriers(resetData: boolean = false): void {
    this.spinnerLoader = true;
    
    let newParams: {
      limit: number;
      page: number;
      fromStartDate?: string;
      toStartDate?: string;
      userType?: string;
      postalCode?: string;
      location?: string;
      isClick?: boolean;
    } = {
      limit: 8,
      page: this.page,
    };
  
    const { fromDate, toDate, selectedUserType, postalCode, location, toggleControl } = this.filterForm.value;
  
    if (fromDate) newParams.fromStartDate = this.formatDateForAPI(fromDate);
    if (toDate) newParams.toStartDate = this.formatDateForAPI(toDate);
    if (selectedUserType) newParams.userType = selectedUserType?.toString()?.toUpperCase();
    if (postalCode) newParams.postalCode = postalCode;
    if (location) newParams.location = location;
    if (toggleControl) newParams.isClick = toggleControl;
  
    console.log('Selected Filters:', newParams);
  
    // ✅ Update route with query parameters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        fromDate: newParams.fromStartDate || null,
        toDate: newParams.toStartDate || null,
        userType: newParams.userType || null,
        postalCode: newParams.postalCode || null,
        location: newParams.location || null,
        isClick: newParams.isClick || null,
        page: this.page,
        limit: newParams.limit
      },
      queryParamsHandling: 'merge', // Merge with existing query params
    });
  
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.RECENTVIEW.CARRIERRECETVIEW,
      uri: this.commonService.getAPIUriFromParams(newParams),
    };
  
    this.commonService.getList(APIparams).subscribe(
      (response) => {
        if (response && response.response && response.response.data) {
          const newData = response.response.data;
          this.uniquePositions = [...new Set(newData.map(item => item.position))];
          this.cdRef.detectChanges();
          if (resetData) {
            this.dataSource.data = newData;
          } else {
            this.dataSource.data = [...this.dataSource.data, ...newData];
          }
  
          console.log(this.dataSource, 'Updated DataSource');
          this.totalPages = response.response.totalPages;
          this.totalRecords = response.response.totalRecords;
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
  resetFilters(): void {
    console.log('Reset Filters Clicked');
    this.showAdvancedFilter = false;
    this.searchControl.setValue('');
    this.isFilterApplied = false;
    this.dataSource.filter = '';
    this.page = 1;
    this.dataSource.data = [];
    this.filterForm.reset();
    this.fetchCarriers();
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const scrollHeight = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    if (documentHeight - scrollHeight <= 1) {
      if (this.page < this.totalPages && !this.spinner) {
        this.page += 1;
        this.fetchCarriers();
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
      return data.user?.companyName?.toLowerCase().includes(filter);
    };

    this.dataSource.filter = filterValue;
    this.isFilterApplied = filterValue.length > 0;
  }

  // calculateTimeSince(timestamp: string): string {
  //   if (!timestamp) return 'Unknown';

  //   const accessedDate = new Date(timestamp);
  //   const now = new Date();
  //   const diffMs = now.getTime() - accessedDate.getTime();
  //   const diffMins = Math.floor(diffMs / 60000);
  //   const diffHours = Math.floor(diffMins / 60);
  //   const diffDays = Math.floor(diffHours / 24);

  //   if (diffDays > 0) return `${diffDays} days ago`;
  //   if (diffHours > 0) return `${diffHours} hours ago`;
  //   if (diffMins > 0) return `${diffMins} minutes ago`;
  //   return 'Just now';
  // }
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
    this.fetchCarriers(true);
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
