import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../commons/guard/auth.guard';
import { CarrierDashboardComponent } from './carrier-dashboard/carrier-dashboard.component';
import { BrokerDashboardComponent } from './broker-dashboard/broker-dashboard.component';
import { ShipperDashboardComponent } from './shipper-dashboard/shipper-dashboard.component';
import { DispatcherDashboardComponent } from './dispatcher-dashboard/dispatcher-dashboard.component';

const routes: Routes = [
  { path: 'carrier-dashboard', component: CarrierDashboardComponent, canActivate : [AuthGuard] },
  { path: 'broker-dashboard', component: BrokerDashboardComponent, canActivate : [AuthGuard] },
  { path: 'shipper-dashboard', component: ShipperDashboardComponent, canActivate : [AuthGuard] },
  { path: 'dispatcher-dashboard', component: DispatcherDashboardComponent, canActivate : [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
