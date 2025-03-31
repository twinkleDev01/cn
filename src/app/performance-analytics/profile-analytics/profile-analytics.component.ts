import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';

@Component({
  selector: 'app-profile-analytics',
  templateUrl: './profile-analytics.component.html',
  styleUrls: ['./profile-analytics.component.scss']
})
export class ProfileAnalyticsComponent implements OnInit {
  totalViews: number = 1000;
  uniqueVisitors: number = 850;
  repeatVisitors: number = 150;
  showAdvancedFilter = false;
  selectedChart: string = 'country';
  errorMessage: string = '';
  loading = false;
  public page=1
  carrierContactAnalyticsData:any
  showScrollSpinner=false
  filterForm: FormGroup;
  uniqueUserTypes=[]
  searchControl = new FormControl('');
   dataSource: MatTableDataSource<any> = new MatTableDataSource();
   totalRecords: number = 0;
  totalPages: number = 0;
  isFilterApplied = false;
  spinner = false;
  subscriptionPlanType: number | null = null;
  // Progress Bar Percentage calculation
  get totalViewsPercentage(): number {
    return 100;
  }
  get uniqueVisitorsPercentage(): number {
    return (this.carrierContactAnalyticsData?.uniqueVisiter / this.carrierContactAnalyticsData?.totalViews) * 100;
  }
  get repeatVisitorsPercentage(): number {
    return (this.carrierContactAnalyticsData?.totalRepeatCount / this.carrierContactAnalyticsData?.totalViews) * 100;
  }
 constructor(
      private fb: FormBuilder,
              private cdRef: ChangeDetectorRef,
              public commonService: CommonService,
              private router: Router,
              private route: ActivatedRoute,
   ) {}

   ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.filterForm = this.fb.group({
        fromDate: [''],
        toDate: [''],
        postalCode: [''],
        userType: [''],
        position: [''],
        location: [''],
        toggleControl: [null as boolean | null]
      });
      if (params && Object.keys(params).length) {
          this.filterForm.patchValue({
              fromDate: params['fromDate'] ? new Date(params['fromDate']) : null,
              toDate: params['toDate'] ? new Date(params['toDate']) : null,
              userType: params['userType'] || '',
              postalCode: params['postalCode'] || '',
              location: params['location'] || ''
          });
          this.cdRef.detectChanges();
        
      }
  });

  this.fetchCarriersContactList()
    this.fetchCarrierProfileAnalitics()
      this.getSubscriptionPlan();
  }
  
 getSubscriptionPlan(): void {
  const plan = localStorage.getItem('subscriptionPlanType');
  this.subscriptionPlanType = plan ? parseInt(plan, 10) : null;
  // this.subscriptionPlanType = 0
  console.log('Subscription Plan Type:', this.subscriptionPlanType);
}
  fetchCarriersContactList(resetData: boolean = false): void {
    this.showScrollSpinner=true
    
    let newParams: {
      limit: number;
      page: number;
      fromStartDate?: string;
      toStartDate?: string;
      userType?: string;
      postalCode?: string;
      isClick?: boolean;
      position?: number;
      location?: string;
    } = {
      limit: 10,
      page: this.page,
    };
  
    const { fromDate, toDate, userType, postalCode,position,location, toggleControl } = this.filterForm.value;
  
    if (fromDate) newParams.fromStartDate = this.formatDateForAPI(fromDate);
    if (toDate) newParams.toStartDate = this.formatDateForAPI(toDate);
    if(userType) newParams.userType=userType
    if (postalCode) newParams.postalCode = postalCode;
    if (location) newParams.location = location;
    if (toggleControl) newParams.isClick = toggleControl;
  if(position)  newParams.position = position

    console.log('Selected Filters:', newParams);
  
   // ✅ Conditionally add parameters only if they have values
const queryParams = new URLSearchParams();
if (this.page) queryParams.set('page', this.page.toString());
if (newParams.limit) queryParams.set('limit', newParams.limit.toString());
if (newParams.fromStartDate) queryParams.set('fromDate', newParams.fromStartDate);
if (newParams.toStartDate) queryParams.set('toDate', newParams.toStartDate);
if (newParams.userType) queryParams.set('userType', newParams.userType);
if (newParams.postalCode) queryParams.set('postalCode', newParams.postalCode);
if (newParams.location) queryParams.set('location', newParams.location);

// Replace the current history entry with new params
history.replaceState(null, '', `${window.location.pathname}?${queryParams.toString()}`);
const usertype = localStorage.getItem('user_type');

// Conditionally set the API key for CARRIER or BROKER
const apiKey = usertype === 'CARRIER' 
  ? AppSettings.APIsNameArray.RECENTVIEW.CARRIERLIST 
  : usertype === 'BROKER' 
    ? AppSettings.APIsNameArray.RECENTVIEW.BROKERLIST
    : null;  // No default fallback

// Only call the API if a valid API key is present
if (apiKey) {
  let APIparams = {
    apiKey: apiKey,
    uri: this.commonService.getAPIUriFromParams(newParams),
  };
    this.commonService.getList(APIparams).subscribe(
      (response) => {
        
        if (response && response.response && response.response.data ) {
          const newData = response.response.data;
          if (resetData) {
            this.dataSource.data = newData;
          
          } else {
            const existingIds = new Set(this.dataSource.data.map(item => item.id));
            const uniqueData = newData.filter(item => !existingIds.has(item.id));
            this.dataSource.data = [...this.dataSource.data, ...uniqueData];
           
          }
          const newUserTypes = newData
          .map(item => item?.userType)
          .filter(userType => userType);  // Filter out falsy values
        
        // Use Set to ensure uniqueness
        this.uniqueUserTypes = Array.from(new Set([...this.uniqueUserTypes, ...newUserTypes]));
          this.showScrollSpinner=false
          console.log(this.dataSource, 'Updated DataSource');
          this.totalPages = response.response.totalPages;
          this.totalRecords = response.response.totalRecords;
          this.loading = false;
          this.cdRef.detectChanges();
        }
      },
      (error) => {
        this.showScrollSpinner=false
        this.errorMessage = 'Failed to load recent carriers. Please try again.';
        this.loading = false;
        console.error('Error fetching carriers:', error);
      }
    );
  }
}
isAdvancedFilterVisible(): boolean {
  return this.subscriptionPlanType === 2 || this.subscriptionPlanType === 3;
}
  fetchCarrierProfileAnalitics(){
  
    let newParams: {} = {};

    const usertype = localStorage.getItem('user_type');

// Conditionally set the API key for CARRIER or BROKER
const apiKey = usertype === 'CARRIER' 
  ? AppSettings.APIsNameArray.RECENTVIEW.CARRIERPROFILEANALYTICS 
  : usertype === 'BROKER' 
    ? AppSettings.APIsNameArray.RECENTVIEW.BROKERPROFILEANALITICS
    : null;  // No default fallback

// Only call the API if a valid API key is present
if (apiKey) {
  let APIparams = {
    apiKey: apiKey,
    uri: this.commonService.getAPIUriFromParams(newParams),
  };
  console.log(APIparams)
    this.commonService.getList(APIparams).subscribe(
      (response) => {
        
       this.carrierContactAnalyticsData=response.response
       this.createUserTypeChart()
       this.createCityChart();
       this.createCountryChart();
      },
      (error) => {
        this.errorMessage = 'Failed to load recent carriers. Please try again.';
        this.loading = false;
        console.error('Error fetching carriers:', error);
      }
    );
  }}

  applyFilter() {
    const filterValue = this.searchControl.value.trim().toLowerCase();
console.log(filterValue, this.dataSource.filterPredicate,'llllllllllllllllll')
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.user?.companyName?.toLowerCase().includes(filter);
    };

    this.dataSource.filter = filterValue;
    this.isFilterApplied = filterValue.length > 0;
  }

  refresh(){
    this.fetchCarriersContactList(true);
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
    this.fetchCarriersContactList(true);
    
  } 

  applyAdvancedFilter() {
    this.isFilterApplied = true;
    this.page = 1;
    this.dataSource.data = [];
    this.fetchCarriersContactList(true);
  }

  getRandomColors(length: number): string[] {
    const colors = [];
    for (let i = 0; i < length; i++) {
      const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      colors.push(color);
    }
    return colors;
  }

  createUserTypeChart() {
    const ctx = document.getElementById('userTypeChartC1') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(this.carrierContactAnalyticsData.topUserType),
        datasets: [{
          data:  Object.values(this.carrierContactAnalyticsData.topUserType),
          backgroundColor: this.getRandomColors((Object.values(this.carrierContactAnalyticsData.topUserType)).length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: window.innerWidth < 576 ? 1 : 1,
        plugins: {
          legend: {
            position: window.innerWidth < 576 ? 'bottom' : 'bottom',
            align: 'center',
            labels: {
              usePointStyle: true,
              pointStyle: 'rect',
              padding: window.innerWidth < 576 ? 12 : window.innerWidth < 768 ? 8 : 14,
              font: {
                size: window.innerWidth < 576 ? 11 : window.innerWidth < 768 ? 12 : 12,
                weight: 'bold'
              },
              boxWidth: window.innerWidth < 576 ? 8 : 12,
              color: '#000',
            }
          },
          tooltip: {
            titleFont: {
              size: window.innerWidth < 576 ? 10 : 12
            },
            bodyFont: {
              size: window.innerWidth < 576 ? 9 : 11
            },
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.raw}%`;
              }
            }
          }
        },
        radius: window.innerWidth < 576 ? '70%' : '100%'
      }
    });
  }

  // Top country chart
  createCountryChart(){
    const ctx = document.getElementById('topCountryChartC1') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(this.carrierContactAnalyticsData.topCountry
        ),
        datasets: [{
          data: Object.values(this.carrierContactAnalyticsData.topCountry
          ),
          backgroundColor:  this.getRandomColors((Object.values(this.carrierContactAnalyticsData.topCountry)).length),
          borderColor: [
          '#ffffff'
          ],
          borderWidth: 1,
          maxBarThickness: 40,
          categoryPercentage: 0.6,
          barPercentage: 0.7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              display: true
            },
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
  createCityChart() {
    const ctxCity = document.getElementById('cityDistributionChartC1') as HTMLCanvasElement;
    new Chart(ctxCity, {
      type: 'bar',
      data: {
        labels:  Object.keys(this.carrierContactAnalyticsData.topCity
        ),
        datasets: [{
          data: Object.values(this.carrierContactAnalyticsData.topCity
          ),
          backgroundColor:  this.getRandomColors((Object.values(this.carrierContactAnalyticsData.topCity)).length),
          borderColor: [
            '#ffffff'
          ],
          borderWidth: 1,
          maxBarThickness: 40,
          categoryPercentage: 0.6,
          barPercentage: 0.7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              display: true
            },
            ticks: {
              font: {
                size: window.innerWidth < 768 ? 10 : 12
              },
              callback: function(value) {
                return value + '%';
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: window.innerWidth < 768 ? 10 : 12
              }
            }
          }
        }
      }
    });
  }
  
  // Profile analytics table
  displayedColumns: string[] = ['name', 'insights', 'pageSource', 'profileRank', 'location', 'platform', 'os', 'browser', 'accessedAt', 'timeSinceAccess'];
  
  
  toggleFilter() {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }
  formatDateForAPI(date: any): string {
    if (!date) return '';
    let d = new Date(date);
    let month = ('0' + (d.getMonth() + 1)).slice(-2); // Ensure 2-digit month
    let day = ('0' + d.getDate()).slice(-2); // Ensure 2-digit day
    let year = d.getFullYear();
    return `${month}/${day}/${year}`; // Format: MM/DD/YYYY
  }

  // UTCDate(date: any) {

  //   date = new Date(date + ' ' + 'UTC');
  //   return date;
  // }
  // formatDate(dateStr: string): string {
  //   const date = new Date(dateStr);
  
  //   const options: Intl.DateTimeFormatOptions = {
  //     day: '2-digit',
  //     month: 'short',
  //     year: 'numeric',       // Ensure type is valid
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     hour12: true
  //   };
  
  //   return date.toLocaleString('en-GB', options)
  //     .replace(',', '')       // Remove extra comma after date
  //     .replace(' ', ', ');    // Add comma after the month
  // }

  // calculateTimeSince(timestamp: string): string {
  //   if (!timestamp) return 'Unknown';
  
  //   const accessedDate = new Date(timestamp);
  //   const now = new Date();
    
  //   let diffMs = now.getTime() - accessedDate.getTime();
  //   let diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  //   if (diffDays < 1) return 'Just now';
  
  //   let months = Math.floor(diffDays / 30);
  //   let days = diffDays % 30;
  
  //   if (months > 0 && days > 0) return `${months} months ${days} days ago`;
  //   if (months > 0) return `${months} months ago`;
  //   return `${days} days ago`;
  // }

  getBrowserImage(uaString: string): string {
    const lowerUA = uaString?.toLowerCase();
  
    if (lowerUA?.includes('google chrome')) {
      return '/assets/images/chrome.png';
    } else if (lowerUA?.includes('safari') && !lowerUA?.includes('chrome')) {
      return '/assets/images/safari.png';   // Safari doesn't include Chrome
    } else if (lowerUA?.includes('firefox')) {
      return '/assets/images/firefox.png';
    } else if (lowerUA?.includes('opera') || lowerUA?.includes('opr')) {
      return '/assets/images/opera.png';
    } else {
      return '/assets/images/other_browser.png';  // Fallback for unknown browsers
    }
  }

  getOSImage(os: string): string {
    switch (os?.toLowerCase()) {
      case 'windows':
        return '/assets/images/windows.png';
      case 'android':
        return '/assets/images/android.png';
      case 'ios':
        return '/assets/images/ios.png';
      case 'macos':
        return '/assets/images/macOS.png';
      case 'linux':
        return '/assets/images/linux.png';
      case 'ubuntu':
        return '/assets/images/ubuntu.png';
      default:
        return '/assets/images/other_os.png'; 
    }
  }
  getDeviceIcon(input: number): string {
    switch (input) {
      case 1:
        return 'fa-desktop';
      case 2:
        return 'fa-tablet';
      case 3:
        return 'fa-mobile';
      default:
        return 'fa-question-circle';  // Fallback icon for invalid input
    }
  }

   @HostListener('window:scroll', ['$event'])
      onWindowScroll(event: Event) {
        const scrollHeight = window.innerHeight + window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        if (documentHeight - scrollHeight <= 1) {
          // if (scrollHeight >= documentHeight - 1) {
          console.log(this.totalPages, this.page, "203")
          if (this.page < this.totalPages && !this.showScrollSpinner){
            console.log(this.totalPages, this.page, "205")
            this.page += 1;
            console.log(this.page, "537")
            this.fetchCarriersContactList();
          }
        }
        this.getCurrentPage();
      }
      getCurrentPage() {
        console.log("📌 Debugging Scroll Behavior");
        
        const tbody = document.querySelector("tbody");
        const table = document.querySelector("table");
        const itemsPerPage = 10;
        
        if (!tbody || !table) return 1; // Ensure elements exist
    
        const scrollTop = window.scrollY; // Corrected scroll position
        const rowHeight = tbody.querySelector("tr")?.clientHeight || 0;
    
        if (rowHeight === 0) return 1; // Avoid division by zero
    
        // Calculate how many rows are visible on the screen
        const alreadyLoaded = Math.floor((window.innerHeight - table.offsetTop) / rowHeight) - 1;
    
        // Calculate current page
        let currentPage = Math.floor((scrollTop + table.offsetTop) / (rowHeight * itemsPerPage - alreadyLoaded * rowHeight));
    
        // Ensure currentPage never goes out of bounds
        currentPage = Math.max(1, Math.min(this.totalPages, currentPage));
    
        console.log({
            scrollTop,
            rowHeight,
            alreadyLoaded,
            calculatedPage: currentPage,
            currentPageBeforeUpdate: this.page,
        });
    
        // ✅ Update the page only if there's an actual change
        if (this.page !== currentPage) {
            this.page = currentPage;
            this.addParams(currentPage);
            this.fetchCarriersContactList();
        }
    
        return currentPage;
    }
    
    addParams(currentPage?:any){
      let newParams: {
        limit: number;
        page: number;
        fromStartDate?: string;
        toStartDate?: string;
        userType?: string;
        postalCode?: string;
        isClick?: boolean;
        position?: number;
        location?: string;
      } = {
        limit: 10,
        page: this.page,
      };
      const queryParams = new URLSearchParams();
if (this.page) queryParams.set('page', this.page.toString());
if (newParams.limit) queryParams.set('limit', newParams.limit.toString());
if (newParams.fromStartDate) queryParams.set('fromDate', newParams.fromStartDate);
if (newParams.toStartDate) queryParams.set('toDate', newParams.toStartDate);
if (newParams.userType) queryParams.set('userType', newParams.userType);
if (newParams.postalCode) queryParams.set('postalCode', newParams.postalCode);
if (newParams.location) queryParams.set('location', newParams.location);

// Replace the current history entry with new params
history.replaceState(null, '', `${window.location.pathname}?${queryParams.toString()}`);
    }
    // Postal case
    onPostalCodeInput(event: Event): void {
      const input = (event.target as HTMLInputElement).value;
      // Allow only digits and trim to 9 characters
      const numericInput = input.replace(/\D/g, '').slice(0, 9);
      this.filterForm.get('postalCode')?.setValue(numericInput, { emitEvent: false });
    }
}
