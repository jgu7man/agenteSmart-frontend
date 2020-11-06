import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgenteModel } from '../init-agente/agente.model';
import { DashboardService } from '../../dashboard/dashboard.service';
import { NAVLINK } from '../../navbar/navlink.interface';
import { ResponsiveService } from '../../../../services/responsive.service';
import { CacheService } from '../../../../Gdev-Tools/cache/cache.service';
import { CurrentAgenteService } from './current-agente.service';

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
    private _cache: CacheService,
    private _route: ActivatedRoute,
    public resposive_: ResponsiveService,
  ) {

    // GET THE CURRENT PROJECT ID
    this._route.params.subscribe( params => {
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
    this.agente = await this._agente.get()
  }

  agentLinks:NAVLINK[] = [
    { path: 'bienvenida', label: 'Bienvenida', icon: 'fa-filter' },
    { path: 'mensajes', label: 'Flujo', icon:'fa-sitemap' },
    { path: 'tipos', label: 'Tipos', icon:'fa-exchange-alt' },
    { path: 'opciones', label: 'Configuración', icon: 'fa-cog' },
  ]

  ngOnDestroy() {
    this._agente.tiposSubs.unsubscribe()
    this._agente.contextosSubs.unsubscribe()
    this._agente.tarjetasSubs.unsubscribe()
  }

}


