import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-brokerage-companies',
  templateUrl: './brokerage-companies.component.html',
  styleUrls: ['./brokerage-companies.component.scss']
})
export class BrokerageCompaniesComponent implements OnInit {
  showAdvancedFilter = false;

  displayedColumns: string[] = ['name', 'pageSource', 'profileRank', 'location', 'accessedAt', 'timeSinceAccess'];
  dataSource = [
    { name: 'Jax Logistics LLC',
      pageSource: 'Broker detail',
      profileRank: 1,
      location: '82934, Alachua, Florida',
      accessedAt: '29 Dec, 2023',
      timeSinceAccess: '2 hours ago'
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

  toggleFilter() {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }

}
