import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';

@Component({
  selector: 'app-invite-review',
  templateUrl: './invite-review.component.html',
  styleUrls: ['./invite-review.component.css']
})
export class InviteReviewComponent implements OnInit {
  public getReview :any;
  public skeletonLoader=false;
  public rating:any;
  public isRatingHalf:any;
  public ratingEmpty:any;
  public inviteReviewForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    public alertService: AlertService,
    public dialog: MatDialog,
  
    ) { }

    
  ngOnInit(): void {
    this.skeletonLoader=true;  
    this.getReviewSummary();

    this.inviteReviewForm = this.formBuilder.group({
      email: ['',[Validators.required,Validators.email,Validators.maxLength(128),Validators.pattern(AppSettings.emailPattern)],],
      firstName: ['',[Validators.required, Validators.maxLength(64)],],
      lastName: ['',[Validators.required, Validators.maxLength(64)],],
    });
  }

  inviteReview(numberOfCount) {
    localStorage.setItem('numberOfCount',numberOfCount)
    this.router.navigate(['review/invite-for-review/invite'])
  }

  getReviewSummary() {
    let uri = null;
    let newParams = {};
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.REVIEW.REVIEWSUMMARY,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.skeletonLoader = false;
        this.getReview = ServerRes.response;
        if(this.getReview.averageRatings) {
          const ratingWholeNumber = Math.floor(this.getReview.averageRatings);
          const decimalNumber = this.getReview.averageRatings - ratingWholeNumber;
          this.rating = Array(ratingWholeNumber).fill(1).map((x, i) => i + 1);
          this.isRatingHalf = decimalNumber > 0 ? true : false;
          const emptyStar = 5 - ratingWholeNumber - (this.isRatingHalf ? 1 : 0);
          this.ratingEmpty = Array(emptyStar).fill(1).map((x, i) => i + 1);
        }
      }else{
        this.skeletonLoader = false;
        this.getReview = null;
      }
    });
  }
  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }
}



