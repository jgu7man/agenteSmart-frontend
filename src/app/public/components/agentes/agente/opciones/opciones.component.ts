import { Component, OnInit } from '@angular/core';
import { OpcionesAgenteService } from './opciones-agente.service';

@Component({
  selector: 'aSmart-opciones',
  templateUrl: './opciones.component.html',
  styleUrls: ['./opciones.component.scss']
})
export class OpcionesComponent implements OnInit {

  constructor (
    public opciones_: OpcionesAgenteService
  ) { }

  ngOnInit(): void {
  }

}
