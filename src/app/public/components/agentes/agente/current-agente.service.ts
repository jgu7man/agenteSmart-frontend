import { Injectable } from '@angular/core';
import { AgenteModel } from '../init-agente/agente.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService, UserInterface } from '../../../../admin/auth/auth.service';
import { CacheService } from '../../../../global/cache/cache.service';
import { Subject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

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
  } 
  
  
  
  async get( projectId? ) {
    this.usuario = await this._auth.getCurrentUser()
    const agentesRES = await this.fs.collection( 'usuarios' ).ref
      .doc( this.usuario.uid ).collection( 'agentes' )
      .where( 'projectId', '==', projectId ).get()
    
    let Agente = agentesRES.docs[ 0 ].data() as AgenteModel

    this.currentAgent = Agente
    this._cache.updateData( 'agenteId', this.currentAgent.agenteId )
    this.agente$.next( Agente )
    return Agente
    
  }

  async getPath( col?) {
    const cacheAgenteId = await this._cache.getDataKey( 'agenteId' )
    const userId = await ( await this._auth.getCurrentUser() ).uid
    var agenteId = cacheAgenteId ? cacheAgenteId : await ( await this.agente$.pipe( take( 1 ) ).toPromise() ).agenteId

    return !col ? `usuarios/${ userId }/agentes/${ agenteId }` : `usuarios/${ userId }/agentes/${ agenteId }/${col}`
  }
}
