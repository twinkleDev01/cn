import { NgModule,CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionRoutingModule } from './subscription.routing';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageSubscriptionComponent } from './manage-subscription/manage-subscription.component';
import { SubscriptionHistoryComponent } from './subscription-history/subscription-history.component';
import { SubscriptionPlanComponent } from './subscription-plan/subscription-plan.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NonCarrierManageSubscriptionComponent } from './non-carrier-manage-subscription/non-carrier-manage-subscription.component';
import { BuySubscriptionComponent } from './buy-subscription/buy-subscription.component';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    NgxSkeletonLoaderModule,
    NgxLoadingModule
  ],
  declarations: [
    ManageSubscriptionComponent,
    SubscriptionHistoryComponent,
    NonCarrierManageSubscriptionComponent,
    SubscriptionPlanComponent,
    BuySubscriptionComponent,
  ],
  schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ],

})
export class SubscriptionModule { }
