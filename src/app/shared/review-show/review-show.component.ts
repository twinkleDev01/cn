import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

export interface DialogData {
  openPop: string;
}

@Component({
  selector: 'app-review-show',
  templateUrl: './review-show.component.html',
  styleUrls: ['./review-show.component.css']
})

export class ReviewShowComponent implements OnInit {
  @Input() averageRating: any;
  public totalValue: any;
  public rating: any;
  public avgRating: any;
  public ratingEmpty: any;

  constructor(
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    if (this.averageRating !== undefined) {
      this.totalValue = (this.averageRating * 20 + '%');
    }
  }

}
