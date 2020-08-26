import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResponsiveService } from '../../../../../../services/responsive.service';
import { IntentModel } from '../mensaje.model';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CurrentMensajeService } from './current-mensaje.service';
import { Observer, Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'aSmart-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.scss']
})
export class MensajeComponent implements OnInit, OnDestroy {

  mensajeName: string
  mensaje: IntentModel
  inMensaje: Subscription
  constructor (
    public responsive: ResponsiveService,
    private _route: ActivatedRoute,
    private router: Router,
    private _mensaje: CurrentMensajeService,
    private _dialog: MatDialog,
  ) {
    this.mensajeName = this._route.snapshot.paramMap.get( 'name' )
   }

  ngOnInit(): void {
    this.loadMensaje()
    this.inMensaje =
    this.router.events.subscribe( ( val ) => {
      if ( val instanceof NavigationEnd ) {
        this.mensajeName = this._route.snapshot.paramMap.get( 'name' )
        this.loadMensaje()
      }
    } )
  }
  
  async loadMensaje() {
    var contexto = this._route.snapshot.queryParamMap.get( 'contexto' )
    this.mensaje = await this._mensaje.get( this.mensajeName, contexto )
  }

  ngOnDestroy(): void {
    this.inMensaje.unsubscribe()
  }

}
