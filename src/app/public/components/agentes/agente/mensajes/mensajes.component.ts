import { GdevAlert } from 'src/app/gdev-tools/src/lib/alert/alert.service';
import { IntentModel } from './mensaje.model';
import { Component, OnInit } from '@angular/core';
import { MensajesService} from './mensajes.service'
import { CurrentAgenteService } from '../current-agente.service';
import { GdevLoading } from '../../../../../gdev-tools/src/lib/loading/loading.service';


@Component({
  selector: 'aSmart-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.scss']
})
export class MensajesComponent implements OnInit {

  constructor(
    private _mensajes:MensajesService,
    private _alerta: GdevAlert,
    public agente_: CurrentAgenteService,
    private _loading: GdevLoading
  ) { }

  async ngOnInit() {
    await this._loading.waitFor(5000)
    // console.log( this.agente_.contextosList )
  }
  
  

  async crearIntent() {
    const intent:IntentModel = {
      displayName: "prueba de Intent",
    }

    try {
      const newIntent = await this._mensajes.createNewIntent(intent)
      if (newIntent) {
        const name = newIntent.name; //formato larguisimo solo ocupamos su ID
      }
    } catch (error) {
      if (error) {
        console.error(error)
        this._alerta.sendFloatNotification("Error creando intent, porfavor vuelva a intentarlo.")
      }
    }
  }

}
