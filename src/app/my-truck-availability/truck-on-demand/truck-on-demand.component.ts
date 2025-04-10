import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';

@Component({
  selector: 'app-truck-on-demand',
  templateUrl: './truck-on-demand.component.html',
  styleUrls: ['./truck-on-demand.component.scss'],
})
export class TruckOnDemandComponent implements OnInit {
  loadAvailibilityData: any = [];
  message: any;
  public page = 1;
  // public totalPage = 1;
  totalRecords: number;
  public spinnerLoader = false;
  public dataNotFound = false;
  public params: any = {};
  public orderDir = '';
  showAdvancedFilter = false;
  subscriptionPlanType: number | null = null;
  teamIdList: any = [];
  isFilterApplied = false;
  searchControl = new FormControl('');
  countryName = ''; // This will be set dynamically from API
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  advanceFilterForm: FormGroup;
  loaddedScreens = 0;
  totalPages: number = 0;
  usertype: any;
  equipmentTypesList = [];
  shipmentTypesList = [];

  countryList = [
    {
      value: 'US',
      name: 'United States',
      flag: './assets/country/us.png',
      code: '+1',
    },
    {
      value: 'MX',
      name: 'Mexico',
      flag: './assets/country/mx.png',
      code: '+52',
    },
    {
      value: 'CA',
      name: 'Canada',
      flag: './assets/country/ca.png',
      code: '+1',
    },
  ];
  configurationData: any;
  public destroy$ = new Subject();
  constructor(
    private commonService: CommonService,
    public dialog: MatDialog,
    public alertService: AlertService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usertype = localStorage.getItem('user_type');
    this.route.queryParams.subscribe((params) => {
      this.advanceFilterForm = this.fb.group({
        shipmentTypes: [''],
        equipmentType: [''],
        frequency: [''],
        sourceDate: [''],
        destinationDate: [''],
        length: [''],
        weight: [''],
        miles: [''],
        costPerMile: [''],
        destinationLocation: [''],
        sourceLocation: [''],
        carrierId: [''],
        userId: [''],
        teamIds: [],
      });
      if (params && Object.keys(params).length) {
        this.advanceFilterForm.patchValue({
          sourceDate: params['sourceDate']
            ? new Date(params['sourceDate'])
            : null,
          destinationDate: params['destinationDate']
            ? new Date(params['destinationDate'])
            : null,
          shipmentTypes: params['shipmentTypes'] || '',
          equipmentType: params['equipmentType'] || '',
          frequency: params['frequency'] || '',
          length: params['length'] || '',
          weight: params['weight'] || '',
          miles: params['miles'] || '',
          costPerMile: params['costPerMile'] || '',
          destinationLocation: params['destinationLocation'] || '',
          sourceLocation: params['sourceLocation'] || '',
          carrierId: params['carrierId'] || '',
          userId: params['userId'] || '',
        });
    
        this.cdRef.detectChanges();
      }
    });
    this.getLoadAvailibility();
    this.getSubscriptionPlan();
    this.commonService.configData
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.configurationData = res;
          this.shipmentTypesList = this.configurationData.shipmentTypesList;
          this.equipmentTypesList = this.configurationData.equipmentTypes;
        }
      });
  }
  getSubscriptionPlan(): void {
    const plan = localStorage.getItem('subscriptionPlanType');
    this.subscriptionPlanType = plan ? parseInt(plan, 10) : null;
    // this.subscriptionPlanType = 0
    console.log('Subscription Plan Type:', this.subscriptionPlanType);
  }
  getLoadAvailibility(resetData: boolean = false) {
    this.spinnerLoader = true;

    let newParams: {
      limit: number;
      page: number;
      shipmentTypes?: string;
      equipmentType?: string;
      frequency?: string;
      sourceDate?: string;
      destinationDate?: string;
      length?: string;
      weight?: string;
      miles?: string;
      costPerMile?: string;
      destinationLocation?: string;
      sourceLocation?: string;
      userId?: string;
      carrierId?: string;
      // teamIds?: string;
    } = {
      limit: 10,
      page: this.page,
    };
    const {
      shipmentTypes,
      equipmentType,
      frequency,
      sourceDate,
      destinationDate,
      length,
      weight,
      miles,
      costPerMile,
      destinationLocation,
      sourceLocation,
      userId,
      carrierId
      // teamIds,
    } = this.advanceFilterForm.value;
    if (shipmentTypes) newParams.shipmentTypes = shipmentTypes;
    if (equipmentType) newParams.equipmentType = equipmentType;
    if (frequency) newParams.frequency = frequency;
    if (length) newParams.length = length;
    if (weight) newParams.weight = weight;
    if (miles) newParams.miles = miles;
    if (costPerMile) newParams.costPerMile = costPerMile;
    if (destinationLocation)
      newParams.destinationLocation = destinationLocation;
    if (sourceLocation)
      newParams.sourceLocation = sourceLocation;
    if(carrierId) newParams.carrierId = carrierId;
    if(userId) newParams.userId = userId;
    // if (teamIds) newParams.teamIds = teamIds;
    if (sourceDate) newParams.sourceDate = this.formatDateForAPI(sourceDate);
    if (destinationDate)
      newParams.destinationDate = this.formatDateForAPI(destinationDate);

    console.log('Selected Filters:', newParams);
    // Step 3: Build URLSearchParams
    const queryParams = new URLSearchParams();
    if (newParams.page) queryParams.set('page', newParams.page.toString());
    if (newParams.limit) queryParams.set('limit', newParams.limit.toString());
    if (newParams.shipmentTypes) queryParams.set('shipmentTypes', newParams.shipmentTypes);
    if (newParams.equipmentType) queryParams.set('equipmentType', newParams.equipmentType);
    if (newParams.frequency) queryParams.set('frequency', newParams.frequency);
    if (newParams.length) queryParams.set('length', newParams.length);
    if (newParams.weight) queryParams.set('weight', newParams.weight);
    if (newParams.miles) queryParams.set('miles', newParams.miles);
    if (newParams.costPerMile) queryParams.set('costPerMile', newParams.costPerMile);
    if (newParams.destinationLocation) queryParams.set('destinationLocation', newParams.destinationLocation);
    // if (newParams.teamIds) queryParams.set('teamIds', newParams.teamIds);
    if (newParams.sourceLocation)queryParams.set('sourceLocation', newParams.sourceLocation);
    if(newParams.carrierId) queryParams.set('carrierId', newParams.carrierId);
    if(newParams.userId) queryParams.set('carrierId', newParams.userId);
    if (newParams.sourceDate) queryParams.set('sourceDate', newParams.sourceDate);
    if (newParams.destinationDate) queryParams.set('destinationDate', newParams.destinationDate);
  // Replace the current history entry with new params
  history.replaceState(
    null,
    '',
    `${window.location.pathname}?${queryParams.toString()}`
  );
    const uri = this.commonService.getAPIUriFromParams(newParams);
    const APIparams = {
      apiKey: AppSettings.APIsNameArray.AVAILIBILITY.NONCARRIERAVAILIBILITY,
      uri: uri,
    };
    this.loaddedScreens = this.page;
    this.commonService.getList(APIparams).subscribe(
      (ServerRes) => {
        if (ServerRes.success === true) {
          const newData = ServerRes.response;
          // this.dataSource.data = ServerRes.response;
          if (resetData) {
            this.dataSource.data = newData;
          } else {
            const existingIds = new Set(
              this.dataSource.data.map((item) => item.id)
            );
            const uniqueData = newData.filter(
              (item) => !existingIds.has(item.id)
            );
            this.dataSource.data = [...this.dataSource.data, ...uniqueData];
          }

          console.log(ServerRes, '799', this.dataSource.data);
          this.totalRecords = ServerRes.total;
          this.totalPages = ServerRes.totalPages;
          this.loadAvailibilityData = ServerRes.response;
          this.spinnerLoader = false;
        }
      },
      (error) => {
        this.loaddedScreens--;
        this.message = error.error.message;
        this.loadAvailibilityData = [];
        this.spinnerLoader = false;
      }
    );
  }
  addParams(currentPage: any = this.page){
    this.page = currentPage;
    let newParams: {
      limit: number;
      page: number;
      shipmentTypes?: string;
      equipmentType?: string;
      frequency?: string;
      sourceDate?: string;
      destinationDate?: string;
      length?: string;
      weight?: string;
      miles?: string;
      costPerMile?: string;
      destinationLocation?: string;
      sourceLocation?: string;
      userId?: string;
      carrierId?: string;
      // teamIds?: string;
    } = {
      limit: 10,
      page: this.page,
    };
    const queryParams = new URLSearchParams();
    if (newParams.page) queryParams.set('page', newParams.page.toString());
    if (newParams.limit) queryParams.set('limit', newParams.limit.toString());
    if (newParams.shipmentTypes) queryParams.set('shipmentTypes', newParams.shipmentTypes);
    if (newParams.equipmentType) queryParams.set('equipmentType', newParams.equipmentType);
    if (newParams.frequency) queryParams.set('frequency', newParams.frequency);
    if (newParams.length) queryParams.set('length', newParams.length);
    if (newParams.weight) queryParams.set('weight', newParams.weight);
    if (newParams.miles) queryParams.set('miles', newParams.miles);
    if (newParams.costPerMile) queryParams.set('costPerMile', newParams.costPerMile);
    if (newParams.destinationLocation) queryParams.set('destinationLocation', newParams.destinationLocation);
    // if (newParams.teamIds) queryParams.set('teamIds', newParams.teamIds);
    if (newParams.sourceLocation)queryParams.set('sourceLocation', newParams.sourceLocation);
    if(newParams.carrierId) queryParams.set('carrierId', newParams.carrierId);
    if(newParams.userId) queryParams.set('carrierId', newParams.userId);
    if (newParams.sourceDate) queryParams.set('sourceDate', newParams.sourceDate);
    if (newParams.destinationDate) queryParams.set('destinationDate', newParams.destinationDate);
  // Replace the current history entry with new params
  history.replaceState(
    null,
    '',
    `${window.location.pathname}?${queryParams.toString()}`
  );
  }
    scrollPoints: number[] = [];  
      @HostListener('window:scroll', ['$event'])
      onWindowScroll(event: Event) {
        const scrollHeight = window.innerHeight + window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
    
        // ✅ Bottom Scroll: Increment page and store scroll point
        if (documentHeight - scrollHeight <= 1) {
          if (this.page < this.totalPages) {
            this.page += 1;
            this.getLoadAvailibility();
            console.log(`Page incremented: ${this.page}`);
    
            // Store the scroll point where page was incremented
            this.scrollPoints.push(window.scrollY);
          }
        }
    
        // ✅ Top Scroll: Decrement page if crossing previous scroll point
        if (window.scrollY < (this.scrollPoints[this.scrollPoints.length - 1] || 0)) {
          if (this.page > 1) {
            this.page -= 1;
            this.getLoadAvailibility();
            console.log(`Page decremented: ${this.page}`);
            this.scrollPoints.pop();  // Remove the last point
          }
        }
    
      }
  // Profile analytics table
  displayedColumns: string[] = [
    'id',
    'truckName',
    'carrierInformation',
    'pickup',
    'dropOff',
    'distance',
    'frequency',
    'equipmentType',
    'shipmentType',
    'costPerMile',
    'notes',
  ];

  // Advanced filter toggle
  toggleFilter() {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }
  resetFilters(): void {
    console.log('Reset Filters Clicked');
    this.showAdvancedFilter = false;
    this.searchControl.setValue('');
    this.isFilterApplied = false;
    this.dataSource.filter = '';
    this.page = 1;
    this.dataSource.data = [];
    this.advanceFilterForm.reset();
    this.getLoadAvailibility(true);
  }
  formatDateForAPI(date: any): string {
    if (!date) return '';
    let d = new Date(date);
    let month = ('0' + (d.getMonth() + 1)).slice(-2); // Ensure 2-digit month
    let day = ('0' + d.getDate()).slice(-2); // Ensure 2-digit day
    let year = d.getFullYear();
    return `${month}/${day}/${year}`; // Format: MM/DD/YYYY
  }
  formatFrequency(frequency: string): string {
    if (!frequency) return '';
    return frequency.toLowerCase().replace(/\s+/g, '_');
  }

  getCountryFlag(countryCode: string): string {
    const country = this.countryList.find(
      (c) => c.value.toLowerCase() === countryCode?.toLowerCase()
    );
    return country ? country.flag : './assets/country/us.png';
  }

  getShipmentTypeLabel(shipmentId: string): string {
    return this.configurationData?.shipmentTypes?.find(
      (shipmentType) => shipmentType?.id === +shipmentId
    )?.name;
  }
  getEquipmentTypeLabel(equipmentId: string): string {
    return this.configurationData?.equipmentTypes?.find(
      (equipmmentType) => equipmmentType?.id === +equipmentId
    )?.name;
  }
  applyFilter() {
    const filterValue = this.searchControl.value.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.carrier?.companyName?.toLowerCase().includes(filter);
    };

    this.dataSource.filter = filterValue;
    this.isFilterApplied = filterValue.length > 0;
  }
  refresh() {
    this.getLoadAvailibility(true);
  }
  
  applyFilters() {
    this.showAdvancedFilter = false;
    this.isFilterApplied = true;
    this.page = 1;
    this.dataSource.data = [];
    this.getLoadAvailibility(true);
  }
  applyAdvancedFilter() {
    this.showAdvancedFilter = false;
    this.isFilterApplied = true;
    this.page = 1;
    this.dataSource.data = [];
    this.getLoadAvailibility(true);
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
 
     // this.loadingMoreTeams = true;
     // if (!loadMore) this.spinnerLoader = true;
 
     const params = {
       limit: this.teamLimit,
       page: this.teamPage,
     };
 
     const apiKey = AppSettings.APIsNameArray.TEAM.TEAMLIST;
     if (apiKey) {
       let APIparams = {
         apiKey: apiKey,
         uri: this.commonService.getAPIUriFromParams(params),
       };
 
       this.commonService.getList(APIparams).subscribe(
         (response) => {
           // this.loadingMoreTeams = false;
           // this.spinnerLoader = false;
 
           if (response?.response?.teamArray) {
             this.teamIdList = [
               ...this.teamIdList,
               ...response.response.teamArray,
             ];
             // Check if more teams are available
             this.hasMoreTeams =
               response.response.teamArray.length >= this.teamLimit;
             this.totalTeams = response.response.totalCount || 0;
           }
         },
         (error) => {
           // this.loadingMoreTeams = false;
           // this.spinnerLoader = false;
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
     const atBottom =
       panel.scrollHeight - panel.scrollTop <=
       panel.clientHeight + scrollThreshold;
 
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
     this.destroy$.next(true);
     this.destroy$.complete();
   }
   getColorClass(frequency: string): string {
    switch (frequency) {
      case 'daily':
      case 'oneTime':
        return 's'; // Green
      case 'weekly':
        return 'p'; // Blue
      case 'monthly':
        return 'y'; // Yellow
      case 'yearly':
        return 'd'; // Red
      default:
        return '333'; // Default color
    }
  }
  expandedNotes: { [key: string]: boolean } = {};

  toggleNote(id: string | number) {
    this.expandedNotes[id] = !this.expandedNotes[id];
  }
}
