import { AlertService } from 'src/app/gdev-tools/alerts/alert.service';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Loading } from 'src/app/gdev-tools/loading/loading.service';
import { AgenteModel } from '../../../init-agente/agente.model';
import { MensajesService } from '../mensajes.service';
import { IntentModel } from '../mensaje.model';
import { CacheService } from 'src/app/gdev-tools/cache/cache.service';
import { ContextoModel } from '../../contextos/contexto.model';
import { startWith, distinctUntilChanged } from 'rxjs/operators';
import { DiagramService } from '../diagram/diagram.service';
import { DiagramProps } from '../diagram/diagram-data.interface';
import { CurrentAgenteService } from '../../current-agente.service';
import { ContextosService } from '../../contextos/contextos.service';

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
        private _agente: CurrentAgenteService,
        private _contexts: ContextosService
    ) {
    }

    async ngOnInit() {
        this.getMensajes()
    }

    async getMensajes() {
        this._agente.intentList$.pipe(
            distinctUntilChanged( ( x, y ) => x && ( x.length == y.length))
        ).subscribe(async () => {
            await this.mensajes_.getMensajesListByContexto(this.contexto).then(list => {
                this.mensajes = list
                this._contexts.setContextosList(this.contexto.contextName, list)
            })
        });
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
        this._loading.toggleWaitingSpinner('open')
        this.switchAddIntent = false;
        if(!this.mensajes) this.mensajes = []

        if (this.newIntent) {
            let lastIndex = this.mensajes.length;
            console.log(`creado ${this.newIntent}, index: ${lastIndex}`)
            await this.mensajes_.saveNewMensaje(this.newIntent, lastIndex, contexto);

        }
    }

    async setDiagramaData(props: DiagramProps, id) {
        this.diagram_.object$.next({
            props,
            id,
            anchors: await this.mensajes_.getNextMensajes(id),
        });
    }
}
