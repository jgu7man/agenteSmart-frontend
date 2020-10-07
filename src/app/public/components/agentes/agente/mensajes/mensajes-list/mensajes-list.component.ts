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
  newIntent: string = ''
  
  @Input() contexto
  @ViewChild( 'intentNuevo' ) intentNuevo: ElementRef

  constructor (
    private _loading: Loading,
    public mensajes: MensajesService,
    public agente: CurrentAgenteService,
    private _alerta: AlertService
  ) { }

  ngOnInit(): void {
  }

  async toAddIntent() {
    this.switchAddIntent = !this.switchAddIntent
    await this._loading.waitFor( 100 )
    this.intentNuevo.nativeElement.focus()
  }

  async onAddIntent( contexto? ) {
    this.switchAddIntent = false
    if ( this.newIntent ) {
      let lastIndex = this.agente.mensajesList.length
      //
      try {
        console.log('crear')
        const newIntent = await this.mensajes.createNewIntent({displayName: this.newIntent})

        if (newIntent) {
          console.info('Intent Created, response:', newIntent)

          //se ha creado el intent(regresa un intent completo vacio),
          // Ejemplo de nombre: projects/prueba-aente/agent/intents/f0b12fde-9600-4e2e-88a7-70861817a358
          const name = newIntent.name; //formato larguisimo solo ocupamos su ID
          const resourceID = name.slice(name.lastIndexOf("/") + 1); //formato esperado: f0b12fde-9600-4e2e-88a7-70861817a358
          //aqui nose que hacer con el resourceID
          await this.mensajes.setMensaje(resourceID, this.newIntent, lastIndex )

        }
      } catch (error) {
        if (error) {
          console.error(error)
          this._alerta.sendFloatNotification("Error creando intent, porfavor vuelva a intentarlo.")
        }
      }
    }
  }
  

  trackByName( index, intent: IntentModel ) {
    return intent.name
  }

}
