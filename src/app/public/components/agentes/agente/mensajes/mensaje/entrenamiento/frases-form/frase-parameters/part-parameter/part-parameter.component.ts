import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FraseParte, ParametroMensaje } from '../../../../../mensaje.model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ParametrosService } from '../../../parametros/parametros.service';
import { Loading } from '../../../../../../../../../../gdev-tools/loading/loading.service';
import { FrasesService } from '../../frases.service';
import { MensajesService } from '../../../../../mensajes.service';
import { CurrentMensajeService } from '../../../../current-mensaje.service';

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

  @ViewChild( 'partEntityInput' ) partEntityInput: ElementRef

  @Output() onDelete = new EventEmitter<any>()
  @Output() paramAdded = new EventEmitter<FraseParte>()
  @Output() tipoSelected = new EventEmitter<FraseParte>();

  constructor (
    private _params: ParametrosService,
    private loading: Loading,
      private _mensaje: CurrentMensajeService,
    private _frases: FrasesService,
  ) { }

  ngOnInit(): void {
    if(this.parte) this.paramName = this.parte.alias == true ? '' : this.parte.alias
  }


  async toSelectTipo() {
    this.switchEntitySelector = true
    await this.loading.waitFor( 100 )
    // this.partEntityInput.nativeElement.focus()
  }

  onTipoSelected(tipoSelected: string) {
    this.parte.entityType = tipoSelected
    this.tipoSelected.emit( this.parte )

    if ( typeof this.parte.alias == 'string' ) {
      var param: ParametroMensaje = {
        displayName: this.paramName,
        entityTypeDisplayName: tipoSelected
      }

      this._params.addParam(param).then(() => {
        this.parte.alias = this.paramName
      } )
    }
  }


  addParameter( event ) {
    event.stopImmediatePropagation()

    // console.log(this._mensaje.current.parameters, this.paramName);
    var paramStored = this._mensaje.current.parameters
      .find(p => p.displayName == this.paramName);
    this.parte.alias = this.paramName

    // console.log(paramStored);
      this.paramAdded.emit(this.parte)
      this._frases.paramAdded$.next()


    if (!paramStored) {

      var param: ParametroMensaje = {
        displayName: this.paramName,
        entityTypeDisplayName: this.parte.entityType,
        value: `$${this.paramName}`
      }

      this._params.addParam(param)
        .then(() => {
            this.parte.alias = this.paramName
      })
    }


  }





}
