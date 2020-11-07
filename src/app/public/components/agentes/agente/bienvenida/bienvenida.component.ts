import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from '../../../../../services/responsive.service';
import { CurrentAgenteService } from '../current-agente.service';
import { IntentModel } from '../mensajes/mensaje.model';
import { CurrentMensajeService } from '../mensajes/mensaje/current-mensaje.service';
import { CacheService } from '../../../../../Gdev-Tools/cache/cache.service';
import { AlertService } from '../../../../../Gdev-Tools/alerts/alert.service';
import { AppState } from '../../../../../app.state';
import { Store } from '@ngrx/store';
import { Subscription, Subject, Observable } from 'rxjs';
import { Loading } from '../../../../../Gdev-Tools/loading/loading.service';
import { first, take } from 'rxjs/operators';

@Component({
    templateUrl: './bienvenida.component.html',
    styleUrls: ['./bienvenida.component.scss'],
})
export class BienvenidaComponent implements OnInit {
    intent$: Observable<IntentModel> = new Observable();
    stateSubs: Subscription;
    unsaved: boolean;

    constructor(
        public responsive: ResponsiveService,
        private _agente: CurrentAgenteService,
        public mensaje_: CurrentMensajeService,
        private _alerts: AlertService,
        public store: Store<AppState>,
        private loading: Loading,
        private _cache: CacheService
    ) {}

    ngOnInit(): void {
        // this.loading.toggleWaitingSpinner(true)
        this.stateSubs = this.store.subscribe((store) => {
            this.unsaved = store.editIntent.unsaved;
            if (this.unsaved == false) {
                this.getWelcomeIntent();

            }
        });
        // this.mensaje_.mensajeUpdated$.subscribe(()=>)
    }

    async getWelcomeIntent() {
        this.intent$ = this._cache.listenForChanges<IntentModel>('currentIntent')
        await this.mensaje_.getCurrent('Default Welcome Intent')
        // await this.intent$.pipe(take(1)).toPromise()
        // this.loading.toggleWaitingSpinner(false)
    }


    async setIntent() {
        
        this._alerts.sendMessageAlert(
            'No se encontró el intent de bienvenida. Restáuralo en las configuraciones del agente.'
        );

        

    }

    ngOnDestroy() {
        this.stateSubs.unsubscribe();
        this.mensaje_.unsubscribe()
    }
}
