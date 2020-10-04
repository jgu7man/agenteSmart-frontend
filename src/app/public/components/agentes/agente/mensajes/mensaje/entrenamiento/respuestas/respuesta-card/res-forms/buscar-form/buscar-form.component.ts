import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RespuestasService } from '../../../respuestas.service';
import { CacheService } from '../../../../../../../../../../../Gdev-Tools/cache/cache.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormBuscar, FormPredefinida } from '../../../respuesta.model';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilKeyChanged } from 'rxjs/operators';
import { CurrentAgenteService } from '../../../../../../../current-agente.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'aSmart-buscar-form',
  templateUrl: './buscar-form.component.html',
  styleUrls: ['./buscar-form.component.scss']
})
export class BuscarFormComponent implements OnInit {

  @Input() response: FormBuscar = new FormBuscar( 'texto', '', '', '' )
  
  private _BuscarRes : BehaviorSubject<FormBuscar> = new BehaviorSubject(this.response);
  @Input() set BuscarRes(form: FormBuscar) { this._BuscarRes.next(form); }
  get BuscarRes() { return this._BuscarRes.getValue()}

  paramSelected: string
  // dataBases: any[]
  dataBaseSelected: string
  
  @Output() onRespChanges: EventEmitter<FormPredefinida> = new EventEmitter()
  respBuscar: FormBuscar
  constructor (
    public resService: RespuestasService,
    private _cache: CacheService,
    public agenteS: CurrentAgenteService
  ) {
    this.respBuscar = new FormBuscar('texto', '', this.paramSelected, this.dataBaseSelected)
   }

  ngOnInit(): void {
    this._BuscarRes.pipe(
      distinctUntilKeyChanged('parametro')
    ).subscribe(form => this.response = form)
  }



  catchParamSelect( change: MatSelectChange ) {
    this.response.parametro = change.value
    this.onRespChanges.emit(this.respBuscar)
  }

  catchDBSelect( change: MatSelectChange ) {
    this.response.rutaDB = change.value
    this.onRespChanges.emit( this.respBuscar )
  }

}
