import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";

import { LoadQuoteRoutingModule } from './load-quote-routing.module';
import { RequestedLoadComponent } from './requested-load/requested-load.component';
import { MaterialModule } from '../material.module';
import { ReceivedLoadComponent } from './received-load/received-load.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ReceivedLoadComponent,
    RequestedLoadComponent
  ],
  imports: [
    CommonModule,
    LoadQuoteRoutingModule,
    NgxSkeletonLoaderModule,
    MaterialModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class LoadQuoteModule { }
