import { Injectable } from '@angular/core';
import { CurrentAgenteService } from '../../current-agente.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { EntradaModel } from '../entrada.model';
import { Observable, Subject } from 'rxjs';
import { Loading } from '../../../../../../global/loading/loading.service';
import { switchMap, take } from 'rxjs/operators';
import { CacheService } from '../../../../../../global/cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentEntradaService {

  currentEntrada$: Subject<CurrentEntrada> = new Subject()
  entradasPath: string
  constructor (
    private _agente: CurrentAgenteService,
    private fs: AngularFirestore,
    private _cache: CacheService,
    private loading: Loading
    ) { }

  async getCurrentEntrada() {
    let entrada: EntradaModel =
      await ( await this.currentEntrada$.pipe( take( 1 ) ).toPromise() ).entrada
    return entrada
  }
    

  async entradasCollection() {
    this.entradasPath = await this._agente.getPath( 'entradas' )
    const entradasRef = this.fs.collection( this.entradasPath ).ref
    return entradasRef
  }
  
  async get( name, contexto? ) {
    const entradaDoc = await ( await this.entradasCollection() ).doc( name ).get()
    if ( entradaDoc.exists ) {
      var entrada = entradaDoc.data() as EntradaModel
      this.currentEntrada$.next( { entrada: entrada, contexto } )
      this._cache.updateData( 'currentEntrada', entrada )
      this._cache.updateData( 'currentContexto', contexto )
      return entrada
    }
  }

  async updateEntradaName( entradaName: string, displayName: string ) {
    await ( await this.entradasCollection() ).doc( entradaName ).update( {
      displayName: displayName
    } )
  }



  async delete( entradaName ) {
    return await ( await this.entradasCollection() ).doc( entradaName ).delete()
  }
}


export interface CurrentEntrada {
  entrada: EntradaModel,
  contexto: string
}