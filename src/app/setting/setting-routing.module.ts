import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { AuthGuard } from '../commons/guard/auth.guard';

const routes: Routes = [
  {
    path : 'settings',
    component : UserSettingsComponent,
    pathMatch : 'full',
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
