import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';

import { PerformanceAnalyticsRoutingModule } from './performance-analytics-routing.module';
import { ProfileAnalyticsComponent } from './profile-analytics/profile-analytics.component';
import { ContactLeadComponent } from './contact-lead/contact-lead.component';

import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    ProfileAnalyticsComponent,
    ContactLeadComponent
  ],
  imports: [
    CommonModule,
    PerformanceAnalyticsRoutingModule,
    MaterialModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ]
})
export class PerformanceAnalyticsModule { }
