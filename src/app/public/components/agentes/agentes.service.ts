import { Injectable } from '@angular/core';
import { UserInterface, AuthService } from '../../../admin/auth/auth.service';
import { AgenteModel } from './init-agente/agente.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { CacheService } from '../../../Gdev-Tools/cache/cache.service';
import { Loading } from '../../../Gdev-Tools/loading/loading.service';
import { switchMap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AgentesService {
    
    usuario: UserInterface
    $agente:AgenteModel
    agentes: AgenteModel[]
    agente$: Subject<AgenteModel> = new Subject()
    public getAgentes: Subject<AgenteModel[]> = new Subject()

    agentes$ = new Observable<any>()

    constructor (
        private afs: AngularFirestore,
        public _auth: AuthService,
        private router: Router,
        private _cache: CacheService,
        private loading: Loading
    ) {
        this.listenAgentes()    
    }

    /**
     * Establece la suscripción a los agentes
     */
    private listenAgentes() {
        this._auth.getCurrentUser().then( user => {
            if ( user ) {
                this.agentes$ = this.afs.collection( 'usuarios' )
                    .doc( user.uid ).collection('agentes').valueChanges()
            }
        })
    }
    
    
    
    async loadAgentes() {
        this.agentes = await this._cache.getDataKey( 'agentesList' )
        if ( !this.agentes ) {
            this.agentes = []
            
            // Obtiene el usuario autenticado
            this.usuario = await this._auth.getCurrentUser()
            
            const agentesCol = await this.afs.collection( 'usuarios' ).ref
                .doc( this.usuario.uid ).collection( 'agentes' ).get()
        
            await this.loading.asyncForEach( agentesCol.docs, agente => {
                this.agentes.push( agente.data() as AgenteModel )
            } )

            this._cache.updateData('agentesList', this.agentes)

        } 

        return this.agentes

    }
    

    async loadOneAgente(  projectId ) {
        const agentesRES = await this.afs.collection( 'usuarios' ).ref
            .doc( this.usuario.uid ).collection( 'agentes' )
            .where( 'projectId', '==', projectId ).get()
        let Agente = agentesRES.docs[ 0 ].data() as AgenteModel
        this.agente$.next( Agente )
        return this.agente$
    }

}