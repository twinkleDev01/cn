import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insurance-alert',
  templateUrl: './insurance-alert.component.html',
  styleUrls: ['./insurance-alert.component.scss']
})
export class InsuranceAlertComponent implements OnInit {
  showAdvancedFilter = false;
  isChecked = true;

  constructor() { }

  ngOnInit(): void {
  }

  // Profile analytics table
  displayedColumns: string[] = ['alertID', 'policyNumber', 'companyName', 'status', 'createdOn', 'lastEmailsendAt', 'lastUpdated', 'emailExpiryDate', 'action'];
  dataSource = [
    { alertID: '1',
      policyNumber: '123456',
      companyName: 'Alr Logistics Inc',
      status: 'Active',
      createdOn: 'Mar 26, 2025 03:49 PM',
      lastEmailsendAt: 'Mar 26, 2025 04:07 PM	',
      lastUpdated: 'Feb 25, 2025 02:52 PM	',
      emailExpiryDate: 'Feb 28, 2025 02:51 PM	',
      action_vlu: 'Enable',
    },
    { alertID: '2',
      policyNumber: '545654',
      companyName: 'Bhl Logistics Inc',
      status: 'Expired',
      createdOn: 'Mar 26, 2025 03:49 PM',
      lastEmailsendAt: 'Mar 26, 2025 04:07 PM	',
      lastUpdated: 'Feb 25, 2025 02:52 PM	',
      emailExpiryDate: 'Feb 28, 2025 02:51 PM	',
      action_vlu: 'Disable',
    },
  ];

  // Advanced filter toggle
  toggleFilter() {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }

}
