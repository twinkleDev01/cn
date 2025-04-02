import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parking-profile',
  templateUrl: './parking-profile.component.html',
  styleUrls: ['./parking-profile.component.scss']
})
export class ParkingProfileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  openReviewsTab(event: Event): void {
    event.preventDefault(); // Prevent default behavior
  }

}
