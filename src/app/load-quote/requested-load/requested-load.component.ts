import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { Chart, registerables } from 'chart.js';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSelect } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/commons/service/alert.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-requested-load',
  templateUrl: './requested-load.component.html',
  styleUrls: ['./requested-load.component.scss'],
})
export class RequestedLoadComponent implements OnInit {
  public skeletonLoader: boolean = false;
  public nonCarrierUser: any = [];
  public message: any;
  //pagination
  public getTotalHeight: any;
  public totalPage = 1;
  public spinnerLoader = false;
  public dataNotFound = false;
  public page = 1;
  public orderDir = '';
  subscriptionPlanType: number | null = null;

  public totalRecords: number;
  public params: any = {};

  totalViews: number = 1000;
  uniqueVisitors: number = 850;
  repeatVisitors: number = 150;
  showAdvancedFilter = false;
  selectedChart: string = 'country';
  loaddedScreens = 0;
  totalPages: number = 0;
  showScrollSpinner: boolean = false;
  dataSource = new MatTableDataSource([]);
  searchControl = new FormControl('');
  advanceFilterForm: FormGroup;
  isFilterApplied = false;
  totalQuotes: number = 0;
  totalQuotesLimit: number = 0;
  teamIdList: any = [];
    configurationData: any;
    public destroy$ = new Subject();
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


  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
      public dialog: MatDialog,
        public alertService: AlertService,
       private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
    this.advanceFilterForm = this.fb.group({
      shipmentTypes: [''],
      equipmentType: [''],
      weight: [''],
      length: [''],
      teamIds: [],
    });
    if (params && Object.keys(params).length) {
      this.advanceFilterForm.patchValue({
        shipmentTypes: params['shipmentTypes'] || '',
        equipmentType: params['equipmentType'] || '',
        length: params['length'] || '',
        weight: params['weight'] || '',
        teamIds: params['teamIds'] || ''
      });
  
      this.cdRef.detectChanges();
    }
  });
    this.createShipmentTypeBreakdownChart();
    this.createCityChart();
    this.fetchLoadQuoteList();
    this.teamList();
    this.getSubscriptionPlan();
      // Config Data
        this.commonService.configData
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            if (res) {
              this.configurationData = res;
              this.shipmentTypesList = this.configurationData.shipmentTypes;
              this.equipmentTypesList = this.configurationData.equipmentTypes;
            }
          });
        console.log(this.shipmentTypesList, this.equipmentTypesList, '143');
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
  fetchLoadQuoteList(resetData: boolean = false) {
    this.spinnerLoader = true;
    let newParams: {
      limit: number;
      page: number;
      shipmentTypes?: string;
      equipmentType?: string;
      length?: string;
      weight?: string;
      teamIds?: string;
    } = {
      limit: 10,
      page: this.page,
    };
    const {
      shipmentTypes,
      equipmentType,
      length,
      weight,
      teamIds,
    } = this.advanceFilterForm.value;
    // Conditionally set the API key for CARRIER or BROKER
    const apiKey = AppSettings.APIsNameArray.RECENTVIEW.COMMANQUOTELIST; // No default fallback
    if (shipmentTypes) newParams.shipmentTypes = shipmentTypes;
    if (equipmentType) newParams.equipmentType = equipmentType;
    if (length) newParams.length = length;
    if (weight) newParams.weight = weight; 
    if (teamIds) newParams.teamIds = teamIds;
    console.log('Selected Filters:', newParams);
    // Step 3: Build URLSearchParams
    const queryParams = new URLSearchParams();
    if (newParams.page) queryParams.set('page', newParams.page.toString());
    if (newParams.limit) queryParams.set('limit', newParams.limit.toString());
    if (newParams.shipmentTypes) queryParams.set('shipmentTypes', newParams.shipmentTypes);
    if (newParams.equipmentType) queryParams.set('equipmentType', newParams.equipmentType);
    if (newParams.length) queryParams.set('length', newParams.length);
    if (newParams.weight) queryParams.set('weight', newParams.weight);
    if (newParams.teamIds) queryParams.set('teamIds', newParams.teamIds);
  // Replace the current history entry with new params
  history.replaceState(
    null,
    '',
    `${window.location.pathname}?${queryParams.toString()}`
  );
    // Only call the API if a valid API key is present
    if (apiKey) {
      let APIparams = {
        apiKey: apiKey,
        uri: this.commonService.getAPIUriFromParams(newParams),
      };
      this.loaddedScreens = this.page;
      this.commonService.getList(APIparams).subscribe((response) => {
        console.log('response', response);
        if (response && response.response) {
          const newData = response.response;
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
          console.log(response, '799', this.dataSource.data);
          this.totalRecords = response.total;
          this.totalPages = response.totalPages;
          this.spinnerLoader = false;
        }
      },
      (error) => {
        this.loaddedScreens--;
        this.message = error.error.message;
        this.spinnerLoader = false;
      }
    );
  }
  }
  addParams(currentPage: any = this.page){
    this.page = currentPage;
    let newParams: {
      limit: number;
      page: number;
      shipmentTypes?: string;
      equipmentType?: string;
      length?: string;
      weight?: string;
      teamIds?: string;
    } = {
      limit: 10,
      page: this.page,
    };
    const queryParams = new URLSearchParams();
    if (newParams.page) queryParams.set('page', newParams.page.toString());
    if (newParams.limit) queryParams.set('limit', newParams.limit.toString());
    if (newParams.shipmentTypes) queryParams.set('shipmentTypes', newParams.shipmentTypes);
    if (newParams.equipmentType) queryParams.set('equipmentType', newParams.equipmentType);
    if (newParams.length) queryParams.set('length', newParams.length);
    if (newParams.weight) queryParams.set('weight', newParams.weight);
    if (newParams.teamIds) queryParams.set('teamIds', newParams.teamIds);
  // Replace the current history entry with new params
  history.replaceState(
    null,
    '',
    `${window.location.pathname}?${queryParams.toString()}`
  );
  }

  applyFilters() {
    this.showAdvancedFilter = false;
    this.isFilterApplied = true;
    this.page = 1;
    this.dataSource.data = [];
    this.fetchLoadQuoteList(true);
  }
  applyFilter() {
    const filterValue = this.searchControl.value.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.carrier?.companyName?.toLowerCase().includes(filter);
    };
    this.dataSource.filter = filterValue;
    this.isFilterApplied = filterValue.length > 0;
  }

  applyAdvanceFilter() {
    this.showAdvancedFilter = false;
    this.isFilterApplied = true;
    this.page = 1;
    this.dataSource.data = [];
    this.fetchLoadQuoteList(true);
  }
  refresh() {
    this.fetchLoadQuoteList(true);
  }
  // Progress Bar Percentage calculation
  get totalViewsPercentage(): number {
    return 100;
  }
  get uniqueVisitorsPercentage(): number {
    return (this.uniqueVisitors / this.totalViews) * 100;
  }
  get repeatVisitorsPercentage(): number {
    return (this.repeatVisitors / this.totalViews) * 100;
  }

  // User dashboard chart
  createShipmentTypeBreakdownChart() {
    const ctx = document.getElementById(
      'shipmentTypeBreakdown'
    ) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['LTL', 'FTL', 'Partial Shipments'],
        datasets: [
          {
            data: [60, 10, 30],
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
            borderWidth: 1,
          },
        ],
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
              padding:
                window.innerWidth < 576 ? 12 : window.innerWidth < 768 ? 8 : 14,
              font: {
                size:
                  window.innerWidth < 576
                    ? 11
                    : window.innerWidth < 768
                    ? 12
                    : 12,
                weight: 'bold',
              },
              boxWidth: window.innerWidth < 576 ? 8 : 12,
              color: '#000',
            },
          },
          tooltip: {
            titleFont: {
              size: window.innerWidth < 576 ? 10 : 12,
            },
            bodyFont: {
              size: window.innerWidth < 576 ? 9 : 11,
            },
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.raw}%`;
              },
            },
          },
        },
        radius: window.innerWidth < 576 ? '70%' : '100%',
      },
    });
  }

  // Top Equipment Shipments chart
  ngAfterViewInit() {
    const ctx = document.getElementById(
      'topEquipmentShipmentsChart'
    ) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Auto Carrier Trailer',
          'Drayage Trailer',
          'Drop Deck Landoll',
        ],
        datasets: [
          {
            data: [3, 1, 1],
            backgroundColor: [
              'rgba(54, 162, 235 )',
              'rgba(255, 99, 132 )',
              'rgba(75, 192, 192 )',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
            maxBarThickness: 40,
            categoryPercentage: 0.6,
            barPercentage: 0.7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            // max: 100,
            grid: {
              display: true,
            },
            // ticks: {
            //   callback: function(value) {
            //     return value + '%';
            //   }
            // }
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  createCityChart() {
    const ctxCity = document.getElementById(
      'BrokeredCarrierShipmentsChart'
    ) as HTMLCanvasElement;
    new Chart(ctxCity, {
      type: 'bar',
      data: {
        labels: ['Brokered Loads', 'Carrier Loads'],
        datasets: [
          {
            data: [4, 3],
            backgroundColor: ['#4e73df', '#1cc88a'],
            borderColor: ['#4e73df', '#1cc88a'],
            borderWidth: 1,
            maxBarThickness: 40,
            categoryPercentage: 0.6,
            barPercentage: 0.7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            // max: 100,
            grid: {
              display: true,
            },
            ticks: {
              font: {
                size: window.innerWidth < 768 ? 10 : 12,
              },
              // callback: function(value) {
              //   return value + '%';
              // }
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: window.innerWidth < 768 ? 10 : 12,
              },
            },
          },
        },
      },
    });
  }

  // Profile analytics table
  displayedColumns: string[] = [
    'loadId',
    'requestedBy',
    'pickup',
    'dropOff',
    'distance',
    'equipmentType',
    'shipmentType',
    'weight',
    'length',
    'notes',
  ];

  equipmentTypesList = [];
  shipmentTypesList = [];

  toggleFilter() {
    this.showAdvancedFilter = !this.showAdvancedFilter;
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
  resetFilters(): void {
    console.log('Reset Filters Clicked');
    this.showAdvancedFilter = false;
    this.searchControl.setValue('');
    this.isFilterApplied = false;
    this.dataSource.filter = '';
    this.page = 1;
    this.dataSource.data = [];
    this.advanceFilterForm.reset();
    this.fetchLoadQuoteList(true);
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
          this.fetchLoadQuoteList();
          console.log(`Page incremented: ${this.page}`);
  
          // Store the scroll point where page was incremented
          this.scrollPoints.push(window.scrollY);
        }
      }
  
      // ✅ Top Scroll: Decrement page if crossing previous scroll point
      if (window.scrollY < (this.scrollPoints[this.scrollPoints.length - 1] || 0)) {
        if (this.page > 1) {
          this.page -= 1;
          this.fetchLoadQuoteList();
          console.log(`Page decremented: ${this.page}`);
          this.scrollPoints.pop();  // Remove the last point
        }
      }
  
    }
  
    onWeightInput(event: Event): void {
      const input = (event.target as HTMLInputElement).value;
      // Allow only digits and trim to 9 characters
      const numericInput = input.replace(/\D/g, '').slice(0, 9);
      this.advanceFilterForm.get('weight')?.setValue(numericInput, { emitEvent: false });
    }
    onLengthInput(event: Event): void {
      const input = (event.target as HTMLInputElement).value;
      // Allow only digits and trim to 9 characters
      const numericInput = input.replace(/\D/g, '').slice(0, 9);
      this.advanceFilterForm.get('length')?.setValue(numericInput, { emitEvent: false });
    }
    expandedNotes: { [key: string]: boolean } = {};

    toggleNote(id: string | number) {
      this.expandedNotes[id] = !this.expandedNotes[id];
    }
}
