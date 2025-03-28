import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';

@Component({
  selector: 'app-contact-lead',
  templateUrl: './contact-lead.component.html',
  styleUrls: ['./contact-lead.component.scss']
})
export class ContactLeadComponent implements OnInit {
  totalViews: number = 1000;
  uniqueVisitors: number = 850;
  repeatVisitors: number = 150;
  showAdvancedFilter = false;
  selectedChart: string = 'country';
  errorMessage: string = '';
  loading = false;
  totalRecords: number = 0;
  totalPages: number = 0;
  page=1
  searchControl = new FormControl('');
  carrierContactAnalyticsData:any
  isFilterApplied = false;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  filterForm: FormGroup;
  uniqueUserTypes=[]
  spinner = false;
  showScrollSpinner=false
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
        // selectedUserType: [''],
        postalCode: [''],
        userType: [''],
        position: [''],
        toggleControl: [null as boolean | null]
      });
      if (params && Object.keys(params).length) {
          this.filterForm.patchValue({
              fromDate: params['fromDate'] ? new Date(params['fromDate']) : null,
              toDate: params['toDate'] ? new Date(params['toDate']) : null,
              userType: params['userType'] || '',
              postalCode: params['postalCode'] || '',
          });
          this.cdRef.detectChanges();
        
      }
  })
  this.fetchCarriersContactList()
    this.fetchCarrierProfileAnalitics()
    
  }
fetchCarrierProfileAnalitics(){
  
    let newParams: {} = {};
  

    const usertype = localStorage.getItem('user_type');

// Conditionally set the API key for CARRIER or BROKER
const apiKey = usertype === 'CARRIER' 
  ? AppSettings.APIsNameArray.RECENTVIEW.CARRIERCONTACTANALITICS 
  : usertype === 'BROKER' 
    ? AppSettings.APIsNameArray.RECENTVIEW.BROKERCONTACTANALITICS
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
       console.log(this.carrierContactAnalyticsData,'mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm')
       this.createUserTypeChart()
       this.createCityChart();
       this.createCountryChart();
       console.log(this.carrierContactAnalyticsData.topCountry)
      },
      (error) => {
        this.errorMessage = 'Failed to load recent carriers. Please try again.';
        this.loading = false;
        console.error('Error fetching carriers:', error);
      }
    );
  }}

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
    } = {
      limit: 2,
      page: this.page,
    };
  
    const { fromDate, toDate, userType, postalCode,position, toggleControl } = this.filterForm.value;
  
    if (fromDate) newParams.fromStartDate = this.formatDateForAPI(fromDate);
    if (toDate) newParams.toStartDate = this.formatDateForAPI(toDate);
    if(userType) newParams.userType=userType
    if (postalCode) newParams.postalCode = postalCode;
    // if (location) newParams.location = location;
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


// Replace the current history entry with new params
history.replaceState(null, '', `${window.location.pathname}?${queryParams.toString()}`);
const usertype = localStorage.getItem('user_type');

// Conditionally set the API key for CARRIER or BROKER
const apiKey = usertype === 'CARRIER' 
  ? AppSettings.APIsNameArray.RECENTVIEW.CARRIERCONTACTLIST 
  : usertype === 'BROKER' 
    ? AppSettings.APIsNameArray.RECENTVIEW.BROKERCONTACTLIST
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
  // User dashboard chart
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

   @HostListener('window:scroll', ['$event'])
    onWindowScroll(event: Event) {
      const scrollHeight = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      if (documentHeight - scrollHeight <= 1) {
        console.log(this.totalPages, this.page, "203")
        if (this.page < this.totalPages && !this.spinner && !this.loading){
          console.log(this.totalPages, this.page, "205")
          this.page += 1;
          this.fetchCarriersContactList();
        }
      }
    }
  
  // Profile analytics table
  displayedColumns: string[] = ['name',  'pageSource', 'location', 'platform', 'os', 'browser', 'accessedAt', 'timeSinceAccess'];
  // dataSource = [
  //   { name: 'Jax Logistics LLC',
  //     pageSource: 'Profile View',
  //     location: '82934, Alachua, Florida',
  //     platform: 'fa-desktop',
  //     os: '/assets/images/windows.png',
  //     browser: '/assets/images/chrome.png',
  //     accessedAt: '29 Dec, 2023',
  //     timeSinceAccess: '2 hours ago'
  //   },
  //   { name: 'Guest User',
  //     pageSource: 'Broker list in City',
  //     location: '43232, Columbus, Ohio',
  //     platform: 'fa-tablet',
  //     os: '/assets/images/android.png',
  //     browser: '/assets/images/safari.png',
  //     accessedAt: '29 Dec, 2023',
  //     timeSinceAccess: '2 hours ago'
  //   },
  //   { name: 'Jax Logistics LLC 1',
  //     pageSource: 'Authority Page',
  //     location: '43232, Columbus, Ohio',
  //     platform: 'fa-mobile',
  //     os: '/assets/images/ios.png',
  //     browser: '/assets/images/firefox.png',
  //     accessedAt: '29 Dec, 2023',
  //     timeSinceAccess: '2 hours ago'
  //   },
  //   { name: 'Jax Logistics LLC 1',
  //     pageSource: 'Insurance Page',
  //     location: '43232, Columbus, Ohio',
  //     platform: 'fa-desktop',
  //     os: '/assets/images/macOS.png',
  //     browser: '/assets/images/opera.png',
  //     accessedAt: '29 Dec, 2023',
  //     timeSinceAccess: '2 hours ago'
  //   },
  //   { name: 'Jax Logistics LLC 1',
  //     pageSource: 'Broker list in City',
  //     location: '43232, Columbus, Ohio',
  //     platform: 'fa-mobile',
  //     os: '/assets/images/linux.png',
  //     browser: '/assets/images/other_browser.png',
  //     accessedAt: '29 Dec, 2023',
  //     timeSinceAccess: '2 hours ago'
  //   },
  //   { name: 'Jax Logistics LLC 1',
  //     pageSource: 'Broker list in City',
  //     location: '92807, Anaheim Hills, CA ',
  //     platform: 'fa-desktop',
  //     os: '/assets/images/ubuntu.png',
  //     browser: '/assets/images/chrome.png',
  //     accessedAt: '29 Dec, 2023',
  //     timeSinceAccess: '2 hours ago'
  //   },
  //   { name: 'Jax Logistics LLC 1',
  //     pageSource: 'Authority Page',
  //     location: '96101, Alturas, Califonia',
  //     platform: 'fa-desktop',
  //     os: '/assets/images/other_os.png',
  //     browser: '/assets/images/safari.png',
  //     accessedAt: '09 Oct, 2020',
  //     timeSinceAccess: '2 hours ago'
  //   },    { name: 'Jax Logistics LLC 1',
  //     pageSource: 'Insurance Page',
  //     location: '43232, Columbus, Ohio',
  //     platform: 'fa-mobile',
  //     os: '/assets/images/linux.png',
  //     browser: '/assets/images/other_browser.png',
  //     accessedAt: '29 Dec, 2023',
  //     timeSinceAccess: '2 hours ago'
  //   },
  //   { name: 'Jax Logistics LLC 1',
  //     pageSource: 'Authority Page',
  //     location: '92807, Anaheim Hills, CA ',
  //     platform: 'fa-desktop',
  //     os: '/assets/images/ubuntu.png',
  //     browser: '/assets/images/chrome.png',
  //     accessedAt: '29 Dec, 2023',
  //     timeSinceAccess: '2 hours ago'
  //   },
  //   { name: 'Jax Logistics LLC 1',
  //     pageSource: 'Broker list in City',
  //     location: '96101, Alturas, Califonia',
  //     platform: 'fa-desktop',
  //     os: '/assets/images/other_os.png',
  //     browser: '/assets/images/safari.png',
  //     accessedAt: '09 Oct, 2020',
  //     timeSinceAccess: '2 hours ago'
  //   },
  // ];

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
  toggleFilter() {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }
  UTCDate(date: any) {

    date = new Date(date + ' ' + 'UTC');
    return date;
  }
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
  
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',       // Ensure type is valid
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
  
    return date.toLocaleString('en-GB', options)
      .replace(',', '')       // Remove extra comma after date
      .replace(' ', ', ');    // Add comma after the month
  }
   
  applyFilter() {
    const filterValue = this.searchControl.value.trim().toLowerCase();
console.log(filterValue, this.dataSource.filterPredicate,'llllllllllllllllll')
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.user?.companyName?.toLowerCase().includes(filter);
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
  formatDateForAPI(date: any): string {
    if (!date) return '';
    let d = new Date(date);
    let month = ('0' + (d.getMonth() + 1)).slice(-2); // Ensure 2-digit month
    let day = ('0' + d.getDate()).slice(-2); // Ensure 2-digit day
    let year = d.getFullYear();
    return `${month}/${day}/${year}`; // Format: MM/DD/YYYY
  }

}
