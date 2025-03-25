import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTruckAvailabilityRoutingModule } from './my-truck-availability-routing.module';
import { PostTruckAvailabilityComponent } from './post-truck-availability/post-truck-availability.component';
import { MyTruckAvailabilityComponent } from './my-truck-availability/my-truck-availability.component';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { ProfileRoutingModule } from '../profile/profile.routing';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    PostTruckAvailabilityComponent,
    MyTruckAvailabilityComponent
  ],
  imports: [
    MyTruckAvailabilityRoutingModule,
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
  schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ],
})
export class MyTruckAvailabilityModule { }
