import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
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
  @Input() mensaje: string
  @Input() suggests: RespuestaSugerencias = {
    mensaje: '', sugerencias: []
  }
  @Output() onRespChanges: EventEmitter<RespuestaSugerencias> = new EventEmitter()

  constructor () {}

  ngOnInit(): void {
  }

  onCatchTextMsg(text) {
    this.suggests.mensaje = text
    console.log(this.suggests);
    this.onRespChanges.emit(this.suggests)
  }

  add( event: MatChipInputEvent ): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ( ( value || '' ).trim() ) {
      this.suggests.sugerencias.push( value );
      this.onRespChanges.emit(this.suggests)
    }

    // Reset the input value
    if ( input ) {
      input.value = '';
    }
  }

  remove( sugerencia: string ): void {
    const index = this.suggests.sugerencias.indexOf( sugerencia );

    if ( index >= 0 ) {
      this.suggests.sugerencias.splice( index, 1 );
      this.onRespChanges.emit( this.suggests )
    }
  }

}
