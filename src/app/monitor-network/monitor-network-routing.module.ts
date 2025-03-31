import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../commons/guard/auth.guard';
import { BrokerAlertComponent } from './broker-alert/broker-alert.component';
import { CarrierAlertComponent } from './carrier-alert/carrier-alert.component';
import { AuthorityAlertComponent } from './authority-alert/authority-alert.component';
import { InsuranceAlertComponent } from './insurance-alert/insurance-alert.component';

const routes: Routes = [
  { path: 'monitor-network/broker-alert', component: BrokerAlertComponent, canActivate : [AuthGuard] },
  { path: 'monitor-network/carrier-alert', component: CarrierAlertComponent, canActivate : [AuthGuard] },
  { path: 'monitor-network/authority-alert', component: AuthorityAlertComponent, canActivate : [AuthGuard] },
  { path: 'monitor-network/insurance-alert', component: InsuranceAlertComponent, canActivate : [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitorNetworkRoutingModule { }
