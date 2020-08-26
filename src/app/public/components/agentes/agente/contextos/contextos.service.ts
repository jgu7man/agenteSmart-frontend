import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { UserInterface, AuthService } from '../../../../../admin/auth/auth.service';
import { MensajesService } from '../mensajes/mensajes.service';
import { IntentModel } from '../mensajes/mensaje.model';
import { CacheService } from '../../../../../Gdev-Tools/cache/cache.service';
import { Contexto } from './contexto.model';
import { CurrentAgenteService } from '../current-agente.service';
import { take } from 'rxjs/operators';
import { GdevAlertServiceModule } from '../../../../../Gdev-Tools/alerts/gdev-alert-service.module';
import { AlertService } from '../../../../../Gdev-Tools/alerts/alert.service';

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
    private _mensajes: MensajesService,
    private _agente: CurrentAgenteService
  ) {
  }
  
  async contextosCollection() {
    const contextosPath = await this._agente.getPath( 'contextos' )
    const contextosRef = this.afs.collection( contextosPath ).ref;
    return contextosRef
  }



  // SECTION CRUD de contextos

  // CREATE

  
  async setContext( contexto: Contexto ) {

    if ( !contexto.id ) {
      var contextList = await this.getAllContexts()
      let contextFinded = contextList.find(context => context.contextName === contexto.contextName)
      if ( !contextFinded ) {
        let contextNuevo = await ( await this.contextosCollection() ).add( contexto );
        await (await this.contextosCollection()).doc( contextNuevo.id ).update( { id: contextNuevo.id })
      } else {
        this._alerta.sendMessageAlert('Contexto duplicado')
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
    var mensajesPath = await  this._agente.getPath('mensajes')
    const mensajeRef = this.afs.collection(mensajesPath).ref;
      
    const mensajes = await this._mensajes.getMensajesListByContexto( context )
    if ( mensajes.length > 0 ) {
      mensajes.forEach( ( mensaje: IntentModel ) => {
        let contextToDel = mensaje.contextos.findIndex( ent => ent === context.id )
        mensaje.contextos.splice( contextToDel, 1 );
        mensajeRef.doc(mensaje.name).set({contextos: mensaje.contextos}, {merge: true})
      } )
    }
    
    await (await this.contextosCollection()).doc( context.id ).delete()
    return 
  }
}
