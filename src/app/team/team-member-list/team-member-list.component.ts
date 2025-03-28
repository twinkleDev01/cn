import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from 'src/app/shared/popup/popup.component';

@Component({
  selector: 'app-team-member-list',
  templateUrl: './team-member-list.component.html',
  styleUrls: ['./team-member-list.component.scss']
})
export class TeamMemberListComponent implements OnInit {
  showAdvancedFilter = false;

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  deleteTeamMember(type:any){
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: "460px",
      data: {
        openPop: 'deleteMember',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "Ok") {
      }
    });
  }

  // Profile analytics table
  displayedColumns: string[] = ['name', 'email', 'status', 'permission', 'action'];
  dataSource = [
    { name: 'Alison Parkar',
      email: 'test@gmail.com',
      phone: '+1 1234567890',
      status: 'Active',
      active_class: 'txt_s',
      permission: 'Dashboard, Browse History, Edit Profile',
    },
    { name: 'Victoria Parkar',
      email: '01@gmail.com',
      phone: '+1 1234567890',
      status: 'In-active',
      active_class: 'txt_lb',
      permission: 'Dashboard, Browse History',
    },
  ];

  // Advanced filter toggle
  toggleFilter() {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }

}
