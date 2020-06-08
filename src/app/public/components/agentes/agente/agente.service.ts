import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInterface, AuthService } from '../../../../admin/auth/auth.service';
import { AlertService } from '../../../../global/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AgenteService {

  contexts: string[]
  user: UserInterface
  constructor (
    private afs: AngularFirestore,
    private _auth: AuthService,
    private _alerta: AlertService
  ) {
    this._auth.getCurrentUser().then(user =>this.user = user)
   }
  
  async setContext(agenteID, contextName) {
    const contextRef = this.afs.collection(
      `usuarios/${ this.user.uid }/agentes/${ agenteID }/contextos`
    ).ref;

    let contextCol = await contextRef.get() 
    if ( contextCol.size > 0 ) {
      let contextList = [];
      contextCol.forEach( context => { contextList.push(context.id) })
      if ( !contextList.includes( contextName ) ) {
        await contextRef.doc( contextName )
        .set( { contextName: contextName }, { merge: true } )
      } else {
        this._alerta.sendAlertMessage('Contexto duplicado')
      }
    } else {
      await contextRef.doc( contextName )
        .set( { contextName: contextName }, { merge: true } )
    }



    return 
  }

  async getContexts( agenteID ) {
    var user = await this._auth.getCurrentUser()
    const contextRef = this.afs.collection(
      `usuarios/${ user.uid }/agentes/${ agenteID }/contextos`
    ).ref
    var contextos: string[] = []

    var contextCol = await contextRef.get()
    contextCol.forEach( contexto => {
      contextos.push(contexto.id)
    } )
    
    console.log(contextos);
    return contextos
  }
}
