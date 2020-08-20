import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResponsiveService } from '../../../../../../services/responsive.service';
import { EntradaModel } from '../entrada.model';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CurrentEntradaService } from './current-entrada.service';
import { Observer, Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'aSmart-entrada',
  templateUrl: './entrada.component.html',
  styleUrls: ['./entrada.component.scss']
})
export class EntradaComponent implements OnInit, OnDestroy {

  entradaName: string
  entrada: EntradaModel
  inEntrada: Subscription
  constructor (
    public responsive: ResponsiveService,
    private _route: ActivatedRoute,
    private router: Router,
    private _entrada: CurrentEntradaService,
    private _dialog: MatDialog,
  ) {
    this.entradaName = this._route.snapshot.paramMap.get( 'name' )
   }

  ngOnInit(): void {
    this.loadEntrada()
    this.inEntrada =
    this.router.events.subscribe( ( val ) => {
      if ( val instanceof NavigationEnd ) {
        this.entradaName = this._route.snapshot.paramMap.get( 'name' )
        this.loadEntrada()
      }
    } )
  }
  
  async loadEntrada() {
    var contexto = this._route.snapshot.queryParamMap.get( 'contexto' )
    this.entrada = await this._entrada.get( this.entradaName, contexto )
  }

  ngOnDestroy(): void {
    this.inEntrada.unsubscribe()
  }

}
