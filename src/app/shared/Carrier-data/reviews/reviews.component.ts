import { Component, OnInit } from '@angular/core';
import { TabSwitchService } from 'src/app/tab-switch.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  constructor(private tabSwitchService: TabSwitchService) {}

  openReviewsTab(event: Event): void {
    event.preventDefault();
    this.tabSwitchService.switchTab(1); // Switch to the "Reviews" tab (index 1)
  }
  ngOnInit(): void {
  }

}
