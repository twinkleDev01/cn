import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { PopupComponent } from 'src/app/shared/popup/popup.component';

@Component({
  selector: 'app-team-member-list',
  templateUrl: './team-member-list.component.html',
  styleUrls: ['./team-member-list.component.scss']
})
export class TeamMemberListComponent implements OnInit {
  showAdvancedFilter = false;
page=1
isFilterApplied = false;
  searchControl = new FormControl('');
  totalPages: number = 0;
  showScrollSpinner=false
dataSource: MatTableDataSource<any> = new MatTableDataSource();
  constructor(
    public dialog: MatDialog,
     public commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.teamList()
  }


    teamList(resetData: boolean = false): void {
     
      this.showScrollSpinner=true
      let newParams: {
        limit: number;
        page: number;
      } = {
        limit: 8,
        page: this.page,
      };
    
  
  const queryParams = new URLSearchParams();
if (this.page) queryParams.set('page', this.page.toString());
if (newParams.limit) queryParams.set('limit', newParams.limit.toString());
history.replaceState(null, '', `${window.location.pathname}?${queryParams}`);
  const apiKey = AppSettings.APIsNameArray.TEAM.TEAMLIST
  
  // Only call the API if a valid API key is present
  if (apiKey) {
    let APIparams = {
      apiKey: apiKey,
      uri: this.commonService.getAPIUriFromParams(newParams),
    };
      this.commonService.getList(APIparams).subscribe(
        (response) => {
          this.showScrollSpinner=false
          console.log(response)
          this.totalPages = response.response.totalPages;
          if (response && response.response && response.response.teamArray ) {
            const newData = response.response.teamArray;
            if (resetData) {
              this.dataSource.data = newData;
            
            } else {
              const existingIds = new Set(this.dataSource.data.map(item => item.id));
              const uniqueData = newData.filter(item => !existingIds.has(item.id));
              this.dataSource.data = [...this.dataSource.data, ...uniqueData];
             
            }
            
          }
        },
        (error) => {
          this.showScrollSpinner=false
          console.error('Error fetching carriers:', error);
        }
      );
    }}
  
    refresh(){
      this.teamList(true);
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

  displayedColumns: string[] = ['name', 'email', 'status', 'permission', 'action'];
  

  // Advanced filter toggle
  toggleFilter() {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }
  getPermissionNames(permissions: { permissionName: string }[]): string {
    return permissions.map(item => item.permissionName).join(', ');
  }

  applyFilter() {
    const filterValue = this.searchControl.value.trim().toLowerCase();
    
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const firstName = data.firstName?.toLowerCase() || '';
      const lastName = data.lastName?.toLowerCase() || '';
  
      // Check if the filter value matches either firstName or lastName
      // return firstName.includes(filter) || lastName.includes(filter);
      const name = firstName + ' ' + lastName
      // Check if the filter value matches either firstName or lastName
      return name.includes(filter) ;
    };
  
    this.dataSource.filter = filterValue;
    this.isFilterApplied = filterValue.length > 0;
  }

  scrollPoints: number[] = [];  
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const scrollHeight = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    // ✅ Bottom Scroll: Increment page and store scroll point
    if (documentHeight - scrollHeight <= 1) {
      if (this.page < this.totalPages) {
        this.page += 1;
        this.teamList();
        console.log(`Page incremented: ${this.page}`);

        // Store the scroll point where page was incremented
        this.scrollPoints.push(window.scrollY);
      }
    }

    // ✅ Top Scroll: Decrement page if crossing previous scroll point
    if (window.scrollY < (this.scrollPoints[this.scrollPoints.length - 1] || 0)) {
      if (this.page > 1) {
        this.page -= 1;
        this.teamList();
        console.log(`Page decremented: ${this.page}`);
        this.scrollPoints.pop();  // Remove the last point
      }
    }

  }
  
  // @HostListener('window:scroll', ['$event'])
  // onWindowScroll(event: Event) {
  //   const scrollHeight = window.innerHeight + window.scrollY;
  //   const documentHeight = document.documentElement.scrollHeight;
  //   if (documentHeight - scrollHeight <= 1) {
  //     console.log(this.totalPages, this.page, "203")
  //     if (this.page < this.totalPages ){
  //       console.log(this.totalPages, this.page, "205")
  //       this.page += 1;
  //       console.log(this.page, "537")
  //       this.teamList();
  //     }
  //   }
  //   // this.getCurrentPage();
  // }

//   getCurrentPage() {
//     console.log("📌 Debugging Scroll Behavior");
    
//     const tbody = document.querySelector("tbody");
//     const table = document.querySelector("table");
//     const itemsPerPage = 5;
    
//     if (!tbody || !table) return 1; // Ensure elements exist

//     const scrollTop = window.scrollY; // Corrected scroll position
//     const rowHeight = tbody.querySelector("tr")?.clientHeight || 0;

//     if (rowHeight === 0) return 1; // Avoid division by zero

//     // Calculate how many rows are visible on the screen
//     const alreadyLoaded = Math.floor((window.innerHeight - table.offsetTop) / rowHeight) - 1;

//     // Calculate current page
//     let currentPage = Math.floor((scrollTop + table.offsetTop) / (rowHeight  itemsPerPage - alreadyLoaded  rowHeight));

//     // Ensure currentPage never goes out of bounds
//     currentPage = Math.max(1, Math.min(this.totalPages, currentPage));

//     console.log({
//         scrollTop,
//         rowHeight,
//         alreadyLoaded,
//         calculatedPage: currentPage,
//         currentPageBeforeUpdate: this.page,
//     });

//     // ✅ Update the page only if there's an actual change
//     if (this.page !== currentPage) {
//         this.page = currentPage;
//         this.teamList();
//     }

//     return currentPage;
// }

}
