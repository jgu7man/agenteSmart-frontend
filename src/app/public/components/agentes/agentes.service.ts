import { Injectable } from '@angular/core';
import { UserInterface, AuthService } from '../../../admin/auth/auth.service';
import { AgenteModel } from './init-agente/agente.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { CacheService } from '../../../Gdev-Tools/cache/cache.service';
import { Loading } from '../../../Gdev-Tools/loading/loading.service';
import { switchMap } from 'rxjs/operators';
import { AlertService } from '../../../Gdev-Tools/alerts/alert.service';

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
        private loading: Loading,
        private _alerts: AlertService
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
    

    async loadOneAgente( projectId ) {
        this.usuario = this._cache.getDataKey('user')
        const agentesRES = await this.afs.collection( 'usuarios' ).ref
            .doc( this.usuario.uid ).collection( 'agentes' )
            .where( 'projectId', '==', projectId ).get()
        let Agente = agentesRES.docs[ 0 ].data() as AgenteModel
        
        return Agente
    }


    async editAgent( agent: AgenteModel ) {
        this.usuario = this._cache.getDataKey( 'user' )
        
        Object.keys(agent).forEach(key => { if (agent[key] == undefined) delete agent[key]})
        const agenetRef = this.afs.collection( 'usuarios' ).ref.doc( this.usuario.uid )
            .collection( 'agentes' ).doc( agent.projectId )
        
        try {
            await agenetRef.set( { ...agent }, { merge: true } )
            this._alerts.sendFloatNotification('Agente editado')
        } catch (error) {
            console.error(error)
            this._alerts.sendError('No se pudo editar el agente', error)
        }
        
        this.router.navigate(['/dashboard/agentes'])
    }


    // Arreglo de lenguaje
    lenguajes = [
        { name: 'Alemán', code: 'de' },
        { name: 'Coreano', code: 'ko' },
        { name: 'Español latino', code: 'es-419' },
        { name: 'Español españa', code: 'es-ES' },
        { name: 'Francés', code: 'fr' },
        { name: 'Francés canadiense', code: 'fr-CA' },
        { name: 'Francés de francia', code: 'fr-FR' },
        { name: 'Inglés', code: 'en' },
        { name: 'Inglés EUA', code: 'en-US' },
        { name: 'Inglés Británico', code: 'en-GB' },
        { name: 'Italiano', code: 'it' },
        { name: 'Japonés', code: 'ja' },
        { name: 'Noruego', code: 'no' },
        { name: 'Portugués', code: 'pt-BR' },
        { name: 'Ruso', code: 'ru' },
    ]


    // Arreglo de zonas horarias

    zonasHorarias = [
        { display: '(GMT-12:00) Etc/GMT+12', value: 'Etc/GMT+12' },
        { display: '(GMT-11:00) Pacific/Midway', value: 'Pacific/Midway' },
        { display: '(GMT-10:00) Pacific/Honolulu', value: 'Pacific/Honolulu' },
        { display: '(GMT-9:00) America/Anchorage', value: 'America/Anchorage' },
        { display: '(GMT-9:00) US/Alaska', value: 'US/Alaska' },
        { display: '(GMT-8:00) America/Los_Angeles', value: 'America/Los_Angeles' },
        { display: '(GMT-7:00) Monterrey/Denver', value: 'America/Denver' },
        { display: '(GMT-6:00) Guatemala/CDMX/Chicago', value: 'America/Chicago' },
        { display: '(GMT-5:00) Lima/Bogotá/New_York/', value: 'America/New_York' },
        { display: '(GMT-4:00) Santiago/La Paz/Barbados', value: 'America/Barbados' },
        { display: '(GMT-3:00) Buenos_Aires/São Paulo', value: 'America/Buenos_Aires' },
        { display: '(GMT-2:00) Atlantic/South_Georgia', value: 'Atlantic/South_Georgia' },
        { display: '(GMT-1:00) Atlantic/Cape_Verde', value: 'Atlantic/Cape_Verde' },
        { display: '(GMT0:00) Africa/Casablanca', value: 'Africa/Casablanca' },
        { display: '(GMT+1:00) Europe/Madrid', value: 'Europe/Madrid' },
        { display: '(GMT+2:00) Europe/Kaliningrad', value: 'Europe/Kaliningrad' },
        { display: '(GMT+3:00) Europe/Moscow', value: 'Europe/Moscow' },
        { display: '(GMT+4:00) Asia/Dubai', value: 'Asia/Dubai' },
        { display: '(GMT+4:30) Asia/Kabul', value: 'Asia/Kabul' },
        { display: '(GMT+5:00) Asia/Yekaterinburg', value: 'Asia/Yekaterinburg' },
        { display: '(GMT+5:30) Asia/Colombo', value: 'Asia/Colombo' },
        { display: '(GMT+5:45) Asia/Kathmandu', value: 'Asia/Kathmandu' },
        { display: '(GMT+6:00) Asia/Almaty', value: 'Asia/Almaty' },
        { display: '(GMT+6:30) Asia/Rangoon', value: 'Asia/Rangoon' },
        { display: '(GMT+7:00) Asia/Bangkok', value: 'Asia/Bangkok' },
        { display: '(GMT+8:00) Asia/Hong_Kong', value: 'Asia/Hong_Kong' },
        { display: '(GMT+9:00) Asia/Tokyo', value: 'Asia/Tokyo' },
        { display: '(GMT+9:30) Australia/Darwin', value: 'Australia/Darwin' },
        { display: '(GMT+10:00) Australia/Sydney', value: 'Australia/Sydney' },
        { display: '(GMT+11:00) Pacific/Noumea', value: 'Pacific/Noumea' },
        { display: '(GMT+12:00) Pacific/Fiji', value: 'Pacific/Fiji' },
        { display: '(GMT+13:00) Pacific/Tongatapu', value: 'Pacific/Tongatapu' },
    ]

}