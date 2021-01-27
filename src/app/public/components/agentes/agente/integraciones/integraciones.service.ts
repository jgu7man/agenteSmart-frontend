import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { CacheService } from 'src/app/gdev-tools/cache/cache.service';
import { catchError, distinct, skip, tap, distinctUntilKeyChanged } from 'rxjs/operators';
import { AlertService } from 'src/app/gdev-tools/alerts/alert.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { WhatsappStatus } from './whatsapp-int/messenger.model';

@Injectable({
  providedIn: 'root'
})
export class IntegracionesService {

  projectId: string
  userId: string
  waPath: string
  url: string = environment.restURL + 'whatsapp'
  constructor (
    private _http: HttpClient,
    private _cache: CacheService,
    private _alert: AlertService,
    private _fs: AngularFirestore
  ) {
    this.projectId = this._cache.getDataKey( 'projectId' )
    this.userId = this._cache.getDataKey( 'user' )[ 'uid' ]
    this.waPath = `usuarios/${ this.userId }/agentes/${ this.projectId }/integraciones/whatsapp`
  }


  listenQRCode() {
    console.log( this.userId, this.projectId )
    return this._fs.doc<WhatsappStatus>( this.waPath )
      .valueChanges().pipe( skip( 2 ))
  }

  getQRCode(): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'})
    return this._http.get( `${ this.url }/${ this.projectId }`, { headers: headers } )
  }

  disconnect() {
    this._fs.doc( this.waPath ).ref.set( { qr: '', status: 'DISCONNECTED' } )
  }
  
  clearQR() {
    this._fs.doc( this.waPath ).ref.set( { qr: ''  }, { merge: true} )
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
