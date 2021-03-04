import { CacheService } from './../../../../../../gdev-tools/cache/cache.service';
import { AppState } from './../../../../../../app.state';
import { Store } from '@ngrx/store';
import { AlertService } from './../../../../../../gdev-tools/alerts/alert.service';
import { CurrentMensajeService } from './../../mensajes/mensaje/current-mensaje.service';
import { ResponsiveService } from './../../../../../../services/responsive.service';
import { IntentModel } from './../../mensajes/mensaje.model';
import { Observable, Subscription } from 'rxjs';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'aSmart-start-frases',
  templateUrl: './start-frases.component.html',
  styleUrls: ['./start-frases.component.scss']
})
export class StartFrasesComponent implements OnInit {

    intent$: Observable<IntentModel> = new Observable();
    stateSubs: Subscription;
    unsaved: boolean;
    listenSaved: boolean

    @Output() saved = new EventEmitter<any>();
    constructor(
        public responsive: ResponsiveService,
        public mensaje_: CurrentMensajeService,
        private _alerts: AlertService,
        public store: Store<AppState>,
        private _cache: CacheService
    ) {}

    ngOnInit(): void {
        this.getWelcomeIntent()
        // this.loading.toggleWaitingSpinner(true)
        this.stateSubs = this.store.subscribe((store) => {
            this.unsaved = store.editIntent.unsaved;
            console.log('unsaved:', this.unsaved)

            if (this.listenSaved && !this.unsaved) {
                this.saved.emit()
            } else if (this.unsaved == false) {
                this.getWelcomeIntent();
            } else {
                this.listenSaved = true
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
