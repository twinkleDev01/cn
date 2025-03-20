import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../commons/service/shared.service';
import { AddCardPopupComponent } from '../add-card-popup/add-card-popup.component';

export interface DialogData {
  openPop: string;
  payTypePrice:any,
  type:any;
}

@Component({
  selector: 'app-common-popup',
  templateUrl: './common-popup.component.html',
  styleUrls: ['./common-popup.component.css']
})

export class CommonPopupComponent  {
  constructor(
    public dialogRef: MatDialogRef<AddCardPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public sharedService: SharedService,
    ) { }

 
  onNoClick(): void {
    this.dialogRef.close({ event: 'fail' });
  }
  successClick(): void {
    this.dialogRef.close({ event: 'success' });
  }
}
