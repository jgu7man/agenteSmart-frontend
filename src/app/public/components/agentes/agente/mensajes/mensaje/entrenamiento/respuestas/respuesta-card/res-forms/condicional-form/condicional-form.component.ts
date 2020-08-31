import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RespuestasService } from '../../../respuestas.service';
import { CacheService } from '../../../../../../../../../../../Gdev-Tools/cache/cache.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormCondicional, FormPredefinida } from '../../../respuesta.model';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'aSmart-condicional-form',
  templateUrl: './condicional-form.component.html',
  styleUrls: ['./condicional-form.component.scss']
})
export class CondicionalFormComponent implements OnInit {

  siguienteMensaje: string
  siguienteContexto: string
  paramSelected: string
  condicionSelected: string
  conditionValue: string = ''
  activateAccion: boolean
  accion

  respCondicional: FormCondicional
  @Output() onRespChanges: EventEmitter<FormPredefinida> = new EventEmitter()

  condicionesList: Condition[] = [
    { displayText: 'igual a', operator: '==' },
    { displayText: 'diferente a ', operator: '!=' },
    { displayText: 'mayor que', operator: '>' },
    { displayText: 'menor que ', operator: '<' },
    { displayText: 'mayor o igual que', operator: '>=' },
    { displayText: 'menor o igual que', operator: '<=' },
    { displayText: 'existe', operator: '' },
    { displayText: 'no existe', operator: '!'}
  ]

  constructor (
    public resService: RespuestasService,
    private _cache: CacheService
  ) {
    this.respCondicional = new FormCondicional('texto','', this.paramSelected, this.condicionSelected,'')
    this.resService.initRespData()
  }

  ngOnInit(): void {
    this.getCurrent()
  }

  async getCurrent() {
    this.siguienteContexto = await this._cache.getDataKey( 'currentContexto' )
  }

  switchAction( change: MatSlideToggleChange ) {
    this.activateAccion = change.checked
  }

  catchOutputMessage( msg: FormPredefinida ) {
    this.respCondicional.estiloRespuesta = msg.estiloRespuesta
    this.respCondicional.mensaje = msg.mensaje
    this.onRespChanges.emit( this.respCondicional )
  }

}


export interface Condition {
  displayText: string
  operator: string
}
