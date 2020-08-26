import { Component, OnInit } from '@angular/core';
import { RespuestasService } from '../../../respuestas.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CacheService } from '../../../../../../../../Gdev-Tools/cache/cache.service';

@Component({
  selector: 'aSmart-predefinida',
  templateUrl: './predefinida-form.component.html',
  styleUrls: ['./predefinida-form.component.scss']
})
export class PredefinidaFormComponent implements OnInit {

  siguienteMensaje: string
  siguienteContexto: string
  activateAccion: boolean
  accion
  

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

  switchAction(change: MatSlideToggleChange) {
    this.activateAccion = change.checked
  }

  

}
