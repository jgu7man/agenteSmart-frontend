import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { GdevCache } from 'src/app/gdev-tools/src/lib/cache/gdev-cache.service';
import { catchError, distinct, skip, tap, distinctUntilKeyChanged, map } from 'rxjs/operators';
import { GdevAlert } from 'src/app/gdev-tools/src/lib/alert/alert.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { WhatsappStatus } from './whatsapp-int/messenger.model';
import { MessengerStatus } from './messenger-int/messenger.model';

@Injectable({
  providedIn: 'root'
})
export class IntegracionesService {

  projectId: string
  userId: string
  integrationsPath: string
  url: string = environment.restURL + 'whatsapp'
  wappHost: string = 'ws://localhost:8999'
  wappSocket$: WebSocketSubject<any>
  constructor (
    private _http: HttpClient,
    private _cache: GdevCache,
    private _alert: GdevAlert,
    private _fs: AngularFirestore
  ) {
    this.projectId = this._cache.getDataKey( 'projectId' )
    this.userId = this._cache.getDataKey( 'user' )[ 'uid' ]
    this.integrationsPath = `usuarios/${ this.userId }/agentes/${ this.projectId }/integraciones/`
  }



    saveMessengerPageAccessToken(token: string) {
        this._fs.doc( this.integrationsPath + 'messenger' ).set( {
            page_access_token: token
        }, { merge: true } )
            .then( () => this._alert.sendFloatNotification( 'Token guardado' ) )
            .catch( error => {
            console.error(error);
            this._alert.sendFloatNotification('No se pudo guardar')
        })
    }

  getMessengerOptions() {
    return this._fs.doc<MessengerStatus>
      ( this.integrationsPath + 'messenger' )
      .valueChanges().pipe( skip( 2 ) )
      }


  listenQRCode() {
    return this._fs.doc<WhatsappStatus>( this.integrationsPath+'whatsapp' )
      .valueChanges().pipe( skip( 2 ))
  }

  getQRCode(): Observable<any> {
    this.wappSocket$ = webSocket(`${this.wappHost}/wa-connect?projectId=${this.projectId}`)
    return this.wappSocket$
  }

  disconnect() {
    this._fs.doc( this.integrationsPath+'whatsapp' ).ref.set( { qr: '', status: 'DISCONNECTED' } )
  }

  clearQR() {
    this._fs.doc( this.integrationsPath+'whatsapp' ).ref.set( { qr: ''  }, { merge: true} )
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error( 'Ocurrió un error:', error.error.message );
      this._alert.sendMessageAlert('Ocurrió un error')
    } else {
      this._alert.sendMessageAlert(`Backend returned code ${error.status}`)
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
