import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResponsiveService } from '../../../../../../services/responsive.service';
import { Router, NavigationEnd } from '@angular/router';
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

  constructor (
    public responsive: ResponsiveService,
    private router: Router,
    private _mensaje: CurrentMensajeService,
    private store: Store<AppState>
  ) {
  }
  
  ngOnInit(): void {
    this.stateSubs = this.store.subscribe((store) => {
      if (store.editIntent.unsaved == false) {
        this._mensaje.getByActivatedRoute()
      }
    });
    this.updateMensaje()
  }

  updateMensaje() {
    this.inMensaje$ =
      this.router.events.subscribe( ( val ) => {
        if ( val instanceof NavigationEnd ) {
          this._mensaje.getByActivatedRoute()
        }
      } )
    
    
  }
  
  

  ngOnDestroy(): void {
    this._mensaje.unsubscribe()
    this.inMensaje$.unsubscribe()
    console.log('unsubscribe');
  }

}
