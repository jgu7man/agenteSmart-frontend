import { Injectable } from '@angular/core';
import { AgenteModel } from '../init-agente/agente.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService, UserInterface } from '../../../../admin/auth/auth.service';
import { CacheService } from '../../../../Gdev-Tools/cache/cache.service';
import { Subject, Observable } from 'rxjs';
import { take, filter, map } from 'rxjs/operators';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { event } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class CurrentAgenteService {

  currentAgent: AgenteModel
  currentProjectId: string
  usuario: UserInterface
  agente$: Subject<AgenteModel> = new Subject()
  mensajesList
  tipos
  

  constructor (
    private fs: AngularFirestore,
    private _cache: CacheService,
    private _auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.getCurrentUrl()
  } 

  getCurrentUrl() {
    this.router.events.pipe(
      filter( event => event instanceof NavigationEnd ),
      map( () => this.activatedRoute ),
      map( route => {
        while ( route.firstChild ) {
          route = route.firstChild;
        }
        return route;
      } ),
      filter( route => route.outlet === 'primary' )
    ).subscribe( ( route: ActivatedRoute ) => {
      this.currentProjectId = route.parent.snapshot.paramMap.get( 'id' )
      this._cache.updateData('projectId', this.currentProjectId)
    })
  }
  
  
  
  async get() {
    this.currentAgent = await this._cache.getDataKey( 'agente' ) as AgenteModel
    this.currentProjectId = await this._cache.getDataKey('projectId')
    
    if ( !this.currentAgent ) {
      
      this.usuario = await this._auth.getCurrentUser()
      const agentesRES = await this.fs.collection( 'usuarios' ).ref
        .doc( this.usuario.uid ).collection( 'agentes' )
        .where( 'projectId', '==', this.currentProjectId ).get()
    
      this.currentAgent = agentesRES.docs[ 0 ].data() as AgenteModel

      this._cache.updateData( 'agenteId', this.currentAgent.agenteId )
      this._cache.updateData( 'currentAgente', this.currentAgent)
    }

    return this.currentAgent
    
  }

  async getPath( col?) {
    const cacheAgenteId = await this._cache.getDataKey( 'agenteId' )
    const userId = await ( await this._auth.getCurrentUser() ).uid
    var agenteId = cacheAgenteId ? cacheAgenteId : await (await this.get()).agenteId
    return !col ? `usuarios/${ userId }/agentes/${ agenteId }` : `usuarios/${ userId }/agentes/${ agenteId }/${col}`
  }
}
