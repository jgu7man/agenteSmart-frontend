import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgentesService } from '../agentes.service';
import { AuthService } from '../../../../admin/auth/auth.service';
import { AgenteModel } from '../init-agente/agente.model';

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
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.loadAgente()
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
    { path: 'entradas', label: 'Entradas' },
    { path: 'entidades', label: 'Entidades' },
    { path: 'acciones', label: 'Acciones' },
    { path: 'opciones', label: 'Opciones' },
  ]

}

interface NAVLINK {
  path: string
  label: string
}
