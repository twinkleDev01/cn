import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostTruckAvailabilityComponent } from './post-truck-availability/post-truck-availability.component';
import { MyTruckAvailabilityComponent } from './my-truck-availability/my-truck-availability.component';
import { TruckOnDemandComponent } from './truck-on-demand/truck-on-demand.component';
import { AuthGuard } from '../commons/guard/auth.guard';

const routes: Routes = [
  { path: 'my-truck-availability/post-new', component: PostTruckAvailabilityComponent, canActivate : [AuthGuard] },
  { path: 'my-truck-availability', component: MyTruckAvailabilityComponent, canActivate: [AuthGuard] },
  { path: 'truck-on-demand', component: TruckOnDemandComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTruckAvailabilityRoutingModule { }
