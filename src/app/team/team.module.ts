import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';

import { TeamRoutingModule } from './team-routing.module';
import { TeamMemberListComponent } from './team-member-list/team-member-list.component';
import { AddMemberComponent } from './add-member/add-member.component';
import { EditMemberComponent } from './edit-member/edit-member.component';


@NgModule({
  declarations: [
    TeamMemberListComponent,
    AddMemberComponent,
    EditMemberComponent
  ],
  imports: [
    CommonModule,
    TeamRoutingModule,
    MaterialModule
  ]
})
export class TeamModule { }
