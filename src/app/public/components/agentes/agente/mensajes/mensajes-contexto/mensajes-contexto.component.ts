import { AlertService } from './../../../../../../gdev-tools/alerts/alert.service';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ContextosService } from '../../contextos/contextos.service';
import { ActivatedRoute } from '@angular/router';
import { Loading } from '../../../../../../gdev-tools/loading/loading.service';
import { TextService } from 'src/app/services/text.service';
import { AgenteModel } from '../../../init-agente/agente.model';
import { AgentesService } from '../../../agentes.service';
import { MensajesService } from '../mensajes.service';
import { IntentModel } from '../mensaje.model';
import { CacheService } from '../../../../../../gdev-tools/cache/cache.service';
import { ContextoModel } from '../../contextos/contexto.model';
import { startWith, map, tap, distinctUntilChanged } from 'rxjs/operators';
import { DiagramService } from '../diagram/diagram.service';
import { DiagramProps } from '../diagram/diagram-data.interface';
import { CurrentAgenteService } from '../../current-agente.service';

@Component({
    selector: 'aSmart-mensajes-by-contexto',
    templateUrl: './mensajes-contexto.component.html',
    styleUrls: ['./mensajes-contexto.component.scss'],
})
export class MensajesByContextoComponent implements OnInit {
    agente: AgenteModel;
    projectId;
    newIntent: string = '';
    switchAddIntent: boolean = false;
    mensajes: IntentModel[];

    @Input() contexto: ContextoModel;
    @ViewChild('intentNuevo') intentNuevo: ElementRef;

    constructor(
        private _loading: Loading,
        public mensajes_: MensajesService,
        private _cache: CacheService,
        private _alerta: AlertService,
        public diagram_: DiagramService,
        private _agente: CurrentAgenteService
    ) {}

    async ngOnInit() {
        this._agente.intentList$
            .pipe(
                startWith( [] ),
                // tap(x => console.log(x.length)),
                distinctUntilChanged( ( x, y ) => x.length
                    ? x.length == y.length
                    : x == y) )
            .subscribe((get) => this.getMensajes());
    }

    async getMensajes() {
        
        this.mensajes = await this.mensajes_.getMensajesListByContexto(this.contexto);
        let contextosLists = this._cache.getDataKey('contextosLists');
        let agentContextos = this._cache.getDataKey<ContextoModel[]>('contextos')

        
        
        if (!contextosLists) {
            contextosLists = { [this.contexto.contextName]: this.mensajes };
        }
        else {
            contextosLists[this.contexto.contextName] = this.mensajes;
        }
        if (agentContextos) {
            
            Object.keys(contextosLists).forEach((name) => {
                let contexto = agentContextos.find(c => c.contextName == name)
                if (!contexto) delete contextosLists[name]
            })
    
        }
        this._cache.updateData('contextosLists', contextosLists);
        
    }

    getMensajeRoute(name:string) {
        name = name.slice(name.lastIndexOf('/') + 1);
        return name
    }

    trackByName(index, intent: IntentModel) {
        return intent.name;
    }

    async toAddIntent() {
        this.switchAddIntent = !this.switchAddIntent;
        await this._loading.waitFor(100);
        this.intentNuevo.nativeElement.focus();
    }

    async onAddIntent(contexto) {
        this._loading.toggleWaitingSpinner(true)
        this.switchAddIntent = false;
        if(!this.mensajes) this.mensajes = []

        if (this.newIntent) {
            let lastIndex = this.mensajes.length;
            console.log(`creado ${this.newIntent}, index: ${lastIndex}`)
            await this.mensajes_.setMensaje(this.newIntent, lastIndex, contexto);
            
        }
    }

    async setDiagramaData(props: DiagramProps, id) {
        this.diagram_.object$.next({
            props,
            id,
            anchors: await this.mensajes_.getFollowingMensajes(id),
        });
    }
}
