import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamMemberListComponent } from './team-member-list/team-member-list.component';
import { AddMemberComponent } from './add-member/add-member.component';
import { EditMemberComponent } from './edit-member/edit-member.component';
import { AuthGuard } from '../commons/guard/auth.guard';

const routes: Routes = [
    { path: 'teams', component: TeamMemberListComponent, canActivate : [AuthGuard] },
    { path: 'teams/add', component: AddMemberComponent, canActivate : [AuthGuard] },
    { path: 'teams/edit', component: EditMemberComponent, canActivate : [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamRoutingModule { }
