import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/gdev-tools/alerts/alert.service';
import { IntegracionesService } from '../integraciones.service';
import { WhatsappStatus } from './messenger.model';

@Component({
  selector: 'aSmart-whatsapp-int',
  templateUrl: './whatsapp-int.component.html',
  styleUrls: ['./whatsapp-int.component.scss']
})
export class WhatsappIntComponent implements OnInit {

  waCode: string
  waStatus: WhatsappStatus
  constructor (
    private _integration: IntegracionesService,
    private _alert: AlertService
  ) { 
    this.waStatus = {
      status: 'DISCONNECTED',
      qr:''
    }
  }

  ngOnInit(): void {
    this._integration.listenQRCode().subscribe( data => {
      console.log( data )
      this.waStatus = data
    })
  }


  requestCode() {
    this._integration.getQRCode().subscribe(
      response => { }, 
      error => {
        if ( this.waStatus.status == 'DISCONNECTED' ) {
          this._integration.disconnect()
          console.log( 'Se agotó el tiempo de espera' )
          this._alert.sendMessageAlert('Se agotó el tiempo de espera')
        } else {
          this._integration.clearQR()
        }
      }
    )
  }

}
