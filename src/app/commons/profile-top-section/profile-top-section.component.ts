import { Component, OnInit } from '@angular/core';
import { SharedService } from '../service/shared.service';
@Component({
  selector: 'app-profile-top-section',
  templateUrl: './profile-top-section.component.html',
  styleUrls: ['./profile-top-section.component.css']
})
export class ProfileTopSectionComponent implements OnInit {
  public getUserData:any;
  public userType:any;
  public totalStrenth : any = 0;
  public strengthdisabled = true;
  public max = 100;
  public min = 0;

  constructor(private sharedService: SharedService,) { }

  ngOnInit(): void {
    let userDetail;
    userDetail = this.sharedService.getInfo();
    if (userDetail && userDetail !== null) {
      this.getUserData = userDetail;
      this.userInfo(userDetail);
    }
    
    this.sharedService.userDataPass.subscribe((userData) => {
      this.userInfo(userData);
      if (userData && this.getUserData === undefined) {
        this.userInfo(userData);
      }
    });
  }

  userInfo(userDtail) {
    this.getUserData = userDtail;
    let newLength:any;
    newLength  = this.sharedService.otherUserStrenth(userDtail);
    this.totalStrenth=newLength.totalth;
  }

  showStrength(totalStrenth: any) {
    return Math.round(totalStrenth);
  }

}
