import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestedLoadComponent } from './requested-load/requested-load.component';
import { AuthGuard } from '../commons/guard/auth.guard';
import { ReceivedLoadComponent } from './received-load/received-load.component';

const routes: Routes = [
  { path: 'received-load', component: ReceivedLoadComponent, canActivate : [AuthGuard] },
  { path: 'requested-load', component: RequestedLoadComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoadQuoteRoutingModule { }
