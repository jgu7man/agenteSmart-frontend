import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { RespuestasService } from '../../../respuestas.service';
import { CondicionalModel, PredefinidaModel } from '../../../respuesta.model';
import { ParametrosService } from '../../../../parametros/parametros.service';
import { TipoEntidadModel } from '../../../../../../../tipos/tipo.model';
import { Loading } from 'src/app/Gdev-Tools/loading/loading.service';

@Component({
  selector: 'aSmart-condicional-form',
  templateUrl: './condicional-form.component.html',
  styleUrls: ['./condicional-form.component.scss']
})
export class CondicionalFormComponent implements OnInit {

  paramSelected: string = ''
  isOriginal: boolean = true
  tipoSelected: TipoEntidadModel

  @Input() condicional: CondicionalModel
  @Output() onRespChanges: EventEmitter<CondicionalModel> = new EventEmitter()

  condicionesList: Condition[] = [
    { displayText: 'igual a', operator: 'igual' },
    { displayText: 'diferente a ', operator: 'diferente' },
    { displayText: 'mayor que', operator: 'mayor' },
    { displayText: 'menor que ', operator: 'menor' },
    { displayText: 'mayor o igual que', operator: 'mayor_igual' },
    { displayText: 'menor o igual que', operator: 'meno_igual' },
    { displayText: 'existe', operator: 'existe' },
    { displayText: 'no existe', operator: 'no_existe'}
  ]

  constructor (
    public respuestas_: RespuestasService,
    public _params: ParametrosService,
  ) {
    this.condicional = new CondicionalModel('texto','', '', '','')
  }

  async ngOnInit() {
  }


  onParamChange() {
    if ( this.condicional.parametro ) {
      let value = this._params.getParamByName( this.condicional.parametro ).value
        ? this._params.getParamByName( this.condicional.parametro ).value
        : this._params.getParamByName( this.condicional.parametro ).displayName
      this.isOriginal = value.split( '.' ).length > 1 ? true : false
      this.tipoSelected = this.respuestas_.mensajeTypeEntities.find(t => t.displayName == this.condicional.parametro)
      console.log(this.tipoSelected);
    } else {
      this.isOriginal = true
    }
    
    this.onRespChanges.emit(this.condicional)
  }

 

  

  async catchOutputMessage( msg: PredefinidaModel ) {
    this.condicional.estiloRespuesta = msg.estiloRespuesta
    this.condicional.respuesta = msg.respuesta
    // await this.loading.waitFor(100)
    this.onRespChanges.emit( this.condicional )
  }

}


export interface Condition {
  displayText: string
  operator: string
}
