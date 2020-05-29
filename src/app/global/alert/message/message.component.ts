import { Component, OnInit, Inject } from '@angular/core';
import { AlertMsgModel } from '../models/alert-msg.model';
import { AlertService } from '../alert.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'aSmart-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {

  constructor (
    public dialogRef: MatDialogRef<MessageComponent>,
    @Inject( MAT_DIALOG_DATA ) public msg: AlertMsgModel
  ) {}

  onOkClick(): void {
    this.dialogRef.close();
  }

}
