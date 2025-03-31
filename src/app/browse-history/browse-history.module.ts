import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from '../material.module';

import { BrowseHistoryRoutingModule } from './browse-history-routing.module';
import { TruckingCompaniesComponent } from './trucking-companies/trucking-companies.component';
import { BrokerageCompaniesComponent } from './brokerage-companies/brokerage-companies.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CustomDatePipe } from '../commons/pipe/date.pipe';
import { TimeAgoPipe } from '../commons/pipe/time-ago.pipe';
import { UtcDatePipe } from '../commons/pipe/utc-date.pipe';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    TruckingCompaniesComponent,
    BrokerageCompaniesComponent,
    // TimeAgoPipe,
    UtcDatePipe,
  ],
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowseHistoryRoutingModule,
    SharedModule
  ],
  providers: [DatePipe],
  // exports: [CustomDatePipe]
})
export class BrowseHistoryModule { }
