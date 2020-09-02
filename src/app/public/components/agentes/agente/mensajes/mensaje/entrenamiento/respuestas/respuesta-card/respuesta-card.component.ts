import { AlertService } from 'src/app/Gdev-Tools/alerts/alert.service';
import { Component, OnInit, Input } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { RespuestaModel, FormPredefinida, FormCondicional, FormRegistroDatos, FormBuscar, RespuestaSugerencias } from '../respuesta.model';
import { RespuestasService } from '../respuestas.service';
import { CacheService } from '../../../../../../../../../Gdev-Tools/cache/cache.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { Loading } from '../../../../../../../../../Gdev-Tools/loading/loading.service';

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
  switchEditResp: boolean

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
    private _cache: CacheService,
    private _alerts: AlertService,
    private loading: Loading
  ) {

    this.outputMessage = new FormPredefinida('texto', '')

    this.respuesta = new RespuestaModel(
      'predefinida',
      resService.nextMensaje,
      resService.currentContext,
      resService.currentContext,
      this.outputMessage
    )

    this.selectedRes = this.tiposRes[0]
   }

  ngOnInit(): void {
    this.selectedRes = this.tiposRes.find( tipo => tipo.name == this.respuesta.tipo )
    console.log( this.selectedRes);
    this.getCurrent()
  }

  setSelectedRes() {
    this.selectedRes = this.tiposRes.find( tipo => tipo.name == this.respuesta.tipo )
    console.log(this.selectedRes);
  }

  onTipoSelected( tipoSelected: MatSelectChange ) {
    this.selectedRes = this.tiposRes.find( tipo => tipo.name == tipoSelected.value )
    console.log(this.selectedRes);
    this.respuesta.tipo = tipoSelected.value
  }

  catchOutputMessage( msg ) {
    this.outputMessage = msg
  }


  async getCurrent() {
    this.siguienteContexto = await this._cache.getDataKey( 'currentContexto' )
  }

  switchAction( change: MatSlideToggleChange ) {
    this.activateAccion = change.checked
  }


  async validateRespuesta( respuestaObj: RespuestaModel ) {
    let respuestaClean, output = {}
    output = { ...respuestaObj.outputMessage }
    let respuesta = output[ 'respuesta' ]
    let respEstilo = respuestaObj.outputMessage.estiloRespuesta



    if ( !respuesta ) {
      this._alerts.sendMessageAlert( 'Agrega al menos un mensaje de texto' )
    
    
    } else if ( respEstilo == 'sugerencias' &&
      output[ 'respuesta' ][ 'sugerencias' ].length < 1
      ) {
        this._alerts.sendMessageAlert( 'Al menos agrega un par de sugerencias o tal vez mejor quieras utilizar el estilo de respuesta TEXTO' ) 
      
      
    
    } else {
      var respuestaKeys = Object.keys( respuestaObj );
      await this.loading.asyncForEach( respuestaKeys, key => {
        if ( respuestaObj[ key ] === undefined ) delete respuestaObj[ key ] 
        return
      } )

      respuestaClean = { ...respuestaObj }
      respuestaClean['outputMessage'] = output

      return respuestaClean
    }
  }

  async onSave() {
    let cleanRespuesta = await this.validateRespuesta( this.respuesta )
    console.log( cleanRespuesta );
    this.resService.addRespuesta(cleanRespuesta)
  }

}


export interface TipoRespuesta {
  display: string,
  name: 'predefinida' | 'condicional' | 'grupo_datos' | 'buscar' | '',
  color: string,
  icono: string,
}





