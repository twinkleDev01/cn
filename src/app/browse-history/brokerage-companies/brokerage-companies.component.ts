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
        toggleControl:[null as boolean | null]
      });
      if (params && Object.keys(params).length) {
          this.filterForm.patchValue({
              fromDate: params['fromDate'] ? new Date(params['fromDate']) : null,
              toDate: params['toDate'] ? new Date(params['toDate']) : null,
              impressionType : params['impressionType'] || '',
              postalCode: params['postalCode'] || '',
              position:params['position'] || '',
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
       impressionType?: string;
     } = {
       limit: 10,
       page: this.page,
     };
     const { fromDate, toDate, postalCode, position, impressionType } = this.filterForm.value;
     console.log(fromDate,toDate,114)

     if (fromDate) newParams.fromStartDate =this.formatDateForAPI(fromDate);
     if (toDate) newParams.toStartDate =  this.formatDateForAPI(toDate);
     if (postalCode) newParams.postalCode = postalCode;
     if (position) newParams.position = position;
     if (impressionType) newParams.impressionType=impressionType;
     console.log(fromDate,toDate,121, newParams.toStartDate, newParams.fromStartDate)
const queryParams = new URLSearchParams();
if (this.page) queryParams.set('page', this.page.toString());
if (newParams.limit) queryParams.set('limit', newParams.limit.toString());
if (newParams.fromStartDate) queryParams.set('fromDate', newParams.fromStartDate);
if (newParams.toStartDate) queryParams.set('toDate', newParams.toStartDate);
if (newParams.postalCode) queryParams.set('postalCode', newParams.postalCode);
if (newParams.impressionType) queryParams.set('impressionType', newParams.impressionType);
if (newParams.position) queryParams.set('position', newParams.position);
console.log(queryParams,131)
history.replaceState(null, '', `${window.location.pathname}?${queryParams}`);
     let APIparams = {
       apiKey: AppSettings.APIsNameArray.RECENTVIEW.BROKERVIEW,
       uri: this.commonService.getAPIUriFromParams(newParams),
     };
     console.log(APIparams,"123")
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
        this.noDataFound = true;
         this.errorMessage = 'Failed to load recent carriers. Please try again.';
         this.loading = false;
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
   @HostListener('window:scroll', ['$event'])
   onWindowScroll(event: Event) {
     const scrollHeight = window.innerHeight + window.scrollY;
     const documentHeight = document.documentElement.scrollHeight;
     if (documentHeight - scrollHeight <= 1) {
       if (this.page < this.totalPages && !this.spinnerLoader){
         this.page += 1;
         this.fetchBroker();
        }
      }
      this.getCurrentPage();
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
      console.log(currentPage,"204")
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
}
