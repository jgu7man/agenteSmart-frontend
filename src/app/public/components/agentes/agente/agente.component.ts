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

@Component({
  selector: 'aSmart-agente',
  templateUrl: './agente.component.html',
  styleUrls: ['./agente.component.scss']
})
export class AgenteComponent implements OnInit, OnDestroy {


  agente: AgenteModel
  constructor (
    private ruta: ActivatedRoute,
    private _agente: CurrentAgenteService,
    private auth: AuthService,
    private _dashboard: DashboardService,
    public _responsive: ResponsiveService,
    private _cache: CacheService
  ) {
    // this._agente.getCurrentUrl()
   }

  ngOnInit(): void {
    this.loadAgente()
    if ( this._responsive.small ) {
      this._dashboard.setMobileNavbar(this.agentLinks)
    }
  }

  async loadAgente() {

    this.agente = await this._agente.get()

    
  }

  agentLinks:NAVLINK[] = [
    { path: 'mensajes', label: 'Mensajes', icon:'fa-sign-in-alt' },
    { path: 'tipos', label: 'Tipos', icon:'fa-exchange-alt' },
    { path: 'acciones', label: 'Acciones', icon:'fa-hand-scissors' },
    { path: 'tarjetas', label: 'Tarjetas', icon: 'fa-images' },
    { path: 'colecciones', label: 'Colecciones', icon: 'fa-folder' },
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


