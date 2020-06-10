import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgentesService } from '../agentes.service';
import { AuthService } from '../../../../admin/auth/auth.service';
import { AgenteModel } from '../init-agente/agente.model';
import { DashboardService } from '../../dashboard/dashboard.service';
import { NAVLINK } from '../../navbar/navlink.interface';
import { ResponsiveService } from '../../../../services/responsive.service';

@Component({
  selector: 'aSmart-agente',
  templateUrl: './agente.component.html',
  styleUrls: ['./agente.component.scss']
})
export class AgenteComponent implements OnInit {


  agente: AgenteModel
  constructor (
    private ruta: ActivatedRoute,
    private _agentes: AgentesService,
    private auth: AuthService,
    private _dashboard: DashboardService,
    public _responsive: ResponsiveService
  ) { }

  ngOnInit(): void {
    this.loadAgente()
    if ( this._responsive.small ) {
      this._dashboard.setMobileNavbar(this.agentLinks)
    }
  }

  loadAgente() {
    const agentId = this.ruta.snapshot.paramMap.get( 'id' )
    this.auth.user$.pipe().subscribe( async user => {
      if ( user ) {
        this._agentes.loadOneAgente( user, agentId )
        this._agentes.agente.subscribe( agente => {
          this.agente = agente
        } )
      }
    })
  }

  agentLinks:NAVLINK[] = [
    { path: 'entradas', label: 'Entradas', icon:'fa-sign-in-alt' },
    { path: 'entidades', label: 'Entidades', icon:'fa-exchange-alt' },
    { path: 'acciones', label: 'Acciones', icon:'fa-hand-scissors' },
    { path: 'opciones', label: 'Opciones', icon:'fa-ellipsis-v' },
  ]

}


