import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AgentesService } from '../agentes/agentes.service';
import { AgenteModel } from '../agentes/init-agente/agente.model';

@Component({
  selector: 'aSmart-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  agentes: AgenteModel[]
  constructor (
    private location: Location,
    public _agentes: AgentesService
  ) { }

  ngOnInit() {
    this._agentes.getAgentes.subscribe(result => this.agentes = result)
  }

  onActive( path ) {
    return this.location.path().includes( path )
  }

}
