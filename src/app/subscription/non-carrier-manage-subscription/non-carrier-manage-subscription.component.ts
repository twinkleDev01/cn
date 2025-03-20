import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../commons/service/alert.service';
import { CommonService } from '../../commons/service/common.service';
import { SharedService } from '../../commons/service/shared.service';

@Component({
  selector: 'app-non-carrier-manage-subscription',
  templateUrl: './non-carrier-manage-subscription.component.html',
  styleUrls: ['./non-carrier-manage-subscription.component.css']
})

export class NonCarrierManageSubscriptionComponent implements OnInit {
  public getUserData: any;
  public userType: any;
  public managePage = "subscription";
  public sketeloader = false;

  constructor( private commonService: CommonService,
    public alertService: AlertService,
    private sharedService: SharedService,) { }

  ngOnInit(): void {
    this.sketeloader = true;
    this.getUserProfile();
   
  }
  getUserProfile() {
    let uri = null;
    let newParams = {};
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: this.sharedService.getUrl(),
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      this.sketeloader = false;
      if (ServerRes.success === true) {
        this.getUserData = ServerRes.response;
        this.sketeloader=false;
        this.sharedService.setInfo(ServerRes.response);
        this.sharedService.userDataPass.next(ServerRes.response);
      }
    });
  }

}