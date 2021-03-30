import { Component, OnInit } from '@angular/core';
import { GdevAlert } from 'src/app/gdev-tools/src/lib/alert/alert.service';
import { IntegracionesService } from '../integraciones.service';
import { WhatsappStatus } from './messenger.model';
import { GdevLoading } from '../../../../../../gdev-tools/src/lib/loading/loading.service';

@Component({
  selector: 'aSmart-whatsapp-int',
  templateUrl: './whatsapp-int.component.html',
  styleUrls: ['./whatsapp-int.component.scss']
})
export class WhatsappIntComponent implements OnInit {

  waCode: string
  waStatus: WhatsappStatus
  waConnection: boolean
  constructor (
    private _integration: IntegracionesService,
    private _alert: GdevAlert,
    private _loading: GdevLoading
  ) {
    this.waStatus = {
      status: 'DISCONNECTED',
      qr:''
    }
  }

  ngOnInit(): void {
    this._integration.listenQRCode().subscribe( data => {
        console.log( data )
        if ( data ) {
            this.waStatus = data
            if ( this.waStatus.status == 'DISCONNECTED' && !this.waStatus.qr ) {
              this.waConnection = false
              }
        }
    })
  }

  disableRequestCode() {
    if ( this.waConnection ) {
      return true
    } else if ( this.waStatus && this.waStatus.qr ) {
      return true
    }
  }



  requestCode() {
    this.waConnection = true
    // this._loading.toggleWaitingSpinner(true)
    this._integration.getQRCode().subscribe(
      response => {
        console.log( response )
        if ( response.type === 'error' ){
          this._alert.sendMessageAlert( response.message )
          this.waConnection = false
        }

        else if (response.type === 'ok') {
          this._loading.toggleWaitingSpinner('close')
        }

      },
      error => {
        console.error( error );
        this._loading.toggleWaitingSpinner('close')
        if ( this.waStatus.status == 'DISCONNECTED' ) {
          this._integration.disconnect()
          // console.log( 'Se agotó el tiempo de espera' )
          // this._alert.sendMessageAlert('Se agotó el tiempo de espera')
        } else {
          this._integration.clearQR()
        }
      }
    )
  }

}
