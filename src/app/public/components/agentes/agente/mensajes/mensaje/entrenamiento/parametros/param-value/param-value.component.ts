import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'aSmart-param-value',
  templateUrl: './param-value.component.html',
  styleUrls: ['./param-value.component.scss']
})
export class ParamValueComponent implements OnInit {

  @Input() paramValue: string
  valueOptions: string[] = []
  @Output() paramValueSelected = new EventEmitter<string>();
  

  constructor() { }

  ngOnInit(): void {
    this.valueOptions.push( this.paramValue )
    this.valueOptions.push( this.paramValue + '.orginal' )
  }

  onSelected(selection: MatSelectChange) {
    this.paramValueSelected.emit(selection.value)
  }

}
