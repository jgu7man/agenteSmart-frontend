import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { GdevAlert } from 'src/app/gdev-tools/src/lib/alert/alert.service';
import { AgentesService } from './agentes.service';

@Component({
  selector: 'aSmart-agentes',
  templateUrl: './agentes.component.html',
  styleUrls: ['./agentes.component.scss']
})
export class AgentesComponent implements OnInit, AfterViewInit {

  constructor (
    public _agentes: AgentesService,
    public router: Router,
    public _alerts: GdevAlert,
  ) {}

  async ngOnInit() {
  }

  async ngAfterViewInit() {
    }

    deleteAgente(projectId) {
        this._agentes.deleteAgent( projectId )
            .subscribe(() => this._alerts.sendFloatNotification('Agente Eliminando'))
    }

}
