import { AlertService } from 'src/app/Gdev-Tools/alerts/alert.service';
import { IntentModel } from './mensaje.model';
import { Component, OnInit } from '@angular/core';
import { MensajesService} from './mensajes.service'
import { CurrentAgenteService } from '../current-agente.service';
import { CacheService } from '../../../../../Gdev-Tools/cache/cache.service';
@Component({
  selector: 'aSmart-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.scss']
})
export class MensajesComponent implements OnInit {

  constructor(
    private _mensajes:MensajesService,
    private _alerta: AlertService,
    public agente_: CurrentAgenteService,
    private _cache: CacheService,
  ) { }

  async ngOnInit() {
    this._mensajes.getProjectId()
    this.getAllMensajes()
    this._mensajes.reloadMensajes$.subscribe(() => this.getAllMensajes())
  }
  
  async getAllMensajes() {
    let mensajesList = await this._mensajes.getAllIntents()
    console.log(mensajesList);
    this._cache.updateData( 'allMensajes',mensajesList)
  }

  async crearIntent() {
    //aqui pueden ir mas parametros
    const intent:IntentModel = {
      displayName: "prueba de Intent",
    }

    try {
      const newIntent = await this._mensajes.createNewIntent(intent)
      if (newIntent) {
        //se ha creado el intent(regresa un intent completo vacio),
        // Ejemplo de nombre: projects/prueba-aente/agent/intents/f0b12fde-9600-4e2e-88a7-70861817a358
        const name = newIntent.name; //formato larguisimo solo ocupamos su ID
        const resourceID = name.slice(name.lastIndexOf("/") + 1); //formato esperado: f0b12fde-9600-4e2e-88a7-70861817a358
        //aqui nose que hacer con el resourceID
      }
    } catch (error) {
      if (error) {
        console.error(error)
        this._alerta.sendFloatNotification("Error creando intent, porfavor vuelva a intentarlo.")
      }
    }
  }

}
