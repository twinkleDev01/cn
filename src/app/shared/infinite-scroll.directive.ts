// import {
//   Directive,
//   HostListener,
//   Input,
//   EventEmitter,
//   Output,
// } from '@angular/core';

// @Directive({
//   selector: '[appInfiniteScroll]',
//   exportAs: 'infiniteScroll',
// })
// export class InfiniteScrollDirective {
//   @Input() page: number = 1;
//   @Input() totalPages: number = 1;
//   @Input() loaddedScreens: number = 0;
//   @Input() spinnerLoader: boolean = false;

//   @Output() pageChange = new EventEmitter<number>();
//   @Output() loaddedScreensChange = new EventEmitter<number>();
//   @Output() fetchData = new EventEmitter<void>();
//   @Output() updateParams = new EventEmitter<number>();
//   @HostListener('window:scroll', ['$event'])
//   onWindowScroll(event: Event) {
//     const scrollHeight = window.innerHeight + window.scrollY;
//     const documentHeight = document.documentElement.scrollHeight;

//     if (documentHeight - scrollHeight <= 1) {
//       if (this.page <= this.totalPages && !this.spinnerLoader) {
//         if (this.page <= this.loaddedScreens) {
//           console.log("3222")
//           this.page += 1;
//           this.pageChange.emit(this.page);
//         }
//         console.log(this.totalPages, this.page, this.loaddedScreens, "3444");
//         if (this.totalPages >= this.page && this.loaddedScreens < this.page) {
//           this.fetchData.emit();
//           this.loaddedScreens += 1;
//           this.loaddedScreensChange.emit(this.loaddedScreens);
//         }
//       }
//     }
//     this.getCurrentPage()
//   }
 
//   getCurrentPage() {
//     console.log('📌 Debugging Scroll Behavior');

//     const tbody = document.querySelector('tbody');
//     const table = document.querySelector('table');
//     const itemsPerPage = 10;

//     if (!tbody || !table) return 1; // Ensure elements exist

//     const scrollTop = window.scrollY; // Corrected scroll position
//     const rowHeight = tbody.querySelector('tr')?.clientHeight || 0;

//     if (rowHeight === 0) return 1; // Avoid division by zero

//     // ✅ Keep your alreadyLoaded logic
//     const alreadyLoaded =
//       Math.floor((window.innerHeight - table.offsetTop) / rowHeight);

//     // ✅ Calculate rows scrolled from top of table
//     const scrolledRows = Math.floor((scrollTop - table.offsetTop) / rowHeight);

//     // ✅ Total rows that were effectively passed (visible or not)
//     const adjustedRowIndex = Math.max(0, scrolledRows + alreadyLoaded);

//     // ✅ Calculate page
//     let currentPage = Math.floor(adjustedRowIndex / itemsPerPage) + 1; // Ensure currentPage never goes out of bounds
//     currentPage = Math.max(1, Math.min(this.totalPages, currentPage)) || 1;
//     // console.log('CurrentPage: ' + this.page);
//     // ✅ Update the page only if there's an actual change
//     if (this.page !== currentPage) {
//       this.page = currentPage;
//       this.pageChange.emit(currentPage);
//       this.updateParams.emit(currentPage);
//     }

//     return currentPage;
//   }
// }
import {
  Directive,
  HostListener,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  exportAs: 'infiniteScroll',
})
export class InfiniteScrollDirective {
  @Input() page: number = 1;
  @Input() totalPages: number = 1;
  @Input() loaddedScreens: number = 0;
  @Input() spinnerLoader: boolean = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() loaddedScreensChange = new EventEmitter<number>();
  @Output() fetchData = new EventEmitter<number>();
  @Output() updateParams = new EventEmitter<number>();
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const scrollHeight = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    if (documentHeight - scrollHeight <= 1) {
      if (this.page <= this.totalPages && !this.spinnerLoader) {
        if (this.page <= this.loaddedScreens) {
          console.log('3222');
          this.page += 1;
          this.pageChange.emit(this.page);
        }
        console.log(this.totalPages, this.page, this.loaddedScreens, '3444');
        if (this.totalPages >= this.page && this.loaddedScreens < this.page) {
          this.fetchData.emit(this.page);
          this.loaddedScreens += 1;
          this.loaddedScreensChange.emit(this.loaddedScreens);
        }
      }
    }
    this.getCurrentPage();
  }
  getCurrentPage() {
    console.log('📌 Debugging Scroll Behavior');

    const tbody = document.querySelector('tbody');
    const table = document.querySelector('table');
    const itemsPerPage = 10;

    if (!tbody || !table) return 1; // Ensure elements exist

    const scrollTop = window.scrollY; // Corrected scroll position
    const rowHeight = tbody.querySelector('tr')?.clientHeight || 0;

    if (rowHeight === 0) return 1; // Avoid division by zero

    // ✅ Keep your alreadyLoaded logic
    const alreadyLoaded =
      Math.floor((window.innerHeight - table.offsetTop) / rowHeight);

    // ✅ Calculate rows scrolled from top of table
    const scrolledRows = Math.floor((scrollTop - table.offsetTop) / rowHeight);

    // ✅ Total rows that were effectively passed (visible or not)
    const adjustedRowIndex = Math.max(0, scrolledRows + alreadyLoaded);

    // ✅ Calculate page
    let currentPage = Math.floor(adjustedRowIndex / itemsPerPage) + 1; // Ensure currentPage never goes out of bounds
    currentPage = Math.max(1, Math.min(this.totalPages, currentPage)) || 1;
    // console.log('CurrentPage: ' + this.page);
    // ✅ Update the page only if there's an actual change
    if (this.page !== currentPage) {
      this.page = currentPage;
      this.pageChange.emit(currentPage);
      this.updateParams.emit(currentPage);
    }

    return currentPage;
  }
}
 