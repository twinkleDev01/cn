// added api for broker 
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-received-load',
  templateUrl: './received-load.component.html',
  styleUrls: ['./received-load.component.scss']
})
export class ReceivedLoadComponent implements OnInit {
  public skeletonLoader: boolean = false;
  public carrierUser: any = [];

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
  selectedChart: string = 'topEquipment';

  constructor(
    private commonService: CommonService,
  ) { }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    this.getTotalHeight = window.innerHeight + window.scrollY;
    if (
      $(window).scrollTop() + 1 >=
      $(document).height() - $(window).height()
    ) {
      if (
        this.page !== this.totalPage &&
        this.page >= 1 &&
        this.totalPage &&
        this.carrierUser.length > 0
      ) {
        this.page = this.page + 1;
        this.spinnerLoader = true;
        this.dataNotFound = false;
        this.getMoreData(null);
      } else if (this.spinnerLoader === false) {
        this.dataNotFound = true;
      }
    }
  }


  ngOnInit(): void {
    this.getCarrierUserData();
    this.createShipmentTypeBreakdownChart();
    this.createRecShipmentChart();
  }

  // Progress Bar Percentage calculation
  get totalQuotes(): number {
    return 100;
  }
  get totalMilesCovered(): number {
    return (this.uniqueVisitors / this.totalViews) * 100;
  }
  // get repeatVisitorsPercentage(): number {
  //   return (this.repeatVisitors / this.totalViews) * 100;
  // }
  
   // User dashboard chart
   createShipmentTypeBreakdownChart() {
    const ctx = document.getElementById('recShipmentTypeBreakdown') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['LTL', 'FTL', 'Partial Shipments'],
        datasets: [{
          data: [60, 10, 30],
          backgroundColor: [
            '#4e73df',
            '#1cc88a',
            '#36b9cc'
          ],
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

  // Top Equipment Shipments chart
  ngAfterViewInit() {
    const ctxTopEquipment = document.getElementById('recTopEquipmentShipmentsChart') as HTMLCanvasElement;
    new Chart(ctxTopEquipment, {
      type: 'bar',
      data: {
        labels: ['Auto Carrier Trailer', 'Drayage Trailer', 'Drop Deck Landoll'],
        datasets: [{
          data: [3, 1, 1],
          backgroundColor: [
            'rgba(54, 162, 235 )',
            'rgba(255, 99, 132 )',
            'rgba(75, 192, 192 )'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)'
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
            // max: 100,
            grid: {
              display: true
            },
            // ticks: {
            //   callback: function(value) {
            //     return value + '%';
            //   }
            // }
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

  createRecShipmentChart() {
    const ctxRecShipment = document.getElementById('recBrokeredCarrierShipmentsChart') as HTMLCanvasElement;
    new Chart(ctxRecShipment, {
      type: 'bar',
      data: {
        labels: ['Brokered Loads', 'Carrier Loads'],
        datasets: [{
          data: [4, 3],
          backgroundColor: [
            '#4e73df',
            '#1cc88a'
          ],
          borderColor: [
            '#4e73df',
            '#1cc88a'
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
            // max: 100,
            grid: {
              display: true
            },
            ticks: {
              font: {
                size: window.innerWidth < 768 ? 10 : 12
              },
              // callback: function(value) {
              //   return value + '%';
              // }
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
  displayedColumns: string[] = ['loadId', 'requestedBy', 'pickup', 'dropOff', 'distance', 'equipmentType', 'shipmentType', 'weight', 'length', 'notes', 'action'];
  dataSource = [
    { loadId: '001',
      truckName: 'Truck Name',
      carrierInformation: 'Carrier info',
      pickup: 'Alachua, Florida, US',
      dropOff: 'Alachua, Florida, US',
      distance: '1234',
      frequency: 'Every Day',
      frequencyPicTime: '01 PM',
      frequencyDropTime: '08 PM',
      equipmentType: 'Auto Carrier Trailer',
      shipmentType: 'LTL',
      shipmentTypeInfo: 'Less Than Truckload',
      costPerMile: '2',
      weight: '1,750',
      length: '44',
      notes: 'Notes',
      action: ''
    },
    { loadId: '002',
      truckName: 'Truck Name',
      carrierInformation: 'Carrier info',
      pickup: 'Apple Valley, CA, US',
      dropOff: 'Alachua, Florida, US',
      distance: '1234',
      frequency: 'Every Week',
      frequencyPicTime: 'Monday 01 PM',
      frequencyDropTime: 'Tuesday 04 PM',
      equipmentType: 'Box Truck',
      shipmentType: 'FTL',
      shipmentTypeInfo: 'Full Truckload',
      costPerMile: '2.270',
      weight: '14,000',
      length: '26',
      notes: 'Notes',
      action: ''
    },
    { loadId: '003',
      truckName: 'Truck Name',
      carrierInformation: 'Carrier info',
      pickup: 'Alachua, Florida, US',
      dropOff: 'Alachua, Florida, US',
      distance: '1234',
      frequency: 'Every Month',
      frequencyPicTime: '12 Feb 01 PM',
      frequencyDropTime: '15 Feb 05 PM',
      equipmentType: 'Cargo Van',
      shipmentType: 'Partial Shipments',
      costPerMile: '2.86',
      weight: '4,985',
      length: '20',
      notes: 'Notes',
      action: ''
    },
    { loadId: '004',
      truckName: 'Truck Name',
      carrierInformation: 'Carrier info',
      pickup: 'Alachua, Florida, US',
      dropOff: 'Alachua, Florida, US',
      distance: '1234',
      frequency: 'Only One time',
      frequencyPicTime: '12 Feb, 2025 01 PM',
      frequencyDropTime: '13 Feb, 2025 05 PM',
      equipmentType: 'Double Drop Trailer',
      shipmentType: 'Partial Shipments',
      costPerMile: '1.49',
      weight: '5,200',
      length: '30',
      notes: 'Notes',
      action: ''
    },
  ];
  
  toggleFilter() {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }
  formatFrequency(frequency: string): string {
    if (!frequency) return '';
    return frequency.toLowerCase().replace(/\s+/g, '_');
  }

  getCarrierUserData() {
    let uri = null;
    this.skeletonLoader = true;

    // this.orderDir = this.sortingValue;
    // this.newOld = this.sortingValueNew
    let APIparams, params;
    params = { limit: 5, page: this.page, };
    (this.params.limit = 5), (this.params.page = this.page), (this.params.sort = this.orderDir);

    if (this.params) uri = this.commonService.getAPIUriFromParams(this.params);
    if (localStorage.getItem('user_type') == 'BROKER') {
      APIparams = {
        apiKey: AppSettings.APIsNameArray.LOADQUOTE.BROKERLIST,
        uri: uri,
      };
    }
    else {
      APIparams = {
        apiKey: AppSettings.APIsNameArray.LOADQUOTE.CARRIERLIST,
        uri: uri,
      };
    }

    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.carrierUser = ServerRes.response;
        this.totalRecoads = ServerRes.total;
        this.totalPage = ServerRes.totalPages;
        this.skeletonLoader = false;
      } else {
        this.carrierUser = [];
        this.skeletonLoader = false;
      }
    }, (error) => {
      this.message = error.error.message
      this.carrierUser = [];
      this.skeletonLoader = false;
    });
  }
  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }
  getAPIParam(str) {
    let APIparams, params;
    if (str) params = { limit: 5, page: this.page, sort: this.orderDir };
    else params = { limit: 5, page: this.page, sort: this.orderDir };
    params = { limit: 5, page: this.page, sort: this.orderDir };
    let url;
    if(localStorage.getItem('user_type') == 'BROKER'){
      url = AppSettings.APIsNameArray.LOADQUOTE.BROKERLIST;

    }else{
      url = AppSettings.APIsNameArray.LOADQUOTE.CARRIERLIST;
    }
    APIparams = {
      apiKey: url,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }
  getMoreData(str) {
    var APIparams = this.getAPIParam(str);
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      let result = ServerRes.response;
      this.totalPage = ServerRes.totalPages;
      this.spinnerLoader = false;
      if (
        ServerRes.response &&
        ServerRes.response.length > 0
      ) {
        for (let v = 0; v < result.length; v++) {
          if (result[v]) this.carrierUser.push(result[v]);
        }
      }
    });
  }
}
