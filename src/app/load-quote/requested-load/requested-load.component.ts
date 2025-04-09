import { Component, HostListener, OnInit } from '@angular/core';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { Chart, registerables } from 'chart.js';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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

  public totalRecoads: number;
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
  isFilterApplied = false;
  totalQuotes: number = 0;
  totalQuotesLimit: number = 0;
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
  advanceFilterForm = this.fb.group({
    shipmentTypes: [''],
    equipmentType: [''],
    weight: [''],
    length: [''],
    teamIds: [''],
  });

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.patchFilterValues();
    // this.getNonCarrierUserData();
    this.createShipmentTypeBreakdownChart();
    this.createCityChart();
    this.fetchLoadQuoteList();
  }
  patchFilterValues() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const shipmentTypes = params['shipmentTypes']
        ? params['shipmentTypes']
        : null;
      const equipmentType = params['equipmentType']
        ? params['equipmentType']
        : null;
      const weight = params['weight'] ? params['weight'] : null;
      const length = params['length'] ? params['length'] : null;
      const teamIds = params['teamIds'] ? params['teamIds'] : null;
      this.advanceFilterForm.patchValue({
        shipmentTypes: +shipmentTypes,
        equipmentType: +equipmentType,
        weight: weight,
        length: length,
        teamIds: teamIds,
      });
    });
  }

  fetchLoadQuoteList(currentPage = 1, clearData: boolean = false) {
    let newParams = this.addParams(currentPage);

    // Conditionally set the API key for CARRIER or BROKER
    const apiKey = AppSettings.APIsNameArray.RECENTVIEW.COMMANQUOTELIST; // No default fallback

    // Only call the API if a valid API key is present
    if (apiKey) {
      let APIparams = {
        apiKey: apiKey,
        uri: this.commonService.getAPIUriFromParams(newParams),
      };
      this.showScrollSpinner = true;
      this.loaddedScreens = this.page;
      this.commonService.getList(APIparams).subscribe((response) => {
        console.log('response', response);
        this.showScrollSpinner = false;
        this.totalPages = response.totalPages;
        this.totalQuotes = response.total;
        this.totalQuotesLimit = this.getNearByLimit(response.total);
        if (response && response.response) {
          if (clearData) {
            this.dataSource.data = response.response;
          } else {
            const newData = response.response.filter(
              (d) =>
                !this.dataSource.data.some(
                  (existingData) => existingData.id === d.id
                )
            );
            this.dataSource.data = this.dataSource.data.concat(newData);
          }
          const titleCase = (str: string) =>
            str?.charAt(0)?.toUpperCase() + str?.slice(1);
          this.dataSource.data = this.dataSource.data.map((d) => ({
            ...d,
            sourceLocation: [
              titleCase(d.sourceLocationCity),
              d.sourceLocationState,
              d.sourceLocationCountry,
            ]
              .filter((item) => item)
              .join(', '),
            destinationLocation: [
              titleCase(d.destinationLocationCity),
              d.destinationLocationState,
              d.destinationLocationCountry,
            ]
              .filter((item) => item)
              .join(', '),
          }));
        }
      });
    }
  }

  getNearByLimit(d: number) {
    const digitCount = d.toString().length;
    return Math.pow(10, digitCount);
  }
  addParams(currentPage: number) {
    const newParams = {
      limit: 10,
      page: currentPage,
    };
    const filters = this.advanceFilterForm.value;
    const queryParams = new URLSearchParams();
    queryParams.set('page', currentPage.toString());
    queryParams.set('limit', newParams.limit.toString());
    Object.keys(filters)
      .filter((key) => filters[key])
      .forEach((key) => {
        newParams[key] = filters[key];
        queryParams.set(key, filters[key]);
      });

    history.replaceState(
      null,
      '',
      `${window.location.pathname}?${queryParams.toString()}`
    );
    return newParams;
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
    this.loaddedScreens = 0;
    this.page = 1;
    this.fetchLoadQuoteList(1, true);
    this.showAdvancedFilter = true;
  }
  refresh() {
    this.fetchLoadQuoteList(this.loaddedScreens);
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
    if (
      (this.equipmentTypesList.length === 0 ||
        this.shipmentTypesList.length === 0) &&
      !this.showAdvancedFilter
    ) {
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.EXTRA.CONFIG,
        uri: '',
      };
      this.commonService.getList(APIparams).subscribe((response) => {
        const { equipmentTypes, shipmentTypes } = response.response;
        this.equipmentTypesList = equipmentTypes;
        this.shipmentTypesList = shipmentTypes.filter(
          (d) => d.name.toLowerCase() != 'parcel'
        );
        this.patchFilterValues();
      });
    }
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
  getNonCarrierUserData() {
    let uri = null;
    this.skeletonLoader = true;

    // this.orderDir = this.sortingValue;
    // this.newOld = this.sortingValueNew
    let APIparams, params;
    params = { limit: 5, page: this.page };
    (this.params.limit = 5),
      (this.params.page = this.page),
      (this.params.sort = this.orderDir);

    if (this.params) uri = this.commonService.getAPIUriFromParams(this.params);
    APIparams = {
      apiKey: AppSettings.APIsNameArray.LOADQUOTE.LOADQUOTESLIST,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe(
      (ServerRes) => {
        if (ServerRes.success === true) {
          this.nonCarrierUser = ServerRes.response;
          this.totalRecoads = ServerRes.total;
          this.totalPage = ServerRes.totalPages;
          this.skeletonLoader = false;
        } else {
          this.nonCarrierUser = [];
          this.skeletonLoader = false;
        }
      },
      (error) => {
        this.message = error.error.message;
        this.nonCarrierUser = [];
        this.skeletonLoader = false;
      }
    );
  }
  getAPIParam(str) {
    let APIparams, params;
    if (str) params = { limit: 5, page: this.page, sort: this.orderDir };
    else params = { limit: 5, page: this.page, sort: this.orderDir };
    params = { limit: 5, page: this.page, sort: this.orderDir };
    let url;
    (url = AppSettings.APIsNameArray.LOADQUOTE.LOADQUOTESLIST),
      (APIparams = {
        apiKey: url,
        uri: this.commonService.getAPIUriFromParams(params),
      });
    return APIparams;
  }
  getMoreData(str) {
    var APIparams = this.getAPIParam(str);
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      let result = ServerRes.response;
      this.totalPage = ServerRes.totalPages;
      this.spinnerLoader = false;
      if (ServerRes.response && ServerRes.response.length > 0) {
        for (let v = 0; v < result.length; v++) {
          if (result[v]) this.nonCarrierUser.push(result[v]);
        }
      }
    });
  }
  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
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
    this.fetchLoadQuoteList(1, true);
  }
}
