import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionPopupComponent } from 'src/app/shared/subscription-popup/subscription-popup.component';
import { PopupComponent } from 'src/app/shared/popup/popup.component';
import { SharedService } from 'src/app/commons/service/shared.service';

@Component({
  selector: 'app-media-gallery',
  templateUrl: './media-gallery.component.html',
  styleUrls: ['./media-gallery.component.css']
})
export class MediaGalleryComponent implements OnInit {
  public currentTab ='imageTab';
  public skeletonLoader = false;
  public userId :any;
  public getUserData:any;
  public checkPlan:boolean=false;

  constructor(
    public alertService: AlertService,
    private sharedService: SharedService,
    public dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    let userDetail;
    userDetail = this.sharedService.getInfo();     
    if (userDetail !== null) {
      this.getUserData = userDetail;
      if(this.getUserData){
        this.userInfo(this.getUserData);
      }
    }    
    this.sharedService.userDataPass.subscribe((userData) => {
      if (userData && this.getUserData === undefined) {
        this.userInfo(userData);
      }
    });
  }

  onTabChanged(event: any) {
    if (event.target.innerText === 'Add images') {
       this.currentTab="imageTab";
      } else if (event.target.innerText === 'Add documents') {
      this.currentTab="pdfTab";
    } else if (event.target.innerText === 'Add Videos') {
      this.currentTab="videoTab";
    }
  }

  userInfo(userDtail) {
    this.getUserData = userDtail;
       if(this.getUserData && this.getUserData?.subscriptionPlanType=='BUSINESS' || this.getUserData?.subscriptionPlanType=='STARTER'){
      this.checkPlan=false;
    }else{
      this.checkPlan=true;

    }
  }

   multiImageUpload(event,type) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: AppSettings.backdropClass,
      width: "670px",
      data: { openPop: type },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "Ok") {
        // this.getData();
      }
    });
  }

   subscriptionUpgrade(){
     const dialogRef = this.dialog.open(SubscriptionPopupComponent, {
       disableClose: true,
       backdropClass: 'cn_custom_popup',
       width: '1000px',
       data: { openPop: 'freePlan', type:'checkPremium'},
     });
     dialogRef.afterClosed().subscribe((result) => {
       if (result.event === 'ok') {
       }
     });
    }
   
 }
