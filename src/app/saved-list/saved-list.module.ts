import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavedListRoutingModule } from './saved-list-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxLoadingModule } from 'ngx-loading';
import { MyCarriersSavedNotesComponent } from './my-carriers-saved-notes/my-carriers-saved-notes.component';
import { MyCarriersSavedListComponent } from './my-carriers-saved-list/my-carriers-saved-list.component';
import { MyCarriersListComponent } from './my-carriers-list/my-carriers-list.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [
    MyCarriersSavedNotesComponent,
    MyCarriersSavedListComponent,
    MyCarriersListComponent,
  ],
  imports: [
    CommonModule,
    SavedListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    NgxSkeletonLoaderModule,
    NgxLoadingModule,
    MatInputModule,
    MatFormFieldModule,
  ]
})
export class SavedListModule { }
