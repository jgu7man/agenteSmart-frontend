import { Injectable } from '@angular/core';
import { IntentModel, ParametroMensaje } from '../mensajes/mensaje.model';
import { Contexto } from '../contextos/contexto.model';
import { AccionModel } from '../acciones/accion.model';
import { MensajesService } from '../mensajes/mensajes.service';
import { ContextosService } from '../contextos/contextos.service';
import { CacheService } from '../../../../../Gdev-Tools/cache/cache.service';
import { CurrentMensajeService } from '../mensajes/mensaje/current-mensaje.service';


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
    private _currentMensaje: CurrentMensajeService,
    private _cache: CacheService
  ) { 
    this.initRespData()
  }


  async initRespData() {
    var allData = await this._cache.getFullData()
    this.currentContext = allData['currentContexto']
    this.currentMensaje = allData['currentMensaje']
    console.log(this.currentMensaje);
    this.contextList = await this._contextos.getAllContexts()
    console.log(this.contextList);
    this.mensajesList = allData['allMensajesList']
    console.log(this.mensajesList);
    this.paramList = this.currentMensaje.parameters
    console.log( this.paramList );
    await this.getNextMensaje()
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




