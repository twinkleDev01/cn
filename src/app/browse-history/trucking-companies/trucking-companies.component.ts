import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CarrierView } from 'src/app/commons/interface/browse-history';
import { BrowseHistoryService } from 'src/app/commons/service/browse-history.service';

@Component({
  selector: 'app-trucking-companies',
  templateUrl: './trucking-companies.component.html',
  styleUrls: ['./trucking-companies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TruckingCompaniesComponent implements OnInit {
  showAdvancedFilter = false;
  public loading = false;
  errorMessage: string = '';
  displayedColumns: string[] = ['companyName', 'pageSource', 'profileRank', 'location', 'accessedAt', 'timeSinceAccess', 'rowAction'];
  dataSource : MatTableDataSource<CarrierView> = new MatTableDataSource();
  public page = 1;
  carriers: CarrierView[] = [];
  totalRecords: number = 0;
  searchControl = new FormControl('');

  constructor(private browseHistoryService: BrowseHistoryService) { }

  ngOnInit(): void {
    this.fetchCarriers();
    this.setupSearchFilter();
  } 
    fetchCarriers(): void {
      if (this.loading) return;
      this.loading = true;
      this.browseHistoryService.getRecentViewedCarriers(8, this.page).subscribe(
        (response) => {
          if (response && response.response && response.response.data) {
            this.dataSource.data = [...this.dataSource.data, ...response.response.data];
            this.dataSource.data = [...this.dataSource.data];
            console.log(this.dataSource,"54")
            this.loading = false;
          }
        },
        (error) => {
          this.errorMessage = 'Failed to load recent carriers. Please try again.';
          this.loading = false;
          console.error('Error fetching carriers:', error);
        }
      );
    }
    @HostListener('window:scroll', [])
    onScroll(): void {
      const scrollPosition = window.scrollY + window.innerHeight;
      const bottomPosition = document.documentElement.scrollHeight;
      
      if (scrollPosition === bottomPosition && !this.loading) {
        this.page++;
        this.fetchCarriers(); 
      }
    }
    
setupSearchFilter() {
  this.searchControl.valueChanges.subscribe((searchText) => {
    this.dataSource.filter = searchText.trim().toLowerCase();
  });
}

// Apply search filter
applyFilter() {
  this.dataSource.filter = this.searchControl.value.trim().toLowerCase();
}
  calculateTimeSince(timestamp: string): string {
    if (!timestamp) return 'Unknown';
  
    const accessedDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - accessedDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
  
    if (diffDays > 0) return `${diffDays} days ago`;
    if (diffHours > 0) return `${diffHours} hours ago`;
    if (diffMins > 0) return `${diffMins} minutes ago`;
    return 'Just now';
  }
  
  toggleFilter() {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }

}
