import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { MonitorNetworkRoutingModule } from './monitor-network-routing.module';
import { BrokerAlertComponent } from './broker-alert/broker-alert.component';
import { CarrierAlertComponent } from './carrier-alert/carrier-alert.component';
import { AuthorityAlertComponent } from './authority-alert/authority-alert.component';
import { InsuranceAlertComponent } from './insurance-alert/insurance-alert.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    BrokerAlertComponent,
    CarrierAlertComponent,
    AuthorityAlertComponent,
    InsuranceAlertComponent
  ],
  imports: [
    CommonModule,
    MonitorNetworkRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule

  ]
})
export class MonitorNetworkModule { }
