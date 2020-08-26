import { Component, OnInit } from '@angular/core';
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
export class AgenteComponent implements OnInit {


  agente: AgenteModel
  constructor (
    private ruta: ActivatedRoute,
    private _agente: CurrentAgenteService,
    private auth: AuthService,
    private _dashboard: DashboardService,
    public _responsive: ResponsiveService,
    private _cache: CacheService
  ) { }

  ngOnInit(): void {
    this.loadAgente()
    if ( this._responsive.small ) {
      this._dashboard.setMobileNavbar(this.agentLinks)
    }
  }

  async loadAgente() {

    this.agente = await this._cache.getDataKey( 'agente' ) as AgenteModel

    if ( !this.agente ) {
      const projectId = this.ruta.snapshot.paramMap.get( 'id' )
      if ( projectId ) { this._cache.updateData( 'projectId', projectId ) }
      this._agente.get( projectId ).then( agente => {
        this.agente = agente
      })
      
    }
  }

  agentLinks:NAVLINK[] = [
    { path: 'mensajes', label: 'Mensajes', icon:'fa-sign-in-alt' },
    { path: 'tipos', label: 'Tipos', icon:'fa-exchange-alt' },
    { path: 'acciones', label: 'Acciones', icon:'fa-hand-scissors' },
    { path: 'opciones', label: 'Opciones', icon:'fa-ellipsis-v' },
  ]

}


