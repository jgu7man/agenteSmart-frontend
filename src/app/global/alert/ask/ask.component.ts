import { Component, OnInit, Inject } from '@angular/core';
import { AlertAskModel } from "../models/alert-ask.model";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'aSmart-ask',
  templateUrl: './ask.component.html',
  styleUrls: ['./ask.component.scss']
})
export class AskComponent {

  constructor (
    public dialogRef: MatDialogRef<AskComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: AlertAskModel
  ) { }

  onOkClick(): void {
    this.dialogRef.close();
  }

}
