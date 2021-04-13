import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResponsiveService } from '../../../../../../services/responsive.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CurrentMensajeService } from './current-mensaje.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {AppState} from 'src/app/app.state';

@Component({
  selector: 'aSmart-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.scss']
})
export class MensajeComponent implements OnInit, OnDestroy {

  mensajeName: string
  // mensaje: IntentModel
  private inMensaje$: Subscription
  private stateSubs: Subscription
  private intentName: string
  private currentContexto: string

  constructor (
    public responsive: ResponsiveService,
    private router: Router,
    private _mensaje: CurrentMensajeService,
    private store: Store<AppState>,
    private _route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.getCurrentIntent()
    this.stateSubs = this.store.select('editIntent')
      .subscribe((store) => {
      if ( store.unsaved == false ) {
        this.getCurrentIntent()
      }
    });
    this.updateMensaje()
  }

  getCurrentIntent() {
    this.intentName = this._route.snapshot.params['name']
    this.currentContexto = this._route.snapshot.queryParams['contexto']
    // console.log(this.intentName, this.currentContexto);
    this._mensaje.setCurrent(this.intentName, this.currentContexto)

  }

  updateMensaje() {
    this.inMensaje$ =
      this.router.events.subscribe( ( val ) => {
        if ( val instanceof NavigationEnd ) {
          console.log('update');

          this.getCurrentIntent()
        }
      })
  }



  ngOnDestroy(): void {
    this._mensaje.unsubscribe()
    this.inMensaje$.unsubscribe()
    this.stateSubs.unsubscribe()
    // console.log('unsubscribe');
  }

}
