import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgentesService } from './agentes.service';
import { AgenteModel } from './init-agente/agente.model';
import { Loading } from '../../../global/loading/loading.service';
import { AuthService } from '../../../admin/auth/auth.service';

@Component({
  selector: 'aSmart-agentes',
  templateUrl: './agentes.component.html',
  styleUrls: ['./agentes.component.scss']
})
export class AgentesComponent implements OnInit, AfterViewInit {

  agentes: AgenteModel[] = []
  constructor (
    public _agentes: AgentesService,
    public router: Router,
    private loading: Loading,
  ) {}
  
  async ngOnInit() {
    this.agentes = await this._agentes.loadAgentes()
  }
  
  async ngAfterViewInit() {
   }

}
