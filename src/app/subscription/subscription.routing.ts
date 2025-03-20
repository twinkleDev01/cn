import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageSubscriptionComponent } from './manage-subscription/manage-subscription.component';
import { SubscriptionHistoryComponent } from './subscription-history/subscription-history.component';
import { NonCarrierManageSubscriptionComponent } from './non-carrier-manage-subscription/non-carrier-manage-subscription.component';
import { SubscriptionPlanComponent } from './subscription-plan/subscription-plan.component';
import { BuySubscriptionComponent } from './buy-subscription/buy-subscription.component';
import { AuthGuard } from '../commons/guard/auth.guard';
const routes: Routes = [
  {
    path: 'manage',
    component: ManageSubscriptionComponent,
  },
 
  {
    path: 'plan',
    component: SubscriptionPlanComponent,
  },
  
  {
    path: 'user-manage',
    component: NonCarrierManageSubscriptionComponent,
  },
 
  {
    path: 'history',
    component: SubscriptionHistoryComponent,
  },
  {
    path: 'business-plan-purchase',
    component: BuySubscriptionComponent,
  },
  {
    path: 'upgrade-premium',
    component: BuySubscriptionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'business-plan/:type',
    component: BuySubscriptionComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionRoutingModule { }
