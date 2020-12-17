import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgenteModel } from '../init-agente/agente.model';
import { DashboardService } from '../../dashboard/dashboard.service';
import { NAVLINK } from '../../navbar/navlink.interface';
import { ResponsiveService } from '../../../../services/responsive.service';
import { CacheService } from '../../../../Gdev-Tools/cache/cache.service';
import { CurrentAgenteService } from './current-agente.service';
import { Loading } from '../../../../Gdev-Tools/loading/loading.service';
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
    private _cache: CacheService,
    private _route: ActivatedRoute,
    public resposive_: ResponsiveService,
    public loading: Loading,
    private _mensaje: CurrentMensajeService
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

    let intentNames = [
      // "4aec3563-4a8b-4f6e-9111-b51bbc5cbb1e", 
      "74386482-8087-49d8-bc74-f4d881673127"
    ]

    // intentNames.forEach( name => {
    //   this._mensaje.deleteIntentRequest(name)
      
    // })
  }

  async loadAgente() {
    this.agente = await this._agente.get()
    this.loading.toggleWaitingSpinner( false )
  }

  agentLinks:NAVLINK[] = [
    { path: 'bienvenida', label: 'Bienvenida', icon: 'fa-filter' },
    { path: 'mensajes', label: 'Flujo', icon:'fa-sitemap' },
    { path: 'tipos', label: 'Tipos', icon:'fa-list-alt' },
    { path: 'configuraciones', label: 'Configuración', icon: 'fa-cog' },
    // { path: 'opciones', label: 'Opciones', icon: 'fa-exchange-alt' },
  ]

  ngOnDestroy() {
    this._agente.tiposSubs.unsubscribe()
    this._agente.contextosSubs.unsubscribe()
    this._agente.tarjetasSubs.unsubscribe()
  }

}


