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
    private _router: Router
  ) {}

  async ngOnInit() {
    this.agentes_.agentes$.subscribe(list => {
      if (list.length > 0) {
        this._router.navigate(['/dashboard/agente/', list[0].projectId])
      } else {
        this._router.navigate(['/dashboard/crear_agente'])
      }
    })
  }


  deleteAgente(projectId) {
    this.agentes_.deleteAgent( projectId )
      .pipe(first()).subscribe(() =>
        this._alerts.sendFloatNotification('Agente Eliminando')
      )
  }

}
