import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../commons/guard/auth.guard';
import { TruckingCompaniesComponent } from './trucking-companies/trucking-companies.component';
import { BrokerageCompaniesComponent } from './brokerage-companies/brokerage-companies.component';

const routes: Routes = [
    { path: 'trucking-companies', component: TruckingCompaniesComponent, canActivate : [AuthGuard] },
    { path: 'brokerage-companies', component: BrokerageCompaniesComponent, canActivate : [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrowseHistoryRoutingModule { }
