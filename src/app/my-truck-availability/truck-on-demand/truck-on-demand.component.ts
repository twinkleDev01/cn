import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-truck-on-demand',
  templateUrl: './truck-on-demand.component.html',
  styleUrls: ['./truck-on-demand.component.scss']
})
export class TruckOnDemandComponent implements OnInit {
  showAdvancedFilter = false;

  constructor() { }

  ngOnInit(): void {
  }

  // Profile analytics table
  displayedColumns: string[] = ['loadId', 'truckName', 'carrierInformation', 'pickup', 'dropOff', 'distance', 'frequency', 'equipmentType', 'shipmentType', 'costPerMile', 'notes'];
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
      notes: 'Notes'
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
      notes: 'Notes'
    },
  ];
  
  // Advanced filter toggle
  toggleFilter() {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }
}
