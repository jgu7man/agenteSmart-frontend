import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResponsiveService } from '../../../../../../services/responsive.service';
import { IntentModel } from '../mensaje.model';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CurrentMensajeService } from './current-mensaje.service';
import { Observer, Subscriber, Subscription } from 'rxjs';
import { Loading } from '../../../../../../Gdev-Tools/loading/loading.service';

@Component({
  selector: 'aSmart-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.scss']
})
export class MensajeComponent implements OnInit, OnDestroy {

  mensajeName: string
  // mensaje: IntentModel
  inMensaje$: Subscription
  updated$: Subscription
  constructor (
    public responsive: ResponsiveService,
    private _route: ActivatedRoute,
    private router: Router,
    private _mensaje: CurrentMensajeService,
    private _dialog: MatDialog,
    private loading: Loading
  ) {
   }

  ngOnInit(): void {
    // this.loadMensaje()
    this.updateMensaje()
  }

  updateMensaje() {
    this.inMensaje$ =
      this.router.events.subscribe( ( val ) => {
        if ( val instanceof NavigationEnd ) {
          // this.loadMensaje()
          console.log('cambio');
        }
      } )
    
    this.updated$ = 
      this._mensaje.updateCurrtentMensaje$.subscribe( updated => {
        console.log('updated');
        // this.loadMensaje()
      })
  }
  
  

  ngOnDestroy(): void {
    this.inMensaje$.unsubscribe()
  }

}
