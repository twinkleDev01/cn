import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
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
  public totalPage = 1;
  totalRecords: number;
  public spinnerLoader = false;
  public dataNotFound = false;
  public params: any = {};
  public orderDir = '';
  showAdvancedFilter = false;
  teamIdList :any=[];
  countryName = ''; // This will be set dynamically from API

  countryList = [
    { value: 'US', name: 'United States', flag: './assets/country/us.png', code: '+1' },
    { value: 'MX', name: 'Mexico', flag: './assets/country/mx.png', code: '+52' },
    { value: 'CA', name: 'Canada', flag: './assets/country/ca.png', code: '+1' }
  ];
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    advanceFilterForm: FormGroup;

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
    this.getLoadAvailibility();
    this.teamList();
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
      teamIds:[]
    });
  }

  getAPIParam(str) {
    let APIparams, params;
    if (str) params = { limit: 5, page: this.page, sort: this.orderDir };
    else params = { limit: 5, page: this.page, sort: this.orderDir };
    params = { limit: 5, page: this.page, sort: this.orderDir };
    let url;
    (url = AppSettings.APIsNameArray.AVAILIBILITY.LIST),
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
          if (result[v]) this.loadAvailibilityData.push(result[v]);
        }
      }
    });
  }

  getLoadAvailibility() {
    let uri = null;

    this.spinnerLoader = true;
    let APIparams, params;
    params = { limit: 10, page: this.page };
    (this.params.limit = 10),
      (this.params.page = this.page),
      (this.params.sort = this.orderDir);

    if (this.params) uri = this.commonService.getAPIUriFromParams(this.params);
    APIparams = {
      apiKey: AppSettings.APIsNameArray.AVAILIBILITY.LIST,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe(
      (ServerRes) => {
        if (ServerRes.success === true) {
          this.dataSource.data = ServerRes.response;
          console.log(ServerRes,"799", this.dataSource.data)
          this.totalRecords = ServerRes.total;
          this.totalPage = ServerRes.totalPages;
          this.loadAvailibilityData = ServerRes.response;
          this.spinnerLoader = false;
        } else {
          this.loadAvailibilityData = [];
          this.spinnerLoader = false;
        }
      },
      (error) => {
        this.message = error.error.message;
        this.loadAvailibilityData = [];
        this.spinnerLoader = false;
      }
    );
  }

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  // editLoadAvailibility(loadData: any, type: any) {
  //   const dialogRef = this.dialog.open(PopupComponent, {
  //     disableClose: true,
  //     backdropClass: 'cn_custom_popup',
  //     width: '460px',
  //     data: {
  //       openPop: type,
  //       loadData: loadData,
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result.event === 'Ok') {
  //       this.loadAvailibilityData = [];
  //       this.page = 1;
  //       this.getLoadAvailibility();
  //     }
  //   });
  // }
  // removeloadAvailibilityPopup(loadAvailibilityID: any, type: any, index: any) {
  //   const dialogRef = this.dialog.open(PopupComponent, {
  //     disableClose: true,
  //     backdropClass: 'cn_custom_popup',
  //     width: '460px',
  //     data: { openPop: type },
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result.event === 'ok') {
  //       this.removeloadAvailibility(loadAvailibilityID, index);
  //     }
  //   });
  // }

  // removeloadAvailibility(loadAvailibilityID, index) {
  //   this.spinnerLoader = true;
  //   let uri = null;
  //   let newParams = {
  //     id: loadAvailibilityID,
  //   };
  //   if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
  //   let APIparams = {
  //     apiKey: AppSettings.APIsNameArray.AVAILIBILITY.DELETE,
  //     uri: uri,
  //   };
  //   this.commonService.delete(APIparams).subscribe(
  //     (success) => {
  //       if (success.success === true) {
  //         this.spinnerLoader= true;
  //         this.loadAvailibilityData.splice(index, 1);
  //         this.loadAvailibilityData = [];

  //         this.page = 1;
  //         this.getLoadAvailibility();
  //         this.alertService.showNotificationMessage(
  //           'success',
  //           'bottom',
  //           'left',
  //           'txt_s',
  //           'check_circle',
  //           'Pending Review Invitation',
  //           'You have successfully withdrawal Pending Review Invitation.'
  //         );
  //       } else if (success.success === false) {
  //         this.alertService.showNotificationMessage(
  //           'danger',
  //           'bottom',
  //           'left',
  //           'txt_d',
  //           'cancel',
  //           'Pending Review Invitation',
  //           'There is some issue, Please try again'
  //         );
  //       }
  //     },
  //     (error) => {
  //       this.alertService.showNotificationMessage(
  //         'danger',
  //         'bottom',
  //         'left',
  //         'txt_g',
  //         'error',
  //         'Unexpected Error',
  //         AppSettings.ERROR
  //       );
  //       this.spinnerLoader = false;
  //     }
  //   );
  // }

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
    'notes'
  ];

  toggleFilter() {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }
  formatFrequency(frequency: string): string {
    if (!frequency) return '';
    return frequency.toLowerCase().replace(/\s+/g, '_');
  }
  getCountryFlag(countryCode: string): string {
    const country = this.countryList.find(
      c => c.value.toLowerCase() === countryCode?.toLowerCase()
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
