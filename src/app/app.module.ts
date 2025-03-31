import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationStrategy, Location, PathLocationStrategy, APP_BASE_HREF} from '@angular/common';
import { SidebarComponent } from './commons/sidebar/sidebar.component';
import { HeaderComponent } from './commons/header/header.component';
import { ProfileTopSectionComponent } from './commons/profile-top-section/profile-top-section.component';
import { TokenInterceptorService } from './commons/service/token-interceptor.service';
import { AppRoutingModule } from './app.routing';
import { SharedModule } from './shared/shared.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SettingModule } from './setting/setting.module';
import { CalculatorModule } from './calculator/calculator.module';
import {DigitalMarketingModule} from './digitalMarketing/digitalMarketing.module'
import { StripeSericeService } from './commons/service/stripeService.service';
import { carrierDataExportsModule } from './carrier-data-exports/carrier-data-exports.module';
import { SharedService } from './commons/service/shared.service';
import { PerformanceAnalyticsModule } from './performance-analytics/performance-analytics.module';
import { BrowseHistoryModule } from './browse-history/browse-history.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MonitorNetworkModule } from './monitor-network/monitor-network.module';
import { ToastrModule } from 'ngx-toastr';


export function initializeApp(sharedService: SharedService) {
  return (): Promise<void> => {
    return new Promise((resolve) => {
      resolve();
    });
  };
}
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    SharedModule,
    NgxSkeletonLoaderModule.forRoot(),
    SettingModule,
    CalculatorModule,
    carrierDataExportsModule,
    DigitalMarketingModule,
    PerformanceAnalyticsModule,
    BrowseHistoryModule,
    DashboardModule,
    MonitorNetworkModule,
    ToastrModule.forRoot({
      timeOut: 3000,         
      positionClass: 'toast-top-right',  
      preventDuplicates: true,  
    }),
  ],
  declarations: [
    AppComponent,
    ProfileTopSectionComponent,
    HeaderComponent,
    SidebarComponent,
  ],
  providers: [

    
    // {
    //   provide: APP_BASE_HREF,
    //   useValue:'/app/'
    //   // useValue: 'https://carriernetwork.ai/app/'
    // },
    
    // SharedService,
    //   { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [SharedService], multi: true },
    //   { provide: APP_BASE_HREF, useFactory: (sharedService: SharedService) => sharedService.getBaseHref(), deps: [SharedService] },
    
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    StripeSericeService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
