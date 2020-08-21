import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { TiposService } from '../../../../../tipos/tipos.service';
import { FraseParte, ParametroEntrada, FraseEntrenamiento } from '../../../../entrada.model';
import { ParametrosService } from '../../parametros/parametros.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'aSmart-frase-parameters',
  templateUrl: './frase-parameters.component.html',
  styleUrls: ['./frase-parameters.component.scss']
})
export class FraseParametersComponent implements OnInit {

  entityControl = new FormControl();
  paramName: string = ''
  tipos: string[] = []
  tiposFiltered: Observable<string[]>

  @Input() frase: FraseEntrenamiento
  @Input() parteIndex: string
  @Output() tipoSelected = new EventEmitter<FraseParte>() 

  constructor (
    private _tipos: TiposService,
    private _params: ParametrosService
  ) { }

  async ngOnInit() {
    await this.getTipos()
    this.tiposFiltered = this.entityControl.valueChanges
      .pipe(
        startWith( '' ),
        map(value => this._filter(value))
      )
  }
  
  async getTipos() {
    var tiposList = this._tipos.tiposList ?
      this._tipos.tiposList :
      await this._tipos.get();
    
    tiposList.forEach( tipo => {
      this.tipos.push(tipo.displayName)
    } )
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase()
    return this.tipos.filter(tipo => tipo.toLowerCase().includes(filterValue))
  }


  setTipoFrase( event: MatAutocompleteSelectedEvent, partIndex: number ) {
    this.frase.parts[partIndex].entityType = event.option.value
  }

  addParameter(event) {
    event.stopInmediatePropagation()
    var entity = this.entityControl.value
    if ( entity ) {
      var param: ParametroEntrada = {
        displayName: this.paramName,
        entityTypeDisplayName: entity
      }
      this._params.addParam(param)
    }
  }


}
