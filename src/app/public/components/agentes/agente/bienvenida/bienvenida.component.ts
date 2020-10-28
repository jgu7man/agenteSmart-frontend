import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from '../../../../../services/responsive.service';
import { CurrentAgenteService } from '../current-agente.service';
import { IntentModel } from '../mensajes/mensaje.model';
import { CurrentMensajeService } from '../mensajes/mensaje/current-mensaje.service';
import { CacheService } from '../../../../../Gdev-Tools/cache/cache.service';
import { AlertService } from '../../../../../Gdev-Tools/alerts/alert.service';
import { AppState } from '../../../../../app.state';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Loading } from '../../../../../Gdev-Tools/loading/loading.service';

@Component({
    templateUrl: './bienvenida.component.html',
    styleUrls: ['./bienvenida.component.scss'],
})
export class BienvenidaComponent implements OnInit {
    intent: IntentModel;
    stateSubs: Subscription;
    unsaved: boolean;

    constructor(
        public responsive: ResponsiveService,
        private _agente: CurrentAgenteService,
        public mensaje_: CurrentMensajeService,
        private _alerts: AlertService,
        public store: Store<AppState>,
        private loading: Loading
    ) {}

    ngOnInit(): void {
        this.loading.toggleWaitingSpinner(true)
        this.getWelcomeIntent();
        this.stateSubs = this.store.subscribe((store) => {
            this.unsaved = store.editIntent.unsaved;
        });
    }

    async getWelcomeIntent() {
        this._agente.mensajesLoaded$.subscribe(async () => {
            this.intent = this._agente.mensajesList.find(
                (i) => i.displayName == 'Default Welcome Intent'
            );

            if (this.intent) {
                await this.mensaje_.getRespuestasList();
                this.mensaje_.setCurrent(this.intent)
            } else {
                this._alerts.sendMessageAlert(
                    'No se encontró el intent de bienvenida. Restáuralo en las configuraciones del agente.'
                );
            }
            this.loading.toggleWaitingSpinner(false)
        });
    }

    ngOnDestroy() {
        this.stateSubs.unsubscribe();
    }
}
