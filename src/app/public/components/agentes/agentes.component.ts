import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { GdevAlert } from 'src/app/gdev-tools/src/lib/alert/alert.service';
import { AgentesService } from './agentes.service';

@Component({
  selector: 'aSmart-agentes',
  templateUrl: './agentes.component.html',
  styleUrls: ['./agentes.component.scss']
})
export class AgentesComponent implements OnInit  {

  constructor (
    public agentes_: AgentesService,
    private _alerts: GdevAlert,
  ) {}

  async ngOnInit() {
  }


  deleteAgente(projectId) {
    this.agentes_.deleteAgent( projectId )
      .pipe(first()).subscribe(() =>
        this._alerts.sendFloatNotification('Agente Eliminando')
      )
  }

}
