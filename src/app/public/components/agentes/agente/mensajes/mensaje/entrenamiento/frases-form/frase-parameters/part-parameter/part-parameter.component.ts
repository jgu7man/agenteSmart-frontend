import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FraseParte, ParametroMensaje } from '../../../../../mensaje.model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ParametrosService } from '../../../parametros/parametros.service';
import { GdevLoading } from '../../../../../../../../../../gdev-tools/src/lib/loading/loading.service';
import { FrasesService } from '../../frases.service';
import { MensajesService } from '../../../../../mensajes.service';
import { CurrentMensajeService } from '../../../../current-mensaje.service';
import { GdevText } from 'src/app/gdev-tools/src/public-api';

@Component({
  selector: 'aSmart-part-parameter',
  templateUrl: './part-parameter.component.html',
  styleUrls: ['./part-parameter.component.scss']
})
export class PartParameterComponent implements OnInit {

  @Input() parte: FraseParte
  @Input() index: number

  switchEntitySelector: boolean = false
  paramName: any = ''
  param: ParametroMensaje

  @ViewChild( 'partEntityInput' ) partEntityInput: ElementRef

  @Output() onDelete = new EventEmitter<any>()
  @Output() paramAdded = new EventEmitter<FraseParte>()
  @Output() tipoSelected = new EventEmitter<FraseParte>();

  constructor (
    private _params: ParametrosService,
    private _loading: GdevLoading,
      private _mensaje: CurrentMensajeService,
    private _frases: FrasesService,
    private _text: GdevText
  ) { }

  ngOnInit(): void {
    if(this.parte) this.paramName = this.parte.alias == true ? '' : this.parte.alias
  }


  async toSelectTipo() {
    this.switchEntitySelector = true
    await this._loading.waitFor( 100 )
    // this.partEntityInput.nativeElement.focus()
  }

  reformatText(event: any) { // listen keypress event; not keydown o keyup
    var k;
    k = event.charCode;  // k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) // allow letters
      || (k >= 48 && k <= 57) // allow numbers
      || (k > 96 && k < 123) // allow numpads
      || k == 8 // allow backspace
      // || k == 32  // allow space
      // || k == 188 // allow comma
      // || k == 189 // allow dash
      // || k == 190 // allow perdiod (dot)
      // || k == 95 // allow underscore
    );
  }

  normalize(value: any) {
    console.log( value )
    this.paramName = this._text.normalize(value)
  }

  onTipoSelected(tipoSelected: string) {
    this.parte.entityType = tipoSelected
    this.tipoSelected.emit( this.parte )

    if ( typeof this.parte.alias == 'string' ) {
      this.param = {
        displayName: this.paramName,
        entityTypeDisplayName: tipoSelected.startsWith('@')
          ? tipoSelected
          : '@' + tipoSelected
      }

    }
  }


  addParameter(  ) {
    // event.stopImmediatePropagation()

    // console.log(this._mensaje.current.parameters, this.paramName);
    var paramStored = this._mensaje.current$.getValue().parameters
      .find(p => p.displayName == this.paramName);
    this.parte.alias = this.paramName

    // console.log(paramStored);
      this.paramAdded.emit(this.parte)
      this._frases.paramAdded$.next()


    if (!paramStored) {

      var param: ParametroMensaje = {
        displayName: this.paramName,
        entityTypeDisplayName: this.parte.entityType.startsWith('@')
          ? this.parte.entityType : '@'+this.parte.entityType,
        value: this.paramName.startsWith('$') ? this.paramName : `$${this.paramName}`
      }

      this._params.addParam(param)
        .then(() => {
            this.parte.alias = this.paramName
      })
    }


  }





}
