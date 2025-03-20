import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  selectedIndex = 0; // Initial tab index

  constructor() {}

  ngOnInit(): void {}

  openReviewsTab(event: Event): void {
    event.preventDefault(); // Prevent default behavior
    this.selectedIndex = 1; // Switch to the "Reviews" tab
  }
}
