import { Component, OnInit } from '@angular/core';
import { ParametroEntrada } from '../../../entrada.model';

@Component({
  selector: 'aSmart-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss']
})
export class ParametrosComponent implements OnInit {

  parametros: ParametroEntrada[]

  constructor() { }

  ngOnInit(): void {
  }

  toAddParam() {
    
  }

}
