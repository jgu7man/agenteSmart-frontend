import { Injectable } from '@angular/core';
import { Loading } from '../../../../../global/loading/loading.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { CacheService } from '../../../../../global/cache/cache.service';
import { CurrentAgenteService } from '../current-agente.service';
import { TipoEntidadModel } from './tipo.model';
import { TextService } from '../../../../../services/text.service';

@Injectable({
  providedIn: 'root'
})
export class TiposService {

  tiposPath: string
  tiposList: TipoEntidadModel[] = []

  constructor (
    private loading: Loading,
    private fs: AngularFirestore,
    private _cache: CacheService,
    private _agente: CurrentAgenteService,
    private _text: TextService
  ) { }


  async tiposCollection() {
    this.tiposPath = await this._agente.getPath( 'tipos' )
    const tiposRef = this.fs.collection( this.tiposPath ).ref
    return tiposRef
  }


  // CREATE TIPOS DE DATOS
  // UPDATE

  async setTipo(tipo:TipoEntidadModel) {
    const name = this._text.normalize( tipo.displayName )
    const tipoInList: number = this.tiposList.findIndex(Tipo => Tipo.name === name)
    
    if ( tipoInList < 0 ) { tipo.name = name }
    var Tipo = {}
    Tipo = { ...tipo, ...Tipo }
    console.log(Tipo);
    await ( await this.tiposCollection() ).doc( name ).set( Tipo, { merge: true } )
    return 
  }





  // READ TIPOS DE DATOS

  async get() {
    const tiposCol = await ( await this.tiposCollection() ).get()
    if ( tiposCol.size > 0 ) {
      await this.loading.asyncForEach(
        tiposCol.docs, tipo => {
          return this.tiposList.push(tipo.data())
        }
      )
    }
    return this.tiposList
  }
  


}
