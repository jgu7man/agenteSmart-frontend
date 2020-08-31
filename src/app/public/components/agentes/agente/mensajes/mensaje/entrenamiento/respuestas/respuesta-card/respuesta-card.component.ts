import { Component, OnInit, Input } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { RespuestaModel, FormPredefinida, FormCondicional, FormRegistroDatos, FormBuscar } from '../respuesta.model';
import { RespuestasService } from '../respuestas.service';
import { CacheService } from '../../../../../../../../../Gdev-Tools/cache/cache.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'aSmart-respuesta-card',
  templateUrl: './respuesta-card.component.html',
  styleUrls: [ './respuesta-card.component.scss' ],
})
export class RespuestaCardComponent implements OnInit {

  @Input() respuesta: RespuestaModel

  siguienteMensaje: string
  siguienteContexto: string
  activateAccion: boolean
  accion

  selectedRes: TipoRespuesta
  tiposRes: TipoRespuesta[] = [
    { display:'', name: '', color: 'grey', icono:'fa-plus'},
    { display:'Predefinida', name: 'predefinida', color:'#935cff', icono: 'fa-comment-alt'},
    { display:'Condicional', name: 'condicional', color: '#42cbff', icono: 'fa-code-branch' },
    { display:'Grupo de datos', name: 'grupo_datos', color: '#26a69a', icono: 'fa-clipboard-list' },
    { display:'Buscar', name: 'buscar', color: '#eadb51', icono: 'fa-search' },
  ]

  outputMessage: FormPredefinida | FormCondicional | FormRegistroDatos | FormBuscar 
  

  constructor (
    public resService: RespuestasService,
    private _cache: CacheService
  ) {


    this.respuesta = new RespuestaModel(
      'predefinida',
      resService.nextMensaje,
      resService.currentContext,
      resService.currentContext,
      this.outputMessage
    )

    this.resService.initRespData()
    this.selectedRes = this.tiposRes[0]
   }

  ngOnInit(): void {
    // if ( this.respuesta.tipo != '' ) {
    //   this.setSelectedRes()
    // }
    console.log(this.respuesta);
    this.getCurrent()
  }

  setSelectedRes() {
    this.selectedRes = this.tiposRes.find( tipo => tipo.name == this.respuesta.tipo )
    console.log(this.selectedRes);
  }

  onTipoSelected( tipoSelected: MatSelectChange ) {
    this.selectedRes = this.tiposRes.find( tipo => tipo.name == tipoSelected.value)
  }

  catchOutputMessage( msg ) {
    this.outputMessage = msg
  }

  

  

  async getCurrent() {
    this.siguienteContexto = await this._cache.getDataKey( 'currentContexto' )
    console.log( this.siguienteContexto );
  }

  switchAction( change: MatSlideToggleChange ) {
    this.activateAccion = change.checked
  }

}


export interface TipoRespuesta {
  display: string,
  name: 'predefinida' | 'condicional' | 'grupo_datos' | 'buscar' | '',
  color: string,
  icono: string,
}





