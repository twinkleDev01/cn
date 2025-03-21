import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from '../material.module';

import { BrowseHistoryRoutingModule } from './browse-history-routing.module';
import { TruckingCompaniesComponent } from './trucking-companies/trucking-companies.component';
import { BrokerageCompaniesComponent } from './brokerage-companies/brokerage-companies.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CustomDatePipe } from '../commons/pipe/date.pipe';


@NgModule({
  declarations: [
    TruckingCompaniesComponent,
    BrokerageCompaniesComponent,
    CustomDatePipe
  ],
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowseHistoryRoutingModule
  ],
  providers: [DatePipe],
  // exports: [CustomDatePipe]
})
export class BrowseHistoryModule { }
