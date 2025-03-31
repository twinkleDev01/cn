import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';

import { PerformanceAnalyticsRoutingModule } from './performance-analytics-routing.module';
import { ProfileAnalyticsComponent } from './profile-analytics/profile-analytics.component';
import { ContactLeadComponent } from './contact-lead/contact-lead.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TimeAgoPipe } from '../commons/pipe/time-ago.pipe';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ProfileAnalyticsComponent,
    ContactLeadComponent,
    // TimeAgoPipe
  ],
  imports: [
    CommonModule,
    PerformanceAnalyticsRoutingModule,
    MaterialModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PerformanceAnalyticsModule { }
