import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../commons/guard/auth.guard';
import { BusinessComponent } from './carrier-profile/business/business.component';
import { ContactInfoComponent } from './carrier-profile/contact-info/contact-info.component';
import { LanesRegionsComponent } from './carrier-profile/lanes-regions/lanes-regions.component';
import { MediaGalleryComponent } from './carrier-profile/media-gallery/media-gallery.component';
import { ProfileComponent } from './carrier-profile/profile/profile.component';
import { RecentProfileViewsComponent } from './carrier-profile/recent-profile-views/recent-profile-views.component';
import { NonCarrierBusinessComponent } from './non-carrier-profile/non-carrier-business/non-carrier-business.component';
import { NonCarrierLanesRegionsComponent } from './non-carrier-profile/non-carrier-lanes-regions/non-carrier-lanes-regions.component';
import { NonCarrierOverviewComponent } from './non-carrier-profile/non-carrier-overview/non-carrier-overview.component';
import { NonRecentCarrierListComponent } from './non-carrier-profile/non-recent-carrier-list/non-recent-carrier-list.component';
import { BrokerProfile } from './broker-profile/profile/profile.component';
import { BrokerBusinessComponent } from './broker-profile/business/business.component';
import { BrokerLanesRegionsComponent } from './broker-profile/lanes-regions/lanes-regions.component';
import { BrokerRecentProfileViewsComponent } from './broker-profile/recent-profile-views/recent-profile-views.component';
import { BrokerContactInfoComponent } from './broker-profile/contact-info/contact-info.component';
import { AuthorityComponent } from './carrier-profile/authority/authority.component';
import { InsurenceComponent } from './carrier-profile/insurence/insurence.component';
import { BrokerAuthorityComponent } from './broker-profile/broker-authority/broker-authority.component';
import { BrokerInsuranceComponent } from './broker-profile/broker-insurance/broker-insurance.component';

const routes: Routes = [
  {
    path: 'authority-insights',
    component: AuthorityComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'insurance-insights',
    component: InsurenceComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
   {
    path: 'authority-insights',
    component: BrokerAuthorityComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'insurance-insights',
    component:BrokerInsuranceComponent ,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'overview',
    component: ProfileComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'overview',
    component: BrokerProfile,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'overview',
    component: NonCarrierOverviewComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'business-information',
    component: BusinessComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'business-information',
    component: BrokerBusinessComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path:'business-information',
    component: NonCarrierBusinessComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },

  {
    path: 'contact-information',
    component: ContactInfoComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'contact-information',
    component: BrokerContactInfoComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'lanes-regions-terminals',
    component: LanesRegionsComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'lanes-regions-terminals',
    component: BrokerLanesRegionsComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'non-carrier-lanes-regions',
    component: NonCarrierLanesRegionsComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'recent-profile-views',
    component: RecentProfileViewsComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'broker-recent-profile-views',
    component: BrokerRecentProfileViewsComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
 
  {
    path: 'media-gallery',
    component: MediaGalleryComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },

  {
    path: 'non-carrier-recent-views',
    component: NonRecentCarrierListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  
  // {
  //   path : 'insurance',
  //   component : InsuranceComponent,
  //   pathMatch : 'full',
  //   canActivate: [AuthGuard],
  // },
  {
    path : 'settings',
    // component : SelfUpdateComponent,
    pathMatch : 'full',
    canActivate: [AuthGuard],
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule { }
