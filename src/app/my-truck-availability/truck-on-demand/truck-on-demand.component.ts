import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';

@Component({
  selector: 'app-truck-on-demand',
  templateUrl: './truck-on-demand.component.html',
  styleUrls: ['./truck-on-demand.component.scss']
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
    teamIdList :any=[];
    isFilterApplied = false;
     searchControl = new FormControl('');
    countryName = ''; // This will be set dynamically from API
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    advanceFilterForm: FormGroup;
    loaddedScreens = 0;
    totalPages: number = 0;
    usertype:any;
  
    countryList = [
      { value: 'US', name: 'United States', flag: './assets/country/us.png', code: '+1' },
      { value: 'MX', name: 'Mexico', flag: './assets/country/mx.png', code: '+52' },
      { value: 'CA', name: 'Canada', flag: './assets/country/ca.png', code: '+1' }
    ];
  

  constructor(
        private commonService: CommonService,
        public dialog: MatDialog,
        public alertService: AlertService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,  
        private cdRef: ChangeDetectorRef
  ){}
   

  ngOnInit(): void {
    this.usertype = localStorage.getItem('user_type');
    console.log("DEmand")
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
        destinationLocation: ['']
      });
      if (params && Object.keys(params).length) {
        this.advanceFilterForm.patchValue({
          sourceDate: params['sourceDate'] ? new Date(params['sourceDate']) : null,
          destinationDate: params['destinationDate'] ? new Date(params['destinationDate']) : null,
          shipmentTypes: params['shipmentTypes'] || '',
          equipmentType: params['equipmentType'] || '',
          frequency: params['frequency'] || '',
          length: params['length'] || '',
          weight: params['weight'] || '',
          miles: params['miles'] || '',
          costPerMile: params['costPerMile'] || '',
          destinationLocation: params['destinationLocation'] || '',
        });
           // ✅ Restore sort direction if available
          //  if (params['sort']) {
          //   this.orderDir = params['sort'];
          // }
        this.cdRef.detectChanges();
      }
    });
      this.getLoadAvailibility();
      this.getSubscriptionPlan();
    }
    getSubscriptionPlan(): void {
      const plan = localStorage.getItem('subscriptionPlanType');
      this.subscriptionPlanType = plan ? parseInt(plan, 10) : null;
      // this.subscriptionPlanType = 0
      console.log('Subscription Plan Type:', this.subscriptionPlanType);
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
      teamIds
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
    if (destinationLocation) newParams.destinationLocation = destinationLocation;
    if (teamIds) newParams.teamIds = teamIds;
    if (sourceDate) newParams.sourceDate = this.formatDateForAPI(sourceDate);
    if (destinationDate) newParams.destinationDate = this.formatDateForAPI(destinationDate);
  
    console.log('Selected Filters:', newParams)
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
  history.replaceState(null, '', `${window.location.pathname}?${queryParams.toString()}`);


    // if (this.params) uri = this.commonService.getAPIUriFromParams(this.params);
    // APIparams = {
    //   apiKey: AppSettings.APIsNameArray.AVAILIBILITY.LIST,
    //   uri: uri,
    // };
     // Step 5: Call API
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
            const existingIds = new Set(this.dataSource.data.map(item => item.id));
            const uniqueData = newData.filter(item => !existingIds.has(item.id));
            this.dataSource.data = [...this.dataSource.data, ...uniqueData];
          }
  
          console.log(ServerRes,"799", this.dataSource.data)
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
  // Profile analytics table
  displayedColumns: string[] = ['loadId', 'truckName', 'carrierInformation', 'pickup', 'dropOff', 'distance', 'frequency', 'equipmentType', 'shipmentType', 'costPerMile', 'notes'];
  // dataSource = [
  //   { loadId: '001',
  //     truckName: 'Truck Name',
  //     carrierInformation: 'Carrier info',
  //     pickup: 'Alachua, Florida, US',
  //     dropOff: 'Alachua, Florida, US',
  //     distance: '1234',
  //     frequency: 'Every Day',
  //     frequencyPicTime: '01 PM',
  //     frequencyDropTime: '08 PM',
  //     equipmentType: 'Auto Carrier Trailer',
  //     shipmentType: 'LTL',
  //     shipmentTypeInfo: 'Less Than Truckload',
  //     costPerMile: '2',
  //     weight: '1,750',
  //     length: '44',
  //     notes: 'Notes'
  //   },
  //   { loadId: '002',
  //     truckName: 'Truck Name',
  //     carrierInformation: 'Carrier info',
  //     pickup: 'Apple Valley, CA, US',
  //     dropOff: 'Alachua, Florida, US',
  //     distance: '1234',
  //     frequency: 'Every Week',
  //     frequencyPicTime: 'Monday 01 PM',
  //     frequencyDropTime: 'Tuesday 04 PM',
  //     equipmentType: 'Box Truck',
  //     shipmentType: 'FTL',
  //     shipmentTypeInfo: 'Full Truckload',
  //     costPerMile: '2.270',
  //     weight: '14,000',
  //     length: '26',
  //     notes: 'Notes'
  //   },
  // ];
  
  // Advanced filter toggle
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
}
