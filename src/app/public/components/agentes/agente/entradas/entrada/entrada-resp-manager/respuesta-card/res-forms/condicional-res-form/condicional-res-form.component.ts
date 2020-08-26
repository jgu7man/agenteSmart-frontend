import { Component, OnInit } from '@angular/core';
import { RespuestasService } from '../../../respuestas.service';
import { CacheService } from '../../../../../../../../../../global/cache/cache.service';

@Component({
  selector: 'aSmart-condicional-res-form',
  templateUrl: './condicional-res-form.component.html',
  styleUrls: ['./condicional-res-form.component.scss']
})
export class CondicionalResFormComponent implements OnInit {

  siguienteEntrada: string
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
