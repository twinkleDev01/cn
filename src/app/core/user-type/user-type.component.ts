import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../commons/service/shared.service';

@Component({
  selector: 'app-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.css']
})

export class UserTypeComponent implements OnInit {
  public userTypeForm : FormGroup;
  public checkUserType:any='BROKER';
  public emtpyData=false;
  public loaderSearch :boolean = false;
  public cityData : any = [];
  public searchData : any;
  public searchDataCity :any;
  public submitted=false;
  public getDotNumberId : any;
  public payType :any;
  public premium:any
  public carrier:boolean=false;
  public afterLoginNoContant = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public sharedService: SharedService,
    public location: Location) { }
  
  ngOnInit(): void {
    this.sharedService.updateUserType.next(null);
    this.userTypeForm = this.formBuilder.group({
      userType: ['BROKER', [Validators.required]],

    });
    // this.premium =this.route.snapshot.routeConfig['path'].slice(18, 25);
    // this.payType = this.route.snapshot.queryParams['payType'];
    // if(this.route.snapshot.routeConfig['path'].slice(18, 25) =='premium' && this.route.snapshot.queryParams['payType']){
    //   localStorage.setItem('isPremium',this.premium)
    //   localStorage.setItem('payType',this.payType)
    //   this.carrier=false;
    // }
    // else{
    //   this.carrier=true;

    // }
    if(localStorage.getItem('login_type') == 'after_login'){
      this.afterLoginNoContant = true
    }else{
    localStorage.removeItem('user_type');

    }

  }
 
  radioChange(event){
    this.checkUserType = event.value;    
  }
  
 
  userFormSubmit({value,valid}){
    this.submitted = true; 
    if(valid){  
      this.sharedService.updateUserType.next(value.userType);
      if(value.userType=='BROKER'){
        this.router.navigateByUrl('/broker-profile-claim');
        localStorage.setItem('user_type',value.userType)
      }else if(value.userType=='SHIPPER'){
        this.router.navigateByUrl('/shipper-sign-up');
        localStorage.setItem('user_type',value.userType)
      }else if(value.userType=='DISPATCHER'){
        this.router.navigateByUrl('/dispatcher-sign-up');
        localStorage.setItem('user_type',value.userType)
      }else if(value.userType=='SELLER'){
        this.router.navigateByUrl('/seller-sign-up');
        localStorage.setItem('user_type',value.userType)
      }else if(value.userType=='CARRIER'){
        this.router.navigateByUrl('/carrier-profile-claim');
        localStorage.setItem('user_type',value.userType)
      }
    }
  }


 
  
}
