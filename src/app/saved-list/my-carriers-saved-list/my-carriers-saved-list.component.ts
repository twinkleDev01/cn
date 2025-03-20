import { Component, HostListener, OnInit } from '@angular/core';
import { AlertService } from 'src/app/commons/service/alert.service';
import { AppSettings } from '../../commons/setting/app_setting';
import { PopupComponent } from 'src/app/shared/popup/popup.component';
import { CommonService } from 'src/app/commons/service/common.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-carriers-saved-list',
  templateUrl: './my-carriers-saved-list.component.html',
  styleUrls: ['./my-carriers-saved-list.component.css']
})
export class MyCarriersSavedListComponent {
  carrierList: any=[];
  public page = 1;
  public totalPage = 1;
  public totalRecords: any;
  public spinnerLoader = false;
  public dataNotFound = false;
  carrierListLength: any;
  public skeletonLoader:boolean =false;
  public seeCarrierList:boolean=false;
  public getTotalHeight:any;
  public loading=false;
  carrierListData: any;
  constructor(public alertService: AlertService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private router: Router,) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    this.getTotalHeight = window.innerHeight + window.scrollY;
    if ($(window).scrollTop() + 1 >= $(document).height() - $(window).height()) {
      if (this.page !== this.totalPage && this.page >= 1 && this.totalPage && this.carrierList.length > 0) {
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
    this.skeletonLoader = true;
    this.getSaveCarrierList()
  }

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  getSaveCarrierList() {
    this.page=1;
    this.skeletonLoader = true;
    let uri = null;
    let newParams = {
      limit: '8',
      page: '1'

    };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.SAVECARRIRLIST.LIST,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.carrierList = ServerRes.response?.saveListData;
        this.totalPage = ServerRes.response?.totalPages;
        this.totalRecords = ServerRes.response?.totalRecords;

        this.skeletonLoader = false;
      } else {
        this.carrierList = [];
        this.skeletonLoader = false;
      }
    }, (error) => {
      this.carrierList = [];
      this.skeletonLoader = false;
    });
  }

  viewList(myListData: any) {
    this.router.navigateByUrl('my-saved-carrier-list' + '/' + myListData?.id)
  }

  confirmListDelete(id: any, index: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      // backdropClass: AppSettings.backdropClass,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: {
        openPop: 'removeSaveCarrierList',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'ok') {
        let saveCarrierList = this.carrierList?.findIndex(id => {
          id === id
        });
        if (saveCarrierList) {
          this.deleteList(id, saveCarrierList)
        }
      }
    });
  }

  // save-list/delete
  deleteList(id: any, saveCarrierList) {
    this.loading = true;
    let uri = null;
    let newParams = {
      listId: id,
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.SAVECARRIRLIST.DELETE,
      uri: uri,
    };
    this.commonService.delete(APIparams).subscribe(
      (success) => {
        if (success.success === true) {
          this.loading = false;
          this.carrierList.splice(this.carrierList.indexOf(saveCarrierList), 1);
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            'Remove Saved Carrier',
            'You have successfully removed saved carrier.'
          );
          this.page = 1;
        this.carrierList = [];

          this.getSaveCarrierList();
          

        } else if (success.success === false) {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_d',
            'cancel',
            'Remove Saved Carrier',
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
        this.loading = false;
      }
    );
  }

  editListName(noteId: any, listName: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      // backdropClass: AppSettings.backdropClass,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: {
        openPop: 'editCarrierList',
        listId: noteId,
        listName: listName,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'ok') {
        this.getSaveCarrierList()
      }
    });
  }

  addNotes(id: any, saveListData: any) {
    if (saveListData) {
      const dialogRef = this.dialog.open(PopupComponent, {
        disableClose: true,
        // backdropClass: AppSettings.backdropClass,
        backdropClass: 'cn_custom_popup',
        width: '460px',
        data: {
          openPop: 'editNote',
          carrierId: saveListData?.carrierId,
          note: saveListData?.note,
          noteId: saveListData?.noteId,
          userId: saveListData?.userId
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.event == 'ok') {
          this.getSaveCarrierList();
        }
      });
    }
    else {
      const dialogRef = this.dialog.open(PopupComponent, {
        disableClose: true,
        // backdropClass: AppSettings.backdropClass,
        backdropClass: 'cn_custom_popup',
        width: '460px',
        data: {
          openPop: 'addNote',
          carrierId: id
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.event == 'ok') {
          this.getSaveCarrierList();
        }
      });
    }
  }

  addNewSaveList() {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      // backdropClass: AppSettings.backdropClass,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: {
        openPop: 'createCarrierList',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'ok') {
        this.getSaveCarrierList()
      }
    });
  }

  UTCDate(date: any) {
    date = new Date(date + ' ' + 'UTC');
    return date;
  }


  getAPIParam() {
    let APIparams, params;
    params = { limit: 8, page: this.page, };
    let url;
    url = AppSettings.APIsNameArray.SAVECARRIRLIST.LIST;
    APIparams = {
      apiKey: url,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }

  getMoreData() {
    var APIparams = this.getAPIParam();
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      let result = ServerRes.response.saveListData;
      this.spinnerLoader = false;
      if (
        ServerRes.response.saveListData &&
        ServerRes.response.saveListData?.length > 0
      ) {
        for (let v = 0; v < result.length; v++) {
          if (result[v]) this.carrierList.push(result[v]);
        }
      }
    });
  }

 
}

