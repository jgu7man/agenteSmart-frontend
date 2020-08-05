import { Injectable } from '@angular/core';
import { AgenteModel } from '../init-agente/agente.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService, UserInterface } from '../../../../admin/auth/auth.service';
import { CacheService } from '../../../../global/cache/cache.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentAgenteService {

  currentAgent: AgenteModel
  usuario: UserInterface
  agente$: Subject<AgenteModel> = new Subject()

  constructor (
    private fs: AngularFirestore,
    private _cache: CacheService,
    private _auth: AuthService,
  ) {
    this.getCacheData()
  } 

  async getCacheData() {
    this.usuario = await this._auth.getCurrentUser()
  }
  
  
  async getCurrentAgent( projectId? ) {
    console.log(projectId);
    const agentesRES = await this.fs.collection( 'usuarios' ).ref
      .doc( this.usuario.uid ).collection( 'agentes' )
      .where( 'projectId', '==', projectId ).get()
    
    let Agente = agentesRES.docs[ 0 ].data() as AgenteModel

    this.currentAgent = Agente
    console.log( this.currentAgent );
    this._cache.updateData( 'agente', this.currentAgent )
    this._cache.updateData( 'agenteId', this.currentAgent.agenteId )
    this.agente$.next( Agente )
    return this.agente$ 
    
  }
}
