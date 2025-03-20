import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { StatusSetting } from 'src/app/commons/setting/status_setting';
import { PopupComponent } from 'src/app/shared/popup/popup.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-carriers-saved-notes',
  templateUrl: './my-carriers-saved-notes.component.html',
  styleUrls: ['./my-carriers-saved-notes.component.css']
})
export class MyCarriersSavedNotesComponent {
  public page = 1;
  public totalPage = 1;
  public spinnerLoader = false;
  public carrierOperation:any;
  public totalItems:any;
  public loading:boolean=false;
  public dataNotFound = false;
  public savedNotesList: any=[];
  public carrierOperationName:any;
  public skeletonLoader:boolean =false;
  public userVerification:any
  public seeCarrierList:boolean=false;
  constructor(  public alertService: AlertService,
    private commonService: CommonService,
    public dialog: MatDialog,
    ) { }

    
    @HostListener('window:scroll', ['$event'])
    onWindowScroll(event) {
      if ($(window).scrollTop() + 1 >=$(document).height() - $(window).height()) {
        if (this.page !== this.totalPage && this.page >= 1 && this.totalPage && this.savedNotesList?.length > 0) {
          this.page = this.page + 1;
          this.spinnerLoader = true;
          this.dataNotFound = false;
          this.getMoreData();
        } else if (this.spinnerLoader === false) {
          this.dataNotFound = true;
        }
      }
    }
  ngOnInit(): void {
    this.userVerification = StatusSetting.userVerification;
    this.carrierOperation = StatusSetting.carrierOperation;

    this.skeletonLoader=true;
    this.seeCarrier()
  }

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  seeCarrier(){
    this.skeletonLoader=true
    this.seeCarrierList = true;
        let uri = null;
    let newParams = {
      limit : '4',
      page:this.page,
    };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.SAVECARRIRLIST.SAVECARRIERNOTES,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.savedNotesList = ServerRes?.response?.carrierNotes;
        this.totalPage = ServerRes?.response?.totalPages;
        this.totalItems = ServerRes?.response?.totalItems;
        this.skeletonLoader=false;
        for (let index = 0; index < this.savedNotesList?.length; index++) {
          for (let subIndex = 0; subIndex < this.carrierOperation?.length; subIndex++) {
            if (this.carrierOperation[subIndex].id == this.savedNotesList[index].carrierOperation) {
              this.carrierOperationName = this.carrierOperation[subIndex].name;
            }
          }
        this.skeletonLoader=false;
      }
        this.skeletonLoader=false;
      }else{
        this.savedNotesList = [];
        this.skeletonLoader=false;
      }
    },(error) => {
      this.savedNotesList = [];
      this.skeletonLoader=false;
    });

  }

  UTCDate(date: any) {
    date = new Date(date + ' ' + 'UTC');
    return date;
  }


  getAPIParam() {
    let APIparams, params;
    params = { limit: 4, page: this.page,};
    let url;
    url = AppSettings.APIsNameArray.SAVECARRIRLIST.SAVECARRIERNOTES;
    APIparams = {
      apiKey: url,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }

  getMoreData() {
    var APIparams = this.getAPIParam();
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      
      let result = ServerRes?.response?.carrierNotes;
      this.spinnerLoader = false;
      if (
        ServerRes?.response?.carrierNotes &&
        ServerRes?.response?.carrierNotes.length > 0
      ) {
        for (let v = 0; v < result.length; v++) {
          if (result[v]) this.savedNotesList.push(result[v]);

        }
      }
    });
  }

  addNotes(id: any,myNoteslist:any) {
    if(myNoteslist){
      const dialogRef = this.dialog.open(PopupComponent, {
        disableClose: true,
        // backdropClass: AppSettings.backdropClass,
        backdropClass: 'cn_custom_popup',
        width: '460px',
        data: {
          openPop: 'editNote',
          // carrierId: myNoteslist?.carrierId,
          note : myNoteslist?.note,
          noteId : myNoteslist?.id,
          userId : myNoteslist?.userId
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.event == 'ok') {
          this.page = 1;
          this.savedNotesList = [];

          this.seeCarrier();
        }
      });
    }
    else{
      const dialogRef = this.dialog.open(PopupComponent, {
        disableClose: true,
        // backdropClass: AppSettings.backdropClass,
        backdropClass: 'cn_custom_popup',
        width: '460px',
        data: {
          openPop: 'addNote',
          carrierId:id
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.event == 'ok') {
          this.page = 1;

          this.seeCarrier();
        }
      });
    }

  }

  
  removeNote(myNoteslist:any,index:any,noteId) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      // backdropClass: AppSettings.backdropClass,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: {
        openPop: 'removeNote',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'ok') {      
              this.deleteListItem(myNoteslist,index)
      }
    });
  }

   // save-list/delete
   deleteListItem(showCarrie:any,index){
    this.loading=true;
    let uri =null;
    let newParams = {
      noteId:showCarrie?.id
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.SAVECARRIRLIST.DELETENOTE,
      uri: uri,
    };
    this.commonService.delete(APIparams).subscribe(
      (success) => {
        if (success.success === true) {
          this.loading=false;
          this.savedNotesList[index].note='';
          this.page = 1;
          this.savedNotesList = [];

          this.seeCarrier()
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            'Remove Note',
            'You have successfully removed note.'
          );
         
        } else if (success.success === false) {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_d',
            'cancel',
            'Remove note',
            'There is some issue, Please try again'
          );
        }
      },
      (error) => {
        this.alertService.showNotificationMessage(
          'danger',
          'bottom',
          'left',
          'txt_g',
          'error',
          'Unexpected Error',
          AppSettings.ERROR
        );
        this.loading=false;
      }
    );
  }

  redirectPageCarrier(dotNumber:any,companyName:any){
    let newCompanyName = companyName.replace(/\s/g, '-').toLowerCase();
    window.location.href = environment.domain+"/carrier-profile/"+ dotNumber + "/" + newCompanyName + "/#review";
  }
  
  getFormattedAddress( city, stateCode, zipShort,countryCode){
    let formattedAddress = '';
    const toTitleCase = (str: string) => 
      str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    if (city) {
      formattedAddress += toTitleCase(city.trim());
    }
    if (stateCode) {
      formattedAddress += ', '+ stateCode.trim() ;  // State codes are usually uppercase
    }
    if (zipShort) {
      formattedAddress += ', ' + zipShort.trim();
    }
    if (countryCode) {
      formattedAddress += ', '+ countryCode.trim();
    }
    formattedAddress = formattedAddress.trim();
    formattedAddress = formattedAddress.replace(/\s+,/g, ',');
    return formattedAddress;
  }
}
