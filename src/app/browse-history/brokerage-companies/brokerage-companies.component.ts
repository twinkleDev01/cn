import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
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
   loading = false;
   spinner = false;
   public skeletonLoader = false;
   public spinnerLoader = false;
   filterForm: FormGroup;
   uniquePositions:any=[];
   teamIdList :any=[];
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
    this.route.queryParams.subscribe((params) => {
      this.filterForm = this.fb.group({
        fromDate: [''],
        toDate: [''],
        impressionType: [''],
        postalCode: [''],
        position: [''],
        teamIds: [],
        toggleControl:[null as boolean | null]
      });
      if (params && Object.keys(params).length) {
          this.filterForm.patchValue({
              fromDate: params['fromDate'] ? new Date(params['fromDate']) : null,
              toDate: params['toDate'] ? new Date(params['toDate']) : null,
              impressionType : params['impressionType'] || '',
              postalCode: params['postalCode'] || '',
              position:params['position'] || '',
              teamIds: params['teamIds'] || '',
              toggleControl: params['isClick'] === 'true',
          });
          this.cdRef.detectChanges();
         
          this.filterForm?.get("impressionType")?.setValue(params['impressionType']);
          console.log("98", this.filterForm);
          this.filterForm.updateValueAndValidity();
      }
  });console.log(this.filterForm.value)
    this.setupSearchFilter();
    this.getSubscriptionPlan();
    setTimeout(()=>{},100);
    this.fetchBroker();
    this.teamList();
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
       postalCode?: string;
      position?: string;
      teamIds?: string;
       impressionType?: string;
     } = {
       limit: 10,
       page: this.page,
     };
     const { fromDate, toDate, postalCode, position,teamIds,impressionType } = this.filterForm.value;
    //  console.log(fromDate,toDate,114)

     if (fromDate) newParams.fromStartDate =this.formatDateForAPI(fromDate);
     if (toDate) newParams.toStartDate =  this.formatDateForAPI(toDate);
     if (postalCode) newParams.postalCode = postalCode;
     if (position) newParams.position = position;
     if (teamIds) newParams.teamIds = teamIds?.join(',');
     if (impressionType) newParams.impressionType=impressionType;
    //  console.log(fromDate,toDate,121, newParams.toStartDate, newParams.fromStartDate)
const queryParams = new URLSearchParams();
if (this.page) queryParams.set('page', this.page.toString());
if (newParams.limit) queryParams.set('limit', newParams.limit.toString());
if (newParams.fromStartDate) queryParams.set('fromDate', newParams.fromStartDate);
if (newParams.toStartDate) queryParams.set('toDate', newParams.toStartDate);
if (newParams.postalCode) queryParams.set('postalCode', newParams.postalCode);
if (newParams.impressionType) queryParams.set('impressionType', newParams.impressionType);
if (newParams.position) queryParams.set('position', newParams.position);
if (newParams.teamIds) queryParams.set('teamIds', newParams.teamIds);
console.log(queryParams,131)
history.replaceState(null, '', `${window.location.pathname}?${queryParams}`);
     let APIparams = {
       apiKey: AppSettings.APIsNameArray.RECENTVIEW.BROKERVIEW,
       uri: this.commonService.getAPIUriFromParams(newParams),
     };
     console.log(APIparams,"123")
     this.loaddedScreens = this.page;
     this.commonService.getList(APIparams).subscribe(
       (response) => {
        console.log(response,"140")
         if (response && response.response) {
          //  const newData = response.response;
          const newData = response.response.map((item:any)=>({
            ...item,
            createdAt: this.formatDate(item.createdAt),
          }));
           this.noDataFound = newData.length === 0;
           if (resetData) {
             this.dataSource.data = newData;
           } else {
            const existingIds = new Set(this.dataSource.data.map(item => item.id));
            const uniqueData = newData.filter(item => !existingIds.has(item.id));
            this.dataSource.data = [...this.dataSource.data, ...uniqueData];
           }
         
           console.log(this.dataSource, 'Updated DataSource');
           this.totalPages = response.totalPages;
           this.totalRecords = response.totalRecords;
           this.loading = false;
           this.spinnerLoader = false;
           this.skeletonLoader = false;
           this.cdRef.detectChanges();
         }else{
          this.noDataFound = true;
         }
       },
       (error) => {
        this.spinnerLoader = false;
        this.loaddedScreens--;
        this.noDataFound = true;
         this.errorMessage = 'Failed to load recent carriers. Please try again.';
         console.error('Error fetching carriers:', error);
       }
     );
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
  //  @HostListener('window:scroll', ['$event'])
  //  onWindowScroll(event: Event) {
  //    const scrollHeight = window.innerHeight + window.scrollY;
  //    const documentHeight = document.documentElement.scrollHeight;
  //    if (documentHeight - scrollHeight <= 1) {
  //      if (this.page < this.totalPages && !this.spinnerLoader){
  //        this.page += 1;
  //        this.fetchBroker();
  //       }
  //     }
  //     this.getCurrentPage();
  //  }
   
  // getCurrentPage() {
  //     const tbody = document.querySelector("tbody");
  //     const table = document.querySelector("table")
  //     const itemsPerPage = 10; 
  //     const scrollTop = $(window).scrollTop(); 
  //     const rowHeight = tbody.querySelector("tr")?.clientHeight || 0;
  //     if (rowHeight === 0) return 1;
  //     const alreadyLoaded = Math.floor((window.innerHeight - table.offsetTop) / rowHeight) - 1
  //     const currentPage = Math.ceil(((scrollTop + table.offsetTop) + 1) / ((rowHeight * itemsPerPage) - (alreadyLoaded * rowHeight) ));
  //     console.log(currentPage,"204")
  //     this.addParams(currentPage)
  //     return currentPage;
  // }
  loaddedScreens = 0;
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const scrollHeight = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    if ((documentHeight - scrollHeight) <= 1) {
      if (this.page <= this.totalPages && !this.spinnerLoader) {
        if(this.page <= this.loaddedScreens)
          this.page += 1;
        if((this.totalPages >= this.page) && (this.loaddedScreens < this.page))
        this.fetchBroker();
      }
    }
    this.getCurrentPage();
  }
  
  getCurrentPage() {
    console.log('📌 Debugging Scroll Behavior');

    const tbody = document.querySelector('tbody');
    const table = document.querySelector('table');
    const itemsPerPage = 10;

    if (!tbody || !table) return 1; // Ensure elements exist

    const scrollTop = window.scrollY; // Corrected scroll position
    const rowHeight = tbody.querySelector('tr')?.clientHeight || 0;

    if (rowHeight === 0) return 1; // Avoid division by zero

    // Calculate how many rows are visible on the screen
    const alreadyLoaded =
      Math.floor((window.innerHeight - table.offsetTop) / rowHeight) - 1;

    // Calculate current page
    let currentPage = Math.floor(
      (scrollTop + table.offsetTop) /
        (rowHeight * itemsPerPage - alreadyLoaded * rowHeight)
    );
    // Ensure currentPage never goes out of bounds
    currentPage = Math.max(1, Math.min(this.totalPages, currentPage)) || 1;
    console.log('CurrentPage: ' + this.page);
    // ✅ Update the page only if there's an actual change
    if (this.page !== currentPage) {
      this.page = currentPage;
      this.addParams(currentPage);
      // this.fetchCarriersContactList();
    }

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
    teamIds?: string;
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
if (newParams.teamIds) queryParams.set('teamIds', newParams.teamIds);

  history.replaceState(null, '', `${window.location.pathname}?${queryParams}`);
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
  
      return (companyName && companyName.includes(filter))
    };
  
    this.dataSource.filter = filterValue;
    this.isFilterApplied = filterValue.length > 0;
  }
   
   toggleFilter() {
     this.showAdvancedFilter = !this.showAdvancedFilter;
   }
   applyAdvancedFilter() {
    console.log(this.filterForm.get('teamIds').value,"335")
    this.showAdvancedFilter = false;
     this.isFilterApplied = true;
     this.page = 1;
     this.dataSource.data = [];
     this.fetchBroker(true);
   }
 
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
  onPostalCodeInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    // Allow only digits and trim to 9 characters
    const numericInput = input.replace(/\D/g, '').slice(0, 9);
    this.filterForm.get('postalCode')?.setValue(numericInput, { emitEvent: false });
  }
  onteamIdsInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    // Allow only digits and trim to 9 characters
    const numericInput = input.replace(/\D/g, '').slice(0, 9);
    this.filterForm.get('teamIds')?.setValue(numericInput, { emitEvent: false });
  }
  // TEamList
//   teamList(resetData: boolean = false): void {
     
//     this.spinnerLoader=true
//     let newParams: {
//       limit: number;
//       page: number;
//     } = {
//       limit: 8,
//       page: this.page,
//     };
  

// const queryParams = new URLSearchParams();
// if (this.page) queryParams.set('page', this.page.toString());
// if (newParams.limit) queryParams.set('limit', newParams.limit.toString());
// history.replaceState(null, '', `${window.location.pathname}?${queryParams}`);
// const apiKey = AppSettings.APIsNameArray.TEAM.TEAMLIST

// if (apiKey) {
//   let APIparams = {
//     apiKey: apiKey,
//     uri: this.commonService.getAPIUriFromParams(newParams),
//   };
//     this.commonService.getList(APIparams).subscribe(
//       (response) => {
//         this.spinnerLoader=false
//         console.log(response, "394");
//         if (response && response.response && response.response.teamArray ) {
//               this.teamIdList = response.response.teamArray; 
//         }
//       },
//       (error) => {
//         this.spinnerLoader=false
//         console.error('Error fetching carriers:', error);
//       }
//     );
//   }}
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
