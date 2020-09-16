import { AlertService } from 'src/app/Gdev-Tools/alerts/alert.service';
import { Component, OnInit, Input } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { RespuestaModel, FormPredefinida, FormCondicional, FormRegistroDatos, FormBuscar } from '../respuesta.model';
import { RespuestasService } from '../respuestas.service';
import { CacheService } from 'src/app/Gdev-Tools/cache/cache.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Loading } from 'src/app/Gdev-Tools/loading/loading.service';

@Component({
  selector: 'aSmart-respuesta-card',
  templateUrl: './respuesta-card.component.html',
  styleUrls: [ './respuesta-card.component.scss' ],
})
export class RespuestaCardComponent implements OnInit {

  /** Resive la data de la respuesta desde el arreglo padre */
  @Input() respuesta: RespuestaModel
  /** Activa la visa para elegir acciones */
  activateAccion: boolean
  /** Activa la opción de editar la respuesta */
  switchEditResp: boolean
  /** Obtiene el tipo de respuesta seleccionado y da estilo a la vista */
  selectedRes: TipoRespuesta
  /** Lista de tipo de respuestas con sus respectivos estilos */
  tiposRes: TipoRespuesta[] = [
    { display:'', name: '', color: 'grey', icono:'fa-plus'},
    { display:'Predefinida', name: 'predefinida', color:'#935cff', icono: 'fa-comment-alt'},
    { display:'Condicional', name: 'condicional', color: '#42cbff', icono: 'fa-code-branch' },
    { display:'Grupo de datos', name: 'grupo_datos', color: '#26a69a', icono: 'fa-clipboard-list' },
    { display:'Buscar', name: 'buscar', color: '#eadb51', icono: 'fa-search' },
  ]
  /** El mensaje de salida */
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
      this.outputMessage,
      0
    )

    // this.selectedRes = this.tiposRes[0]
   }

  ngOnInit(): void {
    this.selectedRes = this.tiposRes.find( tipo => tipo.name == this.respuesta.tipo )
  }


  /**
   * Obtiene el tipo de respuesta seleccionado del select
   * @param {MatSelectChange} tipoSelected - Contiene la propidad valor que es de tipo `TipoEntityType.name`
   */
  onTipoSelected( tipoSelected: MatSelectChange ) {
    this.selectedRes = this.tiposRes.find( tipo => tipo.name == tipoSelected.value )
    this.respuesta.tipo = tipoSelected.value
  }


  /** Recibe los cambios en los formularios hijos como PREDEFINIDA, CODICIONAL, BUSCAR Y GRUPO DE DATOS */
  catchOutputMessage( msg: any ) {
    this.outputMessage = msg
  }



  async validateRespuesta( respuestaObj: RespuestaModel ) {
    let respuestaClean, output = {}
    output = { ...respuestaObj.outputMessage, ...this.outputMessage }
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
    this.resService.addRespuesta( cleanRespuesta )
    this.respuesta.tipo = ''
    this.respuesta.outputMessage = new FormPredefinida( 'texto', '' )
  }

  
}


export interface TipoRespuesta {
  display: string,
  name: 'predefinida' | 'condicional' | 'grupo_datos' | 'buscar' | '',
  color: string,
  icono: string,
}





