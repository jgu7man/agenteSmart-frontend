import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { AgentesService } from './agentes.service';
import { AgenteModel } from './init-agente/agente.model';

@Component({
  selector: 'aSmart-agentes',
  templateUrl: './agentes.component.html',
  styleUrls: ['./agentes.component.scss']
})
export class AgentesComponent implements OnInit, AfterViewChecked {

  agentes: AgenteModel[] = []
  constructor (
    public _agentes: AgentesService,
    public router: Router
  ) {}
  
  ngOnInit() {
     
    this._agentes.getAgentes.subscribe( result => {
      this.agentes = result
    })
  }
  
  



  async ngAfterViewChecked() {
    
   }

}
