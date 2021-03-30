import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgenteModel } from '../init-agente/agente.model';
import { DashboardService } from '../../dashboard/dashboard.service';
import { NAVLINK } from '../../navbar/navlink.interface';
import { ResponsiveService } from '../../../../services/responsive.service';
import { GdevCache } from '../../../../gdev-tools/src/lib/cache/gdev-cache.service';
import { CurrentAgenteService } from './current-agente.service';
import { GdevLoading } from '../../../../gdev-tools/src/lib/loading/loading.service';
import { CurrentMensajeService } from './mensajes/mensaje/current-mensaje.service';

@Component({
  selector: 'aSmart-agente',
  templateUrl: './agente.component.html',
  styleUrls: ['./agente.component.scss']
})
export class AgenteComponent implements OnInit, OnDestroy {

  public agente: AgenteModel

  constructor (
    private _agente: CurrentAgenteService,
    private _dashboard: DashboardService,
    private _cache: GdevCache,
    private _route: ActivatedRoute,
    public resposive_: ResponsiveService,
    public _loading: GdevLoading,
    private _mensaje: CurrentMensajeService,
    private _router: Router
  ) {

    // ANCHOR GET THE CURRENT PROJECT ID
    this._route.params.subscribe(params => {
        this._agente.projectId = params['id']
        this._cache.updateData('projectId', params['id'])
    })
   }



  ngOnInit(): void {
    this.loadAgente()
    if ( this.resposive_.small ) {
      this._dashboard.setMobileNavbar(this.agentLinks)
    }

  }

    async loadAgente() {
    // ANCHOR INIZIALIZA EL AGENTE Y TODAS SUS SUBSCRIPCIONES
      this.agente = await this._agente.get()
      let projectId = this._cache.getDataKey('projectId')
      if (!this.agente.started) {
          this._router.navigate([`/dashboard/agente/${ projectId }/start`])
      }
    //   else {
    //       this._router.navigate([`/dashboard/agente/${ projectId }/mensajes`])
    //   }
      this._loading.toggleWaitingSpinner( 'close' )
  }

  agentLinks:NAVLINK[] = [
    { path: 'bienvenida', label: 'Bienvenida', icon: 'fa-filter' },
    { path: 'mensajes', label: 'Flujo', icon:'fa-sitemap' },
    { path: 'tipos', label: 'Tipos', icon:'fa-list-alt' },
    // { path: 'configuraciones', label: 'Configuración', icon: 'fa-cog' },
    // { path: 'integraciones', label: 'Integraciones', icon: 'fa-plug' },
    // { path: 'conversasiones', label: 'Conversaciones', icon: 'fa-comment-dots' },

  ]

    ngOnDestroy() {
        this._agente.current = {} as AgenteModel
        this._agente.unsubscribeIntentList()
        this._agente.firestoreIntentListSubs.unsubscribe()
        this._agente.coleccionesSubs.unsubscribe()
        this._agente.tiposSubs.unsubscribe()
        this._agente.contextosSubs.unsubscribe()
        this._agente.tarjetasSubs.unsubscribe()
    }

}


