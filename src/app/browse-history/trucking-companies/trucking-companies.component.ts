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
  subscriptionPlanType: number | null = null;
  isFilterApplied = false;
  // selectedUserType: string | null = null;
  loading = false;
  spinner = false;
  public skeletonLoader = false;
  public spinnerLoader = false;
  filterForm: FormGroup;
  uniquePositions:any=[];
  private previousScrollY: number = 0;
  public noDataFound: boolean = false;


  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    public commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    
  }

  ngOnInit(): void {
    console.log("aaa")
    
    this.route.queryParams.subscribe((params) => {
      this.filterForm = this.fb.group({
        fromDate: [''],
        toDate: [''],
        postalCode: [''],
        impressionType: [''],
        position: [''],
        toggleControl: [null as boolean | null]
      });
      if (params && Object.keys(params).length) {
        console.log(params,"89");
          this.filterForm.patchValue({
              fromDate: params['fromDate'] ? new Date(params['fromDate']) : null,
              toDate: params['toDate'] ? new Date(params['toDate']) : null,
              impressionType: params['impressionType'] || '',
              postalCode: params['postalCode'] || '',
              toggleControl: params['isClick'] === 'true',
              position: params['position'] || null
          });
          this.filterForm?.get("impressionType")?.setValue(params['impressionType']);
          console.log("98", this.filterForm);
          this.filterForm.updateValueAndValidity();
      }else{

      }
  });console.log(this.filterForm.value)
    this.setupSearchFilter();
    this.getSubscriptionPlan();
    setTimeout(()=>{},100);
    this.fetchCarriers();
  }
  getSubscriptionPlan(): void {
    const plan = localStorage.getItem('subscriptionPlanType');
    this.subscriptionPlanType = plan ? parseInt(plan, 10) : null;
    console.log('Subscription Plan Type:', this.subscriptionPlanType);
  }
  isAdvancedFilterVisible(): boolean {
    return this.subscriptionPlanType === 2 || this.subscriptionPlanType === 3;
  }
  fetchCarriers(resetData: boolean = false): void {
    this.spinnerLoader = true;
    
    let newParams: {
      limit: number;
      page: number;
      fromStartDate?: string;
      toStartDate?: string;
      userType?: string;
      postalCode?: string;
      impressionType?: string;
      isClick?: boolean;
      position?: string;
    } = {
      limit: 10,
      page: this.page,
    };
  
    const { fromDate, toDate, impressionType, postalCode,position, toggleControl } = this.filterForm.value;
  
    if (fromDate) newParams.fromStartDate = this.formatDateForAPI(fromDate);
    if (toDate) newParams.toStartDate = this.formatDateForAPI(toDate);
    if(impressionType) newParams.impressionType=impressionType
    if (postalCode) newParams.postalCode = postalCode;
    if (toggleControl) newParams.isClick = toggleControl;
  if(position)  newParams.position = position

    console.log('Selected Filters:', newParams);
  
    const queryParams = new URLSearchParams();
      if (this.page) queryParams.set('page', this.page.toString());
if (newParams.limit) queryParams.set('limit', newParams.limit.toString());
if (newParams.fromStartDate) queryParams.set('fromDate', newParams.fromStartDate);
if (newParams.toStartDate) queryParams.set('toDate', newParams.toStartDate);
if (newParams.userType) queryParams.set('userType', newParams.userType);
if (newParams.postalCode) queryParams.set('postalCode', newParams.postalCode);
if (newParams.impressionType) queryParams.set('impressionType', newParams.impressionType);
if (newParams.position) queryParams.set('position', newParams.position);
    
    history.replaceState(null, '', `${window.location.pathname}?${queryParams}`);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.RECENTVIEW.CARRIERRECETVIEW,
      uri: this.commonService.getAPIUriFromParams(newParams),
    };
  console.log(APIparams)
    this.commonService.getList(APIparams).subscribe(
      (response) => {
        console.log(response,'mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm')
        if (response && response.response ) {
          const newData = response.response;
          this.noDataFound = newData.length === 0;
          if (resetData) {
            this.dataSource.data = newData;
          } else {
            const existingIds = new Set(this.dataSource.data.map(item => item.id));
            const uniqueData = newData.filter(item => !existingIds.has(item.id));
            this.dataSource.data = [...this.dataSource.data, ...uniqueData];
          }
  
          console.log(this.dataSource, 'Updated DataSource');
          this.spinnerLoader = false;
          this.totalPages = response.totalPages;
          this.totalRecords = response.totalRecords;
          this.loading = false;
          this.skeletonLoader = false;
          this.cdRef.detectChanges();
        }else{
          this.noDataFound = true;
        }
      },
      (error) => {
        this.spinnerLoader = false;
        this.noDataFound = true;
        this.errorMessage = 'Failed to load recent carriers. Please try again.';
        console.error('Error fetching carriers:', error);
      }
    );
  }
  refresh(){
    this.fetchCarriers(true);
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
    this.fetchCarriers(true);
    
  } 

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const scrollHeight = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    if (documentHeight - scrollHeight <= 1) {
      console.log(this.totalPages, this.page, "203")
      if (this.page < this.totalPages && !this.spinnerLoader){
        console.log(this.totalPages, this.page, "205")
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
      return data.carrier?.companyName?.toLowerCase().includes(filter);
    };

    this.dataSource.filter = filterValue;
    this.isFilterApplied = filterValue.length > 0;
  }
//   calculateTimeSince(timestamp: string): string {
//     if (!timestamp) return 'Unknown';

//     const accessedDate = new Date(timestamp);
//     const now = new Date();

//     let diffMs = now.getTime() - accessedDate.getTime(); // Difference in milliseconds
//     let diffSeconds = Math.floor(diffMs / 1000);
//     let diffMinutes = Math.floor(diffSeconds / 60);
//     let diffHours = Math.floor(diffMinutes / 60);
//     let diffDays = Math.floor(diffHours / 24);
  
//     if (diffSeconds < 60) return 'Just now';
//     if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
//     if (diffHours < 24) return `${diffHours} hours ago`;
    
//     let months = Math.floor(diffDays / 30);
//     let days = diffDays % 30;

//     if (months > 0 && days > 0) return `${months} months ${days} days ago`;
//     if (months > 0) return `${months} months ago`;
//     return `${diffDays} days ago`;
// }

  toggleFilter() {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }
  applyAdvancedFilter() {
    this.isFilterApplied = true;
    this.page = 1;
    this.dataSource.data = [];
    this.fetchCarriers(true);
  }

  // UTCDate(date: any) {
  //   date = new Date(date + ' ' + 'UTC');
  //   return date;
  // }
  formatDateForAPI(date: any): string {
    if (!date) return '';
    let d = new Date(date);
    let month = ('0' + (d.getMonth() + 1)).slice(-2); 
    let day = ('0' + d.getDate()).slice(-2); 
    let year = d.getFullYear();
    return `${month}/${day}/${year}`; 
  }

  formatCompanyName(name: string): string {
    return name ? name.replace(/\s+/g, '-') : '';
  }
}
