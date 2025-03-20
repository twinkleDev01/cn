import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './commons/guard/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./core/core.module').then((mod) => mod.CoreModule),
  },
  // {
  //   path: 'dashboard',canActivate : [AuthGuard],
  //   loadChildren: () =>
  //     import('./dashboard/dashboard.module').then((mod) => mod.DashboardModule),
  // },
  {
    path: 'profile',canActivate : [AuthGuard],
    loadChildren: () =>
      import('./profile/profile.module').then((mod) => mod.ProfileModule),
  },
  {
    path: 'user',canActivate : [AuthGuard],
    loadChildren: () =>
      import('./setting/setting.module').then((mod) => mod.SettingModule),
  },

  {
    path: 'review', canActivate : [AuthGuard],
    loadChildren: () =>
      import('./reviews/reviews.module').then((mod) => mod.ReviewsModule),
  },
  {
    path: '',canActivate : [AuthGuard],
    loadChildren: () =>
      import('./saved-list/saved-list.module').then((mod) => mod.SavedListModule),
  },
  {
    path: 'subscription',canActivate : [AuthGuard],
    loadChildren: () =>
      import('./subscription/subscription.module').then((mod) => mod.SubscriptionModule),
  },
  {
    path: 'carrier-data-exports',canActivate : [AuthGuard],
    loadChildren: () =>
      import('./carrier-data-exports/carrier-data-exports.module').then((mod) => mod.carrierDataExportsModule),
  },
  {
    path: 'calculator',
    loadChildren: () =>
      import('./calculator/calculator.module').then((mod) => mod.CalculatorModule),
  },
  {
    path: 'digital-marketing',canActivate : [AuthGuard],
    loadChildren: () =>
      import('./digitalMarketing/digitalMarketing.module').then((mod) => mod.DigitalMarketingModule),
  },
  {
    path: '',canActivate : [AuthGuard],
    loadChildren: () =>
      import('./forecast-availability/forecast-availability.module').then((mod) => mod.ForecastAvailabilityModule),
  },
  {
    path: '',canActivate : [AuthGuard],
    loadChildren: () =>
      import('./load-quote/load-quote.module').then((mod) => mod.LoadQuoteModule),
  },
  
  {
    path: 'performance-analytics',canActivate : [AuthGuard],
    loadChildren: () =>
      import('./performance-analytics/performance-analytics.module').then((mod) => mod.PerformanceAnalyticsModule),
  },
  
  {
    path: 'browse-history',canActivate : [AuthGuard],
    loadChildren: () =>
      import('./browse-history/browse-history.module').then((mod) => mod.BrowseHistoryModule),
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes,{scrollPositionRestoration:'enabled'})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
