import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService, UserInterface } from '../../../../../admin/auth/auth.service';
import { AlertService } from '../../../../../global/alert/alert.service';
import { TextService } from '../../../../../services/text.service';
import { CacheService } from '../../../../../global/cache/cache.service';
import { AgentesService } from '../../agentes.service';
import { CurrentAgenteService } from '../agente.service';

@Injectable({
  providedIn: 'root'
})
export class EntradasService {

  user: UserInterface
  agenteId: string
  constructor (
    private fs: AngularFirestore,
    private _auth: AuthService,
    private _alerta: AlertService,
    private _text: TextService,
    private _cache: CacheService,
    private _agente: CurrentAgenteService
  ) {
    this.getData()
  }
  
  async getData() {
    this.agenteId = await this._cache.getDataKey( 'agenteId' )
    if ( !this.agenteId ) {
      this._agente.agente$.subscribe( agente => {
      this.agenteId = agente.agenteId
    })}
    this.user = await this._cache.getDataKey( 'user' )
    if (!this.user) this._auth.getCurrentUser().then( user => this.user = user )
  }


  async setEntrada( entradaName: string, contexto:string ) {
    const entradasRef = this.fs.collection(
      `usuarios/${ this.user.uid }/agentes/${ this.agenteId }/entradas`
    ).ref

    const name = this._text.normalize( entradaName.toLowerCase() )
    
    const entradaList = await this.getAllEntradasList()
    if ( entradaList.length > 0 ) {
      if ( !entradaList.includes( name ) ) {

        await entradasRef.doc( name )
          .set( {
            name: name,
            displayName: entradaName,
            inputContextNames: [contexto]
          }, { merge: true } )
      } else {
        this._alerta.sendAlertMessage( 'Entrada Duplicada' )
      }
    } else {
      await entradasRef.doc( name )
        .set( {
          name: name,
          displayName: entradaName,
          inputContextNames: [ contexto ]
        } )
    }
  }

  async getAllEntradasList() {
    const entradasRef = this.fs.collection(
      `usuarios/${ this.user.uid }/agentes/${ this.agenteId }/entradas`
    ).ref

    const entradaCol = await entradasRef.get()
    const entradaList = []
    entradaCol.forEach( entrada => { entradaList.push( entrada.id ) } )
    return entradaList
  }


  async getEntradasListByContextoId(contextoId: string) {
    const entradasRef = this.fs.collection(
      `usuarios/${ this.user.uid }/agentes/${ this.agenteId }/entradas`
    ).ref

    const entradaCol = await entradasRef.where('contextos', 'array-contains', contextoId).get()
    const entradaList = []
    entradaCol.forEach( entrada => { entradaList.push( entrada.id ) } )
    return entradaList
  }

  async getEntradasListByContextoName( contextoName: string ) {
    const entradasRef = this.fs.collection(
      `usuarios/${ this.user.uid }/agentes/${ this.agenteId }/entradas`
    ).ref

    const entradaCol = await entradasRef.where( 'inputContextNames', 'array-contains', contextoName ).get()
    const entradaList = []
    entradaCol.forEach( entrada => { entradaList.push( entrada.id ) } )
    return entradaList
  }
}
