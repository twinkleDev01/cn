import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyCarriersSavedNotesComponent } from './my-carriers-saved-notes/my-carriers-saved-notes.component';
import { AuthGuard } from '../commons/guard/auth.guard';
import { MyCarriersSavedListComponent } from './my-carriers-saved-list/my-carriers-saved-list.component';
import { MyCarriersListComponent } from './my-carriers-list/my-carriers-list.component';

const routes: Routes = [
    {
    path: 'my-saved-notes',
    component: MyCarriersSavedNotesComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'my-saved-carriers',
    component: MyCarriersSavedListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },

  {
    path: 'my-saved-carrier-list/:Id',
    component: MyCarriersListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SavedListRoutingModule { }
