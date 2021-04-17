import { CurrentMensajeService } from './../../../../../current-mensaje.service';
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { RespuestasService } from '../../../respuestas.service';
import { GdevCache } from '../../../../../../../../../../../gdev-tools/src/lib/cache/gdev-cache.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { RespuestaBuscarModel } from '../../../respuesta.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilKeyChanged } from 'rxjs/operators';
import { CurrentAgenteService } from '../../../../../../../current-agente.service';
import { MatSelectChange } from '@angular/material/select';
import { TarjetaModel } from '../../../../../../../../../tarjetas/tarjeta.model';
import { GdevAlert } from '../../../../../../../../../../../gdev-tools/src/lib/alert/alert.service';
import { ParametroMensaje } from '../../../../../../mensaje.model';

@Component({
  selector: 'aSmart-buscar-form',
  templateUrl: './buscar-form.component.html',
  styleUrls: ['./buscar-form.component.scss']
})
export class BuscarFormComponent implements OnInit, OnDestroy {

  @Input() response: RespuestaBuscarModel = new RespuestaBuscarModel( '', '' )

  private _BuscarRes : BehaviorSubject<RespuestaBuscarModel> = new BehaviorSubject(this.response);
  @Input() set BuscarRes(form: RespuestaBuscarModel) { this._BuscarRes.next(form); }
  get BuscarRes() { return this._BuscarRes.getValue()}

  paramSelected: string
  dataBaseSelected: string
  dataBases: DataBase[] = [
    {value: 'tarjetas', displayName: 'Tarjetas'},
    {value: 'productos', displayName: 'Productos'}
  ]

  tarjetas: TarjetaModel[]

  @Output() onRespChanges: EventEmitter<RespuestaBuscarModel> = new EventEmitter()
  respuesta: RespuestaBuscarModel
  paramList: ParametroMensaje[]
  paramsSubscription: Subscription

  constructor (
    public respuestas_: RespuestasService,
    private _cache: GdevCache,
    public agente_: CurrentAgenteService,
    private _alerts: GdevAlert,
    private _mensaje: CurrentMensajeService
  ) {
    this.tarjetas = this._cache.getDataKey<TarjetaModel[]>('tarjetas')
    this.respuesta = new RespuestaBuscarModel('', this.paramSelected,)
    this.paramsSubscription =
    this._mensaje.current$.subscribe(({ parameters }) => {
      this.paramList = parameters
    })
   }

  ngOnInit(): void {
    this._BuscarRes.pipe(
      distinctUntilKeyChanged('parametro')
    ).subscribe( form => {
      console.log(form);
      this.response = form
    } )
  }

  validateColeccionOnClick() {

    if (this.tarjetas.length < 1) {
      this._alerts.sendMessageAlert('Debes crear una tarjeta o un producto primero')
    }
  }


  catchParamSelect( change: MatSelectChange ) {
    this.response.parametro = change.value
    this.onRespChanges.emit(this.respuesta)
  }

  catchDBSelect( change: MatSelectChange ) {
    this.response.database = change.value
    this.onRespChanges.emit( this.respuesta )
  }

  ngOnDestroy() {
    if (this.paramsSubscription) this.paramsSubscription.unsubscribe()
  }

}

export interface DataBase {
  value: string, displayName: string
}
