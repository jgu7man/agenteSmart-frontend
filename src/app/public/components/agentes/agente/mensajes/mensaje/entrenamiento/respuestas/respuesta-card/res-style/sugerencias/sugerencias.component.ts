import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RespuestaSugerencias } from '../../../respuesta.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'aSmart-sugerencias',
  templateUrl: './sugerencias.component.html',
  styleUrls: ['./sugerencias.component.scss']
})
export class SugerenciasComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [ ENTER, COMMA ];
  sugerencias: string[] = []
  suggests: RespuestaSugerencias = {
    respuesta: '', sugerencias: this.sugerencias
  }

  @Output() onRespChanges: EventEmitter<RespuestaSugerencias> = new EventEmitter()

  constructor () {}

  ngOnInit(): void {
  }

  add( event: MatChipInputEvent ): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ( ( value || '' ).trim() ) {
      this.sugerencias.push( value );
    }

    // Reset the input value
    if ( input ) {
      input.value = '';
    }
  }

  remove( sugerencia: string ): void {
    const index = this.sugerencias.indexOf( sugerencia );

    if ( index >= 0 ) {
      this.sugerencias.splice( index, 1 );
    }
  }

}
