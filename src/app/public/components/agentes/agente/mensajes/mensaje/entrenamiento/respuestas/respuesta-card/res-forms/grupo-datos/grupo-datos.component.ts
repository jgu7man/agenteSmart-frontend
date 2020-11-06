import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RespuestasService } from '../../../respuestas.service';
import { CurrentAgenteService } from '../../../../../../../current-agente.service';
import { CurrentMensajeService } from '../../../../../current-mensaje.service';
import { FormRegistroDatos } from '../../../respuesta.model';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilKeyChanged, tap } from 'rxjs/operators';
import { AlertService } from '../../../../../../../../../../../Gdev-Tools/alerts/alert.service';
import { ColeccionModel } from '../../../../../../../../../colecciones/collection.interface';
import { CacheService } from '../../../../../../../../../../../Gdev-Tools/cache/cache.service';

@Component({
  selector: 'aSmart-grupo-datos',
  templateUrl: './grupo-datos.component.html',
  styleUrls: ['./grupo-datos.component.scss']
})
export class GrupoDatosComponent implements OnInit {

  paramSelected: string = ''
  // dataGroups: any[]
  dataGroupSelected: string = ''
  colecciones: ColeccionModel[]
  colSelected
  
  dataForm: FormRegistroDatos = new FormRegistroDatos( 'texto', '', this.paramSelected, this.dataGroupSelected, '' )
  
  private _RegistroDatosForm = new BehaviorSubject<FormRegistroDatos>( this.dataForm );
  @Input() set RegistroDatosForm( form: FormRegistroDatos )
    { this._RegistroDatosForm.next( form ); }
  get RegistroDatosForm() { return this._RegistroDatosForm.getValue()}
  
  @Output() edited = new EventEmitter<FormRegistroDatos>();

  constructor (
    public agente_: CurrentAgenteService,
    public mensaje_: CurrentMensajeService,
    public _alerts: AlertService,
    private _cache: CacheService
  ) {
  }
  
  async ngOnInit() {
    this.colecciones = await this._cache.getAsyncKey('colecciones')
    this._RegistroDatosForm.pipe(
      distinctUntilKeyChanged('parametro')
    ).subscribe( form => {
      this.dataForm = form
    })
  }

  validateColeccionOnClick() {
    if (this.colecciones.length < 1) {
      this._alerts.sendMessageAlert('Debes crear una colección primero')
    }
  }

  get KeySpected() {
    // this.colSelected = this.agenteS.coleccionesList
    //   .find( col => col.name === this.dataForm.grupoDatos  );
    // return this.colSelected ? this.colSelected.saveKeys : []
    return []
  }

  
}
