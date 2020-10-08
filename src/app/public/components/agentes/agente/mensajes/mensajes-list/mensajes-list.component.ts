import { AlertService } from './../../../../../../Gdev-Tools/alerts/alert.service';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Loading } from '../../../../../../Gdev-Tools/loading/loading.service';
import { MensajesService } from '../mensajes.service';
import { IntentModel } from '../mensaje.model';
import { CurrentAgenteService } from '../../current-agente.service';
@Component({
  selector: 'aSmart-mensajes-list',
  templateUrl: './mensajes-list.component.html',
  styleUrls: ['./mensajes-list.component.scss']
})
export class MensajesListComponent implements OnInit {

  switchAddIntent: boolean = false
  newDisplayName: string = ''
  intents: IntentModel[] = []


  @Input() contexto
  @ViewChild( 'intentNuevo' ) intentNuevo: ElementRef
  constructor (
    private _loading: Loading,
    public mensajes: MensajesService,
    public agente: CurrentAgenteService,
    private _alerta: AlertService,
  ) { }

  async ngOnInit() {
    //Cargo todo los intents del Agente Actual.
    this.intents = await this.mensajes.getAllIntents()
    // console.log('Abemus Intents:', this.intents);
  }

  async toAddIntent() {
    this.switchAddIntent = !this.switchAddIntent
    await this._loading.waitFor( 100 )
    this.intentNuevo.nativeElement.focus()
  }

  async onAddIntent( contexto? ) {
    this.switchAddIntent = false
    if ( this.newDisplayName ) {
      let lastIndex = this.agente.mensajesList.length
      //
      try {
        console.log('crear')
        const newIntent = await this.mensajes.createNewIntent({displayName: this.newDisplayName})

        if (newIntent) {
          console.info('Intent Created, response:', newIntent)

          //se ha creado el intent(regresa un intent completo vacio),
         
          //aqui nose que hacer con el resourceID
          await this.mensajes.setMensaje( newIntent, lastIndex )

        }
      } catch (error) {
        if (error) {
          console.error(error)
          switch (error.error.error.code) {
            case 3:
              this._alerta.sendFloatNotification("Ya tienes un Intent con ese nombre.")
              break;
            default:
              this._alerta.sendFloatNotification("Error creando intent, porfavor vuelva a intentarlo.")
              break;
          }
        }
      }
    }
  }
  

  trackByName( index, intent: IntentModel ) {
    return intent.name
  }

}
