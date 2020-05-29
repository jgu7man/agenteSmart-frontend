import { Component, OnInit } from '@angular/core';
import { AlertMsgModel } from './models/alert-msg.model';
import { AlertAskModel } from "./models/alert-ask.model";
import { AlertService } from './alert.service';

@Component({
  selector: 'aSmart-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  msg: AlertMsgModel
  ask: AlertAskModel
  constructor (
    private _alert: AlertService
  ) {
    this.msg = new AlertMsgModel( '' )
    this.ask = new AlertAskModel( '' )
   }

  ngOnInit() {
  }


  onNoClick() {
    
  }
}
