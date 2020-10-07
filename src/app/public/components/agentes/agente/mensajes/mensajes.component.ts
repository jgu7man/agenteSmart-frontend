import { AlertService } from 'src/app/Gdev-Tools/alerts/alert.service';
import { IntentModel } from './mensaje.model';
import { Component, OnInit } from '@angular/core';
import { MensajesService} from './mensajes.service'
@Component({
  selector: 'aSmart-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.scss']
})
export class MensajesComponent implements OnInit {

  constructor(
    private _mensaje:MensajesService,
    private _alerta: AlertService
  ) { }

  ngOnInit(): void {
    this._mensaje.getProjectId()
  }

  async crearIntent() {
    //aqui pueden ir mas parametros
    const intent:IntentModel = {
      displayName: "prueba de Intent",
    }

    try {
      const newIntent = await this._mensaje.createNewIntent(intent)
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
