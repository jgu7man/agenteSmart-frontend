import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { RespuestasService } from '../../../respuestas.service';
import { CondicionalModel, SimpleModel } from '../../../respuesta.model';
import { ParametrosService } from '../../../../parametros/parametros.service';
import {
  SystemEntitieModel,
  TipoEntidadModel,
} from '../../../../../../../tipos/tipo.model';
import { GdevLoading } from 'src/app/gdev-tools/src/lib/loading/loading.service';
import { ParamSelected } from '../../../../parametros/param-selector/param-selector.component';
import { CurrentMensajeService } from '../../../../../current-mensaje.service';

@Component({
  selector: 'aSmart-condicional-form',
  templateUrl: './condicional-form.component.html',
  styleUrls: ['./condicional-form.component.scss'],
})
export class CondicionalFormComponent implements OnInit {
  paramSelected: string = '';
  isOriginal: boolean = true;
  tipoSelected: TipoEntidadModel | SystemEntitieModel;

  @Input() result: CondicionalModel;
  @Output() onRespChanges: EventEmitter<CondicionalModel> = new EventEmitter();

  condicionesList: Condition[] = [
    { displayText: 'igual a', operator: 'igual' },
    { displayText: 'diferente a ', operator: 'diferente' },
    { displayText: 'existe', operator: 'existe' },
    { displayText: 'no existe', operator: 'no_existe' },
    { displayText: 'mayor que', operator: 'mayor' },
    { displayText: 'menor que ', operator: 'menor' },
    { displayText: 'mayor o igual que', operator: 'mayor_igual' },
    { displayText: 'menor o igual que', operator: 'meno_igual' },
  ];

  constructor(
    // public respuestas_: RespuestasService,
    public _params: ParametrosService,
    private _mensaje: CurrentMensajeService
  ) {
    this.result = new CondicionalModel('', '', '');
  }

  async ngOnInit() {
    if (this.result.parametro) {
      this.tipoSelected = this._mensaje
      .mensajeTypeEntities$
      .getValue()
      .find((t) => t && t.displayName == this.result.parametro);
    }
  }

  get disableValue() {
    return (
      this.result.condicion == 'existe' ||
      this.result.condicion == 'no_existe' ||
      !this.result.condicion
    );
  }

  setParameter() {
    if (this.result.parametro) {
      return this.result.parametro.split('$').length >= 2
        ? this.result.parametro.split('$')[1].split('.')[0]
        : this.result.parametro.split('$')[0];
    }
  }

  onParamChange(selected: string) {
    console.log( selected )
    let displayName = selected.startsWith('@') ?
      selected.substring(1) : selected

    let paramFound = this._params.getParamByName(displayName);
    if (paramFound) {
      this.isOriginal = paramFound.value.split('.').length > 1 ? true : false;
    }
    this.result.parametro = displayName;
    // var selectedSplit = selected.value.split('$');
    // console.log( selectedSplit )
    // var param = selectedSplit.length > 1 ? selectedSplit[1] : selectedSplit[0];
    // console.log( param )
    console.log( this._mensaje.mensajeTypeEntities$.getValue() )
    this.tipoSelected = this._mensaje
      .mensajeTypeEntities$
      .getValue()
      .find((t) => t && t.displayName == displayName);

    console.log( this.tipoSelected )
    this.onRespChanges.emit(this.result);
  }

  get isntSystem() {
    return this.tipoSelected && 'entities' in this.tipoSelected
    ? this.tipoSelected as TipoEntidadModel : false
  }

  validateOriginal() {
    return !this.isOriginal && this.tipoSelected;
  }

  async catchresult(msg: SimpleModel) {
    this.result.text = msg.text;
    // await this._loading.waitFor(100)
    this.onRespChanges.emit(this.result);
  }

  entitiesOf(tipoSelected: TipoEntidadModel | SystemEntitieModel) {
    if ('entities' in tipoSelected) {
      return tipoSelected.entities;
    }
  }
}

export interface Condition {
  displayText: string;
  operator: string;
}
