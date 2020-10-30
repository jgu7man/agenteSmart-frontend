import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgentesService } from '../agentes.service';
import { AuthService } from '../../../../admin/auth/auth.service';
import { AgenteModel } from '../init-agente/agente.model';
import { DashboardService } from '../../dashboard/dashboard.service';
import { NAVLINK } from '../../navbar/navlink.interface';
import { ResponsiveService } from '../../../../services/responsive.service';
import { CacheService } from '../../../../Gdev-Tools/cache/cache.service';
import { CurrentAgenteService } from './current-agente.service';
import { MensajesService } from './mensajes/mensajes.service';
import { IntentModel } from './mensajes/mensaje.model';

@Component({
  selector: 'aSmart-agente',
  templateUrl: './agente.component.html',
  styleUrls: ['./agente.component.scss']
})
export class AgenteComponent implements OnInit, OnDestroy {


  agente: AgenteModel
  projectId: string
  mensajesList: IntentModel
  constructor (
    private _agente: CurrentAgenteService,
    private _dashboard: DashboardService,
    public _responsive: ResponsiveService,
    private _cache: CacheService,
    private _route: ActivatedRoute,
  ) {
    this._route.params.subscribe( params => {
      this._cache.updateData('projectId', params['id'])
    })
   }

  ngOnInit(): void {
    this.loadAgente()
    if ( this._responsive.small ) {
      this._dashboard.setMobileNavbar(this.agentLinks)
    }
    // this._agente.getAllIntents().then( res => {console.log( res );} )
    this._cache.updateData('allMensajes', this.mensajesList);
  }

  async loadAgente() {

    this.agente = await this._agente.get()

    
  }

  agentLinks:NAVLINK[] = [
    { path: 'bienvenida', label: 'Bienvenida', icon: 'fa-filter' },
    { path: 'mensajes', label: 'Flujo', icon:'fa-sitemap' },
    { path: 'tipos', label: 'Tipos', icon:'fa-exchange-alt' },
    // { path: 'acciones', label: 'Acciones', icon:'fa-hand-scissors' },
    { path: 'opciones', label: 'Configuración', icon: 'fa-cog' },
  ]

  ngOnDestroy() {
    this._agente.mensajesSubs.unsubscribe()
    this._agente.tiposSubs.unsubscribe()
    this._agente.contextosSubs.unsubscribe()
    this._agente.coleccionesSubs.unsubscribe()
    this._agente.tarjetasSubs.unsubscribe()
    console.log('desuscrito');
  }

}


