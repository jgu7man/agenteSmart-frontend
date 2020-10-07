import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RespuestasService } from '../../../respuestas.service';
import { CurrentAgenteService } from '../../../../../../../current-agente.service';
import { CurrentMensajeService } from '../../../../../current-mensaje.service';
import { FormRegistroDatos } from '../../../respuesta.model';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilKeyChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'aSmart-grupo-datos',
  templateUrl: './grupo-datos.component.html',
  styleUrls: ['./grupo-datos.component.scss']
})
export class GrupoDatosComponent implements OnInit {

  paramSelected: string = ''
  // dataGroups: any[]
  dataGroupSelected: string = ''
  colSelected
  
  dataForm: FormRegistroDatos = new FormRegistroDatos( 'texto', '', this.paramSelected, this.dataGroupSelected, '' )
  
  private _RegistroDatosForm = new BehaviorSubject<FormRegistroDatos>( this.dataForm );
  @Input() set RegistroDatosForm( form: FormRegistroDatos )
    { this._RegistroDatosForm.next( form ); }
  get RegistroDatosForm() { return this._RegistroDatosForm.getValue()}
  
  @Output() edited = new EventEmitter<FormRegistroDatos>();

  constructor (
    public agenteS: CurrentAgenteService,
    public mensajeS: CurrentMensajeService
  ) {
    
   }

  ngOnInit(): void {
    this._RegistroDatosForm.pipe(
      distinctUntilKeyChanged('parametro')
    ).subscribe( form => {
      this.dataForm = form
    })
  }

  get KeySpected() {
    this.colSelected = this.agenteS.coleccionesList
      .find( col => col.name === this.dataForm.grupoDatos  );
    return this.colSelected ? this.colSelected.saveKeys : []
  }

  
}
