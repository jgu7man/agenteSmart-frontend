import { Component, OnInit } from '@angular/core';
import { GdevCache } from 'src/app/gdev-tools/src/lib/cache/gdev-cache.service';
import { GdevAlert } from 'src/app/gdev-tools/src/lib/alert/alert.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { IntegracionesService } from '../integraciones.service';
import { MessengerStatus } from './messenger.model';

@Component( {
    selector: 'aSmart-messenger-int',
    templateUrl: './messenger-int.component.html',
    styleUrls: [ './messenger-int.component.scss' ]
} )
export class MessengerIntComponent implements OnInit {

    projectId: string
    msnStatus: MessengerStatus
    constructor (
        private copy: Clipboard,
        private _cache: GdevCache,
    private _alert: GdevAlert,
    public _integration: IntegracionesService
  ) {
    this.projectId = this._cache.getDataKey( 'projectId' );
    this.msnStatus = new MessengerStatus('',false)
   }

  ngOnInit(): void {
    this._integration.getMessengerOptions()
      .subscribe( data => {
          console.log( data )
          if ( data ) {
              this.msnStatus = data
          }
      } )
  }


    savePageAccessToken() {
        this._integration.saveMessengerPageAccessToken( this.msnStatus.page_access_token)
    }

  copyMessenger( field: 'URL' | 'ID' ) {

    this.copy.copy( field === 'URL'
      ? `https://api.agentesmart.com/messenger/${ this.projectId }`
      : this.projectId
    )
    this._alert.sendFloatNotification('Copiado')
  }

}
