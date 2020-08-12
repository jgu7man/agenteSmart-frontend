import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AlertMsgModel } from './models/alert-msg.model';
import { AlertAskModel } from "./models/alert-ask.model";
import { MatDialog } from '@angular/material/dialog';
import { MessageComponent } from './message/message.component';
import { AskComponent } from './ask/ask.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  mensajeAlerta$ = new Subject<AlertMsgModel>()
  preguntaAlerta$ = new Subject<AlertAskModel>()
  respuestaAlerta$ = new Subject<boolean>()


  constructor (
    private dialogBox: MatDialog
  ) { }

  // Función que envía un mensaje de alerta
  // y espera la confirmación de la lectura del usuario
  sendAlertMessage( mensaje: AlertMsgModel | string ): Observable<any> {
    var msg: AlertMsgModel = typeof mensaje == 'string' ?
      { confirmacion: 'aceptar', mensaje: mensaje } : mensaje
    

    const dialogRef = this.dialogBox.open( MessageComponent, {
      width: '300px',
      data: msg
    } )
    dialogRef.afterClosed().subscribe(result => {
      this.respuestaAlerta$.next( result );
    });

    return this.respuestaAlerta$
  }


  // Función que envía una pregunta como alerta
  // y espera la respuesta true o false del usuario
  sendAlertAsk( pregunta: AlertAskModel ): Observable<any> {

    if ( !pregunta.respTrue ) pregunta.respTrue = 'aceptar'
    if ( !pregunta.respFalse ) pregunta.respFalse = 'cancelar'

    const dialogRef = this.dialogBox.open( AskComponent, {
      width: '300px',
      data: pregunta
    } )
    dialogRef.afterClosed().subscribe( result => {
      this.respuestaAlerta$.next( result );
    } )

    return this.respuestaAlerta$
  }

  sendAlertRequest() {
    
  }

}
