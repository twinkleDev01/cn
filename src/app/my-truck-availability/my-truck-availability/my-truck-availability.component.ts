import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { PopupComponent } from 'src/app/shared/popup/popup.component';

@Component({
  selector: 'app-my-truck-availability',
  templateUrl: './my-truck-availability.component.html',
  styleUrls: ['./my-truck-availability.component.css'],
})
export class MyTruckAvailabilityComponent implements OnInit {
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
    public dialog: MatDialog,
    public alertService: AlertService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
     private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.usertype = localStorage.getItem('user_type');
    if (this.usertype === 'CARRIER') {
      this.displayedColumns = this.displayedColumns.filter(
        (col) => col !== 'carrierInformation'
      );
    }
    //
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
          teamIds: params['teamIds'] || '',
        });
        // ✅ Restore sort direction if available
        //  if (params['sort']) {
        //   this.orderDir = params['sort'];
        // }
        this.cdRef.detectChanges();
      }
    });
    this.getLoadAvailibility();
    this.teamList();
    this.getSubscriptionPlan();
  }
  getSubscriptionPlan(): void {
    const plan = localStorage.getItem('subscriptionPlanType');
    this.subscriptionPlanType = plan ? parseInt(plan, 10) : null;
    // this.subscriptionPlanType = 0
    console.log('Subscription Plan Type:', this.subscriptionPlanType);
  }
  // getAPIParam(str) {
  //   let APIparams, params;
  //   if (str) params = { limit: 5, page: this.page, sort: this.orderDir };
  //   else params = { limit: 5, page: this.page, sort: this.orderDir };
  //   params = { limit: 5, page: this.page, sort: this.orderDir };
  //   let url;
  //   (url = AppSettings.APIsNameArray.AVAILIBILITY.LIST),
  //     (APIparams = {
  //       apiKey: url,
  //       uri: this.commonService.getAPIUriFromParams(params),
  //     });
  //   return APIparams;
  // }
  // getMoreData(str) {
  //   var APIparams = this.getAPIParam(str);
  //   this.commonService.getList(APIparams).subscribe((ServerRes) => {
  //     let result = ServerRes.response;
  //     this.totalPage = ServerRes.totalPages;
  //     this.spinnerLoader = false;
  //     if (ServerRes.response && ServerRes.response.length > 0) {
  //       for (let v = 0; v < result.length; v++) {
  //         if (result[v]) this.loadAvailibilityData.push(result[v]);
  //       }
  //     }
  //   });
  // }
  isAdvancedFilterVisible(): boolean {
    return this.subscriptionPlanType === 2 || this.subscriptionPlanType === 3;
  }
  applyFilter() {
    const filterValue = this.searchControl.value.trim().toLowerCase();
    console.log(
      filterValue,
      this.dataSource.filterPredicate,
      'llllllllllllllllll'
    );
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      console.log(data, data.userId, '99');
      return data.truckName?.toLowerCase().includes(filter);
    };

    this.dataSource.filter = filterValue;
    this.isFilterApplied = filterValue.length > 0;
  }

  refresh() {
    this.getLoadAvailibility(true);
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

  applyAdvancedFilter() {
    this.showAdvancedFilter = false;
    this.isFilterApplied = true;
    this.page = 1;
    this.dataSource.data = [];
    this.getLoadAvailibility(true);
  }
  getLoadAvailibility(resetData: boolean = false) {
    // let uri = null;

    this.spinnerLoader = true;
    // let APIparams, params;
    // params = { limit: 10, page: this.page };
    // (this.params.limit = 10),
    //   (this.params.page = this.page),
    //   (this.params.sort = this.orderDir);
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
      teamIds,
    } = this.advanceFilterForm.value;
    let newParams: any = {
      page: this.page,
      limit: 10,
      // sort: this.orderDir || 'desc',
    };
    if (shipmentTypes) newParams.shipmentTypes = shipmentTypes;
    if (equipmentType) newParams.equipmentType = equipmentType;
    if (frequency) newParams.frequency = frequency;
    if (length) newParams.length = length;
    if (weight) newParams.weight = weight;
    if (miles) newParams.miles = miles;
    if (costPerMile) newParams.costPerMile = costPerMile;
    if (destinationLocation)
      newParams.destinationLocation = destinationLocation;
    if (teamIds) newParams.teamIds = teamIds;
    if (sourceDate) newParams.sourceDate = this.formatDateForAPI(sourceDate);
    if (destinationDate)
      newParams.destinationDate = this.formatDateForAPI(destinationDate);

    console.log('Selected Filters:', newParams);
    // Step 3: Build URLSearchParams
    // const queryParams = new URLSearchParams();
    // if (newParams.page) queryParams.set('page', newParams.page.toString());
    // if (newParams.limit) queryParams.set('limit', newParams.limit.toString());
    // if (newParams.shipmentTypes) queryParams.set('shipmentTypes', newParams.shipmentTypes);
    // if (newParams.equipmentType) queryParams.set('equipmentType', newParams.equipmentType);
    // if (newParams.frequency) queryParams.set('frequency', newParams.frequency);
    // if (newParams.length) queryParams.set('length', newParams.length);
    // if (newParams.weight) queryParams.set('weight', newParams.weight);
    // if (newParams.miles) queryParams.set('miles', newParams.miles);
    // if (newParams.costPerMile) queryParams.set('costPerMile', newParams.costPerMile);
    // if (newParams.destinationLocation) queryParams.set('destinationLocation', newParams.destinationLocation);
    // if (newParams.teamIds) queryParams.set('teamIds', newParams.teamIds);
    // if (newParams.sourceDate) queryParams.set('sourceDate', newParams.sourceDate);
    // if (newParams.destinationDate) queryParams.set('destinationDate', newParams.destinationDate);
    const queryParams = new URLSearchParams();
    for (let key in newParams) {
      if (newParams[key]) {
        queryParams.set(key, newParams[key]);
      }
    }
    // Step 4: Replace browser URL with new query params
    history.replaceState(
      null,
      '',
      `${window.location.pathname}?${queryParams.toString()}`
    );

    // if (this.params) uri = this.commonService.getAPIUriFromParams(this.params);
    // APIparams = {
    //   apiKey: AppSettings.APIsNameArray.AVAILIBILITY.LIST,
    //   uri: uri,
    // };
    // Step 5: Call API
    const uri = this.commonService.getAPIUriFromParams(newParams);
    const APIparams = {
      apiKey: AppSettings.APIsNameArray.AVAILIBILITY.LIST,
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
        } else {
          // this.loadAvailibilityData = [];
          // this.spinnerLoader = false;
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

  applyFilters() {
    this.showAdvancedFilter = false;
    this.isFilterApplied = true;
    this.page = 1;
    this.dataSource.data = [];
    this.getLoadAvailibility(true);
  }
  addParams(currentPage: any = this.page) {
    this.page = currentPage;
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
      teamIds,
    } = this.advanceFilterForm.value;

    const newParams: any = {
      page: currentPage,
      limit: 10,
      // sort: this.orderDir || 'desc',
    };

    if (shipmentTypes) newParams.shipmentTypes = shipmentTypes;
    if (equipmentType) newParams.equipmentType = equipmentType;
    if (frequency) newParams.frequency = frequency;
    if (length) newParams.length = length;
    if (weight) newParams.weight = weight;
    if (miles) newParams.miles = miles;
    if (costPerMile) newParams.costPerMile = costPerMile;
    if (destinationLocation)
      newParams.destinationLocation = destinationLocation;
    if (teamIds) newParams.teamIds = teamIds;
    if (sourceDate) newParams.sourceDate = this.formatDateForAPI(sourceDate);
    if (destinationDate)
      newParams.destinationDate = this.formatDateForAPI(destinationDate);

    const queryParams = new URLSearchParams();

    for (const key in newParams) {
      if (
        newParams[key] !== undefined &&
        newParams[key] !== null &&
        newParams[key] !== ''
      ) {
        queryParams.set(key, newParams[key]);
      }
    }

    history.replaceState(
      null,
      '',
      `${window.location.pathname}?${queryParams.toString()}`
    );
  }

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  // Profile analytics table
  displayedColumns: string[] = [
    'loadId',
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
    'action',
  ];

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
  }
  onDeleteTruck(element) {
    console.log(element, '459');
    const params = {
    id: element,  
    };
    const APIparams = {
      apiKey: AppSettings.APIsNameArray.AVAILIBILITY.DELETE,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    this.commonService.delete(APIparams).subscribe({
      next: (res) => {
        console.log('TRUCK Deleted successfully:', res);
        this.toastr.success(res?.message, 'Success')
        if (!res.success) {
          this.toastr.error(res?.message, 'Error');
        }
      },
      error: (err) => {
        console.error('Error Deleted status:', err);
        // this.toastr.error(err?.error[0]?.message, 'Error');
      },
    });
  }
  deleteTruck(element: any) {
    console.log(element,"535")
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: {
        openPop: 'deleteMember',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result,"545")
      if (result.event === 'ok') {
        this.onDeleteTruck(element);
        console.log('Delete item:', element);
      }
    });
  }
}
