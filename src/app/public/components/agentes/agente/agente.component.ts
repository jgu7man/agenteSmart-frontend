import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgenteModel } from '../init-agente/agente.model';
import { DashboardService } from '../../dashboard/dashboard.service';
import { iNavlink } from '../../navbar/navlink.interface';
import { ResponsiveService } from '../../../../services/responsive.service';
import { GdevCache } from '../../../../gdev-tools/src/lib/cache/gdev-cache.service';
import { CurrentAgenteService } from './current-agente.service';
import { GdevLoading } from '../../../../gdev-tools/src/lib/loading/loading.service';
import { CurrentMensajeService } from './mensajes/mensaje/current-mensaje.service';
import { Subscription } from 'rxjs';
import { ContextosService } from './contextos/contextos.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'aSmart-agente',
  templateUrl: './agente.component.html',
  styleUrls: ['./agente.component.scss']
})
export class AgenteComponent implements OnInit, OnDestroy {

  public agente: AgenteModel
  public projectId: string
  private _agenteSubscription: Subscription

  constructor (
    private _agente: CurrentAgenteService,
    private _cache: GdevCache,
    private _route: ActivatedRoute,
    private _mensaje: CurrentMensajeService,
    private _router: Router,
    public dashboard_: DashboardService,
    public resposive_: ResponsiveService,
    public _loading: GdevLoading,
    public responsive: ResponsiveService,
    private _contexts: ContextosService
  ) {

    // ANCHOR GET THE CURRENT PROJECT ID
    // NOTE INIZIALITE THE CURRENT AGENT
    this._route.params.subscribe(async params => {
      this._agenteSubscription =
      ( await this._agente.setCurrentAgente(params['id'])
      ).subscribe(() => {
        const url = this._router.url
        if ( url.slice(url.lastIndexOf('/') + 1) == params['id']) {
          this._router.navigate([`/dashboard/agente/${params['id']}/flujo`])
          this._contexts.getAllContexts().pipe(take(1)).subscribe()
        }
      })
    })

  }



  ngOnInit(): void {
    this.loadAgente()
    if ( this.resposive_.small ) {
      this.dashboard_.setMobileNavbar(this.agentLinks)
    }

  }



    async loadAgente() {
      this.agente = await this._cache.getAsyncKey('currentAgente')
      let projectId = this._cache.getDataKey('projectId')
      if (!this.agente.started) {
          this._router.navigate([`/dashboard/agente/${ projectId }/start`])
      }
  }

  agentLinks:iNavlink[] = [
    { path: 'filtro', label: 'Filtro', icon: 'fa-filter' },
    { path: 'flujo', label: 'Flujo', icon:'fa-sitemap' },
    { path: 'tipos', label: 'Tipos', icon:'fa-list-alt' },
    // { path: 'configuraciones', label: 'Configuración', icon: 'fa-cog' },
    // { path: 'integraciones', label: 'Integraciones', icon: 'fa-plug' },
    // { path: 'conversasiones', label: 'Conversaciones', icon: 'fa-comment-dots' },

  ]

    ngOnDestroy() {
      this._agente.current = {} as AgenteModel
      this._agente.unsubscribeIntentList()
      // this._agente.firestoreIntentListSubs.unsubscribe()
      if (this._agente.coleccionesSubs)
        this._agente.coleccionesSubs.unsubscribe()
        // this._agente.tiposSubs.unsubscribe()
      if(this._agente.contextosSubs)
        this._agente.contextosSubs.unsubscribe()
      if(this._agente.tarjetasSubs)
        this._agente.tarjetasSubs.unsubscribe()
      this._agenteSubscription.unsubscribe()
    }

}


