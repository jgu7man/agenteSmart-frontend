import { GdevAlert } from 'src/app/gdev-tools/src/lib/alert/alert.service';
import { IntentModel } from './mensaje.model';
import { Component, OnInit } from '@angular/core';
import { MensajesService} from './mensajes.service'
import { CurrentAgenteService } from '../current-agente.service';
import { GdevLoading } from '../../../../../gdev-tools/src/lib/loading/loading.service';
import { ContextosService } from '../contextos/contextos.service';


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
    private _loading: GdevLoading,
    public contextos_: ContextosService
  ) { }

  async ngOnInit() {
    await this._loading.waitFor(5000)
    // console.log( this.agente_.contextosList )
  }





}
