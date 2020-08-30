import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
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
  ) {}
  
  async ngOnInit() {
  }
  
  async ngAfterViewInit() {
   }

}
