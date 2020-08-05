import { Injectable } from '@angular/core';
import { UserInterface, AuthService } from '../../../admin/auth/auth.service';
import { AgenteModel } from './init-agente/agente.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AgentesService {
    
    usuario: UserInterface
    $agente:AgenteModel
    agentes: AgenteModel[]
    agente$: Subject<AgenteModel> = new Subject()
    public getAgentes: Subject<AgenteModel[]> = new Subject()
    constructor (
        private afs: AngularFirestore,
        public _auth: AuthService,
        private router: Router
    ) {
    }
    
    async getData() {
        this.usuario = await this._auth.getCurrentUser()
    }
    
    async loadAgentes() {
        this.agentes = []
        
        const agentesCol = await this.afs.collection( 'usuarios' ).ref
            .doc( this.usuario.uid ).collection( 'agentes' ).get()
    
        agentesCol.forEach( agente => {
            this.agentes.push( agente.data() as AgenteModel )
        } )
        
        return this.getAgentes.next(this.agentes)
            
            

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