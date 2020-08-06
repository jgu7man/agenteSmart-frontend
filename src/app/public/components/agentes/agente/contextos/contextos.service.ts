import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { UserInterface, AuthService } from '../../../../../admin/auth/auth.service';
import { AlertService } from '../../../../../global/alert/alert.service';
import { EntradasService } from '../entradas/entradas.service';
import { EntradaModel } from '../entradas/entrada.model';
import { CacheService } from '../../../../../global/cache/cache.service';
import { Contexto } from './contexto.model';
import { CurrentAgenteService } from '../agente.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContextosService {

  contexts: string[]
  user: UserInterface
  agenteId: string
  agentePath
  contextRef:CollectionReference
  constructor (
    private afs: AngularFirestore,
    private _alerta: AlertService,
    private _entradas: EntradasService,
    private _agente: CurrentAgenteService
  ) {
  }
  
  async getAgentePath() {
    return this.agentePath = await this._agente.getAgentePath('contextos')
  }
  
  async setContext( contexto: Contexto ) {
    this.getAgentePath()
    const contextRef = this.afs.collection(this.agentePath).ref;

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
    this.getAgentePath()
    const contextRef = this.afs.collection( this.agentePath ).ref;

    var contextDoc = await contextRef.doc( contexto.id ).get()
    var contextGeted: Contexto = contextDoc.data() as Contexto
    
    return contextGeted
    
  }




  async getAllContexts() {
    await this.getAgentePath()
    const contextRef = this.afs.collection(this.agentePath).ref.orderBy('index')
    var contextos: Contexto[] = []

    var contextCol = await contextRef.get()
    contextCol.forEach( contexto => {
      contextos.push(contexto.data() as Contexto)
    } )
    
    console.log(contextos);
    return contextos
  }


  async updateIndex( contextos: Contexto[] ) {
    this.getAgentePath()
    const contextRef = this.afs.collection( this.agentePath ).ref;

    contextos.forEach( (contexto, index) => {
      contextRef.doc(contexto.id).update({index:index})
    } )
    return 
  }



  async delContext( context:Contexto  ) {
    this.getAgentePath()
    const contextRef = this.afs.collection( this.agentePath ).ref;
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
