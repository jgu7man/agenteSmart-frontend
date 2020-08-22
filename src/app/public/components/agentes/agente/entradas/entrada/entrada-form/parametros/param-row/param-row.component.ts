import { Component, OnInit, Input } from '@angular/core';
import { ParametroEntrada } from '../../../../entrada.model';

@Component({
  selector: 'aSmart-param-row',
  templateUrl: './param-row.component.html',
  styleUrls: ['./param-row.component.scss']
})
export class ParamRowComponent implements OnInit {


  @Input() param: ParametroEntrada
  switchNameInput: boolean = false
  switchTipoSelecter: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

  onValueSelected( value ) {
    this.param.value = value
  }


}
