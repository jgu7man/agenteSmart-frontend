import { Component, OnInit } from '@angular/core';
import { AgenteModel } from '../agente.model';

@Component({
  selector: 'aSmart-form-agregar-agente',
  templateUrl: './form-agregar-agente.component.html',
  styleUrls: ['./form-agregar-agente.component.scss']
})
export class FormAgregarAgenteComponent implements OnInit {

  public agente
  constructor() {
    this.agente = new AgenteModel('','','','')
  }

  ngOnInit() {
  }

  

}
