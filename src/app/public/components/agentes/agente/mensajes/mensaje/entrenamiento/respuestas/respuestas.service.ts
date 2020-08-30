import { Injectable } from '@angular/core';
import { IntentModel, ParametroMensaje } from '../../../mensaje.model';
import { Contexto } from '../../../../contextos/contexto.model';
import { AccionModel } from '../../../../acciones/accion.model';
import { MensajesService } from '../../../mensajes.service';
import { ContextosService } from '../../../../contextos/contextos.service';
import { CurrentMensajeService } from '../../current-mensaje.service';
import { CacheService } from '../../../../../../../../Gdev-Tools/cache/cache.service';



@Injectable( {
  providedIn: 'root'
})
export class RespuestasService {

  mensajesList: IntentModel[]
  currentMensaje: IntentModel
  nextMensaje: string
  contextList: Contexto[]
  currentContext: string
  paramList: ParametroMensaje[]

  acciones: AccionModel[] = [
    { accion: 'guardar', ruta: '' },
    { accion: 'editar', ruta: '' },
    { accion: 'buscar', ruta: '' },
    { accion: 'borrar', ruta: '' },
  ]

  constructor (
    private _mensajes: MensajesService,
    private _contextos: ContextosService,
    private _mensaje: CurrentMensajeService,
    private _cache: CacheService
  ) { 
    this.initRespData()
  }


  async initRespData() {
    var allData = await this._cache.getFullData()
    this.contextList = allData['allContext']
    this.mensajesList = allData[ 'allMensajesList' ]
    this.currentContext = allData['currentContexto']
    this._mensaje.current$.subscribe( mensaje => {
      if ( mensaje ) {
        this.currentMensaje = mensaje
        this.paramList = this.currentMensaje.parameters
        this.getNextMensaje()
      }
    })
    return
  }


  async getNextMensaje() {
    var mensajes: IntentModel[] = await this._cache.getDataKey( 'mensajesList:' + this.currentContext )
    console.log( mensajes , this.currentMensaje );
    if ( mensajes.length > 0 )
      var currentIntenIndex = mensajes.findIndex
        ( intent => intent.name == this.currentMensaje.name );

    this.nextMensaje = currentIntenIndex == mensajes.length - 1 ? '' : mensajes[ currentIntenIndex + 1 ].displayName
  }
}




