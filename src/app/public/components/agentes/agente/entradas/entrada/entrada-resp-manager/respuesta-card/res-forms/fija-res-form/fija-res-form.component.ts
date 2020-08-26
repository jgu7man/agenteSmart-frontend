import { EntradaModel } from './../../../../../entrada.model';
import { Component, OnInit } from '@angular/core';
import { EntradasService } from '../../../../../entradas.service';
import { Contexto } from '../../../../../../contextos/contexto.model';
import { ContextosService } from '../../../../../../contextos/contextos.service';
import { RespuestasService } from '../../../respuestas.service';
import { CacheService } from '../../../../../../../../../../global/cache/cache.service';

@Component({
  selector: 'aSmart-fija-res-form',
  templateUrl: './fija-res-form.component.html',
  styleUrls: ['./fija-res-form.component.scss']
})
export class FijaResFormComponent implements OnInit {

  siguienteEntrada: string
  siguienteContexto: string
  

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
    console.log(this.siguienteContexto);
  }

  

}
