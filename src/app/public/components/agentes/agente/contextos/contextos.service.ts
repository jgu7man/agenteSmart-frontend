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
  
  async contextosCollection() {
    const contextosPath = await this._agente.getAgentePath( 'contextos' )
    const contextosRef = this.afs.collection( contextosPath ).ref;
    return contextosRef
  }



  // TITLE CRUD de contextos

  // CREATE

  
  async setContext( contexto: Contexto ) {

    if ( !contexto.id ) {
      var contextList = await this.getAllContexts()
      let contextFinded = contextList.find(context => context.contextName === contexto.contextName)
      if ( !contextFinded ) {
        let contextNuevo = await ( await this.contextosCollection() ).add( contexto );
        await (await this.contextosCollection()).doc( contextNuevo.id ).update( { id: contextNuevo.id })
      } else {
        this._alerta.sendAlertMessage('Contexto duplicado')
      }
    } else {
      await (await this.contextosCollection()).doc( contexto.id ).update( contexto )
    }
    return 
  }


  // READ


  async getOneContext( contexto: Contexto ) {
    

    var contextDoc = await (await this.contextosCollection()).doc( contexto.id ).get()
    var contextGeted: Contexto = contextDoc.data() as Contexto
    
    return contextGeted
    
  }


  // READ ALL

  

  async getAllContexts() {
    var contextos: Contexto[] = []

    var contextCol = await (await this.contextosCollection()).orderBy('index').get()
    contextCol.forEach( contexto => {
      contextos.push(contexto.data() as Contexto)
    } )
    
    console.log(contextos);
    return contextos
  }


  // UPDATE Index


  async updateIndex( contextos: Contexto[] ) {
    

    contextos.forEach( async (contexto, index) => {
      await (await this.contextosCollection()).doc(contexto.id).update({index:index})
    } )
    return 
  }



  // DELETE



  async delContext( context:Contexto  ) {
    var entradasPath = await  this._agente.getAgentePath('entradas')
    const entradaRef = this.afs.collection(entradasPath).ref;
      
    const entradas = await this._entradas.getEntradasListByContexto( context )
    if ( entradas.length > 0 ) {
      entradas.forEach( ( entrada: EntradaModel ) => {
        let contextToDel = entrada.contextos.findIndex( ent => ent === context.id )
        entrada.contextos.splice( contextToDel, 1 );
        entradaRef.doc(entrada.name).set({contextos: entrada.contextos}, {merge: true})
      } )
    }
    
    await (await this.contextosCollection()).doc( context.id ).delete()
    return 
  }
}
