import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { UserNotificationComponent } from './user-notification/user-notification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxLoadingModule } from 'ngx-loading';
import { MaterialModule } from '../material.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTreeModule} from '@angular/material/tree'; 
import { SharedModule } from '../shared/shared.module'; 
import {MatExpansionModule} from '@angular/material/expansion';


@NgModule({
  declarations: [
    UserSettingsComponent,
    UserNotificationComponent,
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    NgxLoadingModule,
    MatInputModule,
    MatFormFieldModule,
    MatTreeModule,
    SharedModule,
    MatExpansionModule
  ],
  exports: [
    UserNotificationComponent,
  ]
})
export class SettingModule { }
