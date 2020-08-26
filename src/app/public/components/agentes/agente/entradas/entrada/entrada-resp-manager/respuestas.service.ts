import { EntradaModel } from './../../entrada.model';
import { Injectable } from '@angular/core';
import { EntradasService } from '../../entradas.service';
import { ContextosService } from '../../../contextos/contextos.service';
import { Contexto } from '../../../contextos/contexto.model';
import { CurrentEntradaService } from '../current-entrada.service';
import { ParametroEntrada } from '../../entrada.model';
import { CacheService } from '../../../../../../../global/cache/cache.service';
import { AccionModel } from '../../../acciones/accion.model';

@Injectable({
  providedIn: 'root'
})
export class RespuestasService {

  entradasList: EntradaModel[]
  currentEntrada: EntradaModel
  nextEntrada: string
  contextList: Contexto[]
  currentContext: string
  paramList: ParametroEntrada[]

  acciones: AccionModel[] = [
    { accion: 'guardar', ruta: '' },
    { accion: 'editar', ruta: '' },
    { accion: 'buscar', ruta: '' },
    { accion: 'borrar', ruta: '' },
  ]

  constructor (
    private _entradas: EntradasService,
    private _contextos: ContextosService,
    private _currentEntrada: CurrentEntradaService,
    private _cache: CacheService
  ) { 
    this.initRespData()
  }


  async initRespData() {
    this.currentContext = await this._cache.getDataKey('currentContexto')
    this.currentEntrada = await this._currentEntrada.getCurrentEntrada()
    this.contextList = await this._contextos.getAllContexts()
    this.entradasList = await this._entradas.getAllEntradasList()
    this.paramList = this.currentEntrada.parameters
    var entradas: EntradaModel[] = await this._cache.getDataKey( 'entradasList:' + this.currentContext )
    var currentIntenIndex = entradas.findIndex( intent => intent.name == this.currentEntrada.name)
    this.nextEntrada = currentIntenIndex == entradas.length +1 ? '' : entradas[currentIntenIndex + 1].displayName
  }
}




