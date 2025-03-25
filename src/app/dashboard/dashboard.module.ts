import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard.routing';
import { CarrierDashboardComponent } from './carrier-dashboard/carrier-dashboard.component';
import { BrokerDashboardComponent } from './broker-dashboard/broker-dashboard.component';
import { ShipperDashboardComponent } from './shipper-dashboard/shipper-dashboard.component';
import { DispatcherDashboardComponent } from './dispatcher-dashboard/dispatcher-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule
  ],
  declarations: [
    CarrierDashboardComponent,
    BrokerDashboardComponent,
    ShipperDashboardComponent,
    DispatcherDashboardComponent
  ],

})
export class DashboardModule { }
