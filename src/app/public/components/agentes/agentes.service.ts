import { Injectable } from '@angular/core';
import { UserInterface, AuthService } from '../../../admin/auth/auth.service';
import { AgenteModel } from './init-agente/agente.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AgentesService {
    
    usuario: UserInterface
    agentes: AgenteModel[]
    public getAgentes: Subject<AgenteModel[]> = new Subject()
    constructor (
        private afs: AngularFirestore,
        public _auth: AuthService,
        private router: Router
    ) {
        
    }
    
    async loadAgentes(usuario) {
        this.agentes = []
        
        const agentesCol = await this.afs.collection( 'usuarios' ).ref
            .doc( usuario.uid ).collection( 'agentes' ).get()
    
        agentesCol.forEach( agente => {
            this.agentes.push( agente.data() as AgenteModel )
        } )
        
        return this.getAgentes.next(this.agentes)
            
            

    }

}