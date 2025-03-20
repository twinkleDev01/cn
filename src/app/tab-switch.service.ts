import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'; // Import Subject from rxjs

@Injectable({
  providedIn: 'root'
})
export class TabSwitchService {
  private tabSwitchSource = new Subject<number>(); // Define the Subject
  tabSwitch$ = this.tabSwitchSource.asObservable(); // Create an observable from the Subject

  switchTab(index: number): void {
    this.tabSwitchSource.next(index); // Emit the index to subscribers
  }
}
