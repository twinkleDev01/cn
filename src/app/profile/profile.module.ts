import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile.routing';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxLoadingModule } from 'ngx-loading';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { NonCarrierOverviewComponent } from './non-carrier-profile/non-carrier-overview/non-carrier-overview.component';
import { NonCarrierBusinessComponent } from './non-carrier-profile/non-carrier-business/non-carrier-business.component';
import { NonCarrierLanesRegionsComponent } from './non-carrier-profile/non-carrier-lanes-regions/non-carrier-lanes-regions.component';
import { ProfileComponent } from './carrier-profile/profile/profile.component';
import { BusinessComponent } from './carrier-profile/business/business.component';
import { ContactInfoComponent } from './carrier-profile/contact-info/contact-info.component';
import { LanesRegionsComponent } from './carrier-profile/lanes-regions/lanes-regions.component';
import { RecentProfileViewsComponent } from './carrier-profile/recent-profile-views/recent-profile-views.component';
import { MediaGalleryComponent } from './carrier-profile/media-gallery/media-gallery.component';
import { InsuranceComponent } from './carrier-profile/insurance/insurance.component';
import { NonRecentCarrierListComponent } from './non-carrier-profile/non-recent-carrier-list/non-recent-carrier-list.component';
import { SharedModule } from '../shared/shared.module';
import { BrokerProfile } from './broker-profile/profile/profile.component';
import { BrokerBusinessComponent } from './broker-profile/business/business.component';
import { BrokerLanesRegionsComponent } from './broker-profile/lanes-regions/lanes-regions.component';
import { BrokerRecentProfileViewsComponent } from './broker-profile/recent-profile-views/recent-profile-views.component';
import { BrokerContactInfoComponent } from './broker-profile/contact-info/contact-info.component';
import { AuthorityComponent } from './carrier-profile/authority/authority.component';
import { InsurenceComponent } from './carrier-profile/insurence/insurence.component';
import { BrokerInsuranceComponent } from './broker-profile/broker-insurance/broker-insurance.component';
import { BrokerAuthorityComponent } from './broker-profile/broker-authority/broker-authority.component';
@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    NgxLoadingModule,
    SharedModule
  ],
  declarations: [
    NonCarrierOverviewComponent,
    NonCarrierBusinessComponent,
    NonCarrierLanesRegionsComponent,
    NonRecentCarrierListComponent,
    ProfileUpdateComponent,
    InsuranceComponent,
    MediaGalleryComponent,
    RecentProfileViewsComponent,
    LanesRegionsComponent,
    ContactInfoComponent,
    BusinessComponent,
    ProfileComponent,
    BrokerProfile,
    BrokerBusinessComponent,
    BrokerLanesRegionsComponent,
    BrokerRecentProfileViewsComponent,
    BrokerContactInfoComponent,
    AuthorityComponent,
    InsurenceComponent,
    BrokerInsuranceComponent,
    BrokerAuthorityComponent,
  ],
  schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ],
})
export class ProfileModule { }
