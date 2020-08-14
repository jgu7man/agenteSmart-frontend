import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'aSmart-add-clase',
  templateUrl: './add-clase.component.html',
  styleUrls: ['./add-clase.component.scss']
})
export class AddClaseComponent implements OnInit {

  
  newClaseItem: string
  newClaseSinonimos: string[] = []
  readonly separatorKeysCodes: number[] = [ ENTER, COMMA ];

  @Input() tipoName: string
  @Input() kind: 'KIND_MAP' | 'KIND_LIST'
  @Output() claseAdded = new EventEmitter<boolean>()
  

  constructor() { }

  ngOnInit(): void {
  }

  
  addSinonimo( event: MatChipInputEvent ) {
    if ( event.value ) {
      this.newClaseSinonimos.push( event.value.trim() )
    }
    event.input.value = ''
  }

  delSinonimo( sinonimo: string ) {

  }

  

}
