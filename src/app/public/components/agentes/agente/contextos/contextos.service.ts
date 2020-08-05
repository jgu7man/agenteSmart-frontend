import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInterface, AuthService } from '../../../../../admin/auth/auth.service';
import { AlertService } from '../../../../../global/alert/alert.service';
import { EntradasService } from '../entradas/entradas.service';
import { EntradaModel } from '../entradas/entrada.model';
import { CacheService } from '../../../../../global/cache/cache.service';
import { Contexto } from './contexto.model';

@Injectable({
  providedIn: 'root'
})
export class ContextosService {

  contexts: string[]
  user: UserInterface
  agenteId: string
  constructor (
    private afs: AngularFirestore,
    private _auth: AuthService,
    private _alerta: AlertService,
    private _entradas: EntradasService,
    private _cache: CacheService
  ) {
    this.getData()
  }
  
  async getData() {
    this.agenteId = await this._cache.getDataKey( 'agenteId' )
    this.user = await this._cache.getDataKey( 'user' )
    if ( !this.user ) this._auth.getCurrentUser().then( user => this.user = user )

  }
  
  async setContext( contexto: Contexto ) {
    
    const contextRef = this.afs.collection(
      `usuarios/${ this.user.uid }/agentes/${ this.agenteId }/contextos`
    ).ref;

    if ( !contexto.id ) {
      var contextList = await this.getAllContexts()
      let contextFinded = contextList.find(context => context.contextName === contexto.contextName)
      if ( !contextFinded ) {
        await contextRef.add( contexto ).then(res =>{contextRef.doc(res.id).update({id: res.id})})
      } else {
        this._alerta.sendAlertMessage('Contexto duplicado')
      }
    } else {
      await contextRef.doc( contexto.id ).update( contexto )
    }
    return 
  }


  async getOneContext( contexto: Contexto ) {
    const contextRef = this.afs.collection(
      `usuarios/${ this.user.uid }/agentes/${ this.agenteId }/contextos`
    ).ref;

    var contextDoc = await contextRef.doc( contexto.id ).get()
    var contextGeted: Contexto = contextDoc.data() as Contexto
    
    return contextGeted
    
  }




  async getAllContexts( ) {
    const contextRef = this.afs.collection(
      `usuarios/${ this.user.uid }/agentes/${ this.agenteId }/contextos`
    ).ref
    var contextos: Contexto[] = []

    var contextCol = await contextRef.get()
    contextCol.forEach( contexto => {
      contextos.push(contexto.data() as Contexto)
    } )
    
    console.log(contextos);
    return contextos
  }



  async delContext( context:Contexto  ) {
    const contextRef = this.afs.collection(
      `usuarios/${ this.user.uid }/agentes/${ this.agenteId }/contextos`
    ).ref;
    const entradaRef = this.afs.collection(
      `usuarios/${ this.user.uid }/agentes/${ this.agenteId }/entradas`
    ).ref;
      
    const entradas = await this._entradas.getEntradasListByContextoId( context.id )
    if ( entradas.length > 0 ) {
      entradas.forEach( ( entrada: EntradaModel ) => {
        let contextToDel = entrada.contextos.findIndex( ent => ent === context.id )
        entrada.contextos.splice( contextToDel, 1 );
        entradaRef.doc(entrada.name).set({contextos: entrada.contextos}, {merge: true})
      } )
    }
    
    contextRef.doc( context.id ).delete()
    return 
  }
}
