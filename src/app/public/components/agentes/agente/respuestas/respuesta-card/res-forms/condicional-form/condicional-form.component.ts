import { Component, OnInit } from '@angular/core';
import { RespuestasService } from '../../../respuestas.service';
import { CacheService } from '../../../../../../../../Gdev-Tools/gdev-cache/cache.service';

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

  condicionesList: Condition[] = [
    { displayText: 'igual a', operator: '==' },
    { displayText: 'diferente a ', operator: '!=' },
    { displayText: 'mayor que', operator: '>' },
    { displayText: 'menor que ', operator: '<' },
    { displayText: 'mayor o igual que', operator: '>=' },
    { displayText: 'menor o igual que', operator: '<=' },
  ]

  constructor (
    public resService: RespuestasService,
    private _cache: CacheService
  ) {
    this.resService.initRespData()
  }

  ngOnInit(): void {
    this.getCurrent()
  }

  async getCurrent() {
    this.siguienteContexto = await this._cache.getDataKey( 'currentContexto' )
  }


}


export interface Condition {
  displayText: string
  operator: string
}
