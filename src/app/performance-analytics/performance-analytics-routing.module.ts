import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../commons/guard/auth.guard';

import { ProfileAnalyticsComponent } from './profile-analytics/profile-analytics.component';
import { ContactLeadComponent } from './contact-lead/contact-lead.component';

const routes: Routes = [
    { path: 'profile', component: ProfileAnalyticsComponent, canActivate : [AuthGuard] },
    { path: 'contact-lead', component: ContactLeadComponent, canActivate : [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceAnalyticsRoutingModule { }
