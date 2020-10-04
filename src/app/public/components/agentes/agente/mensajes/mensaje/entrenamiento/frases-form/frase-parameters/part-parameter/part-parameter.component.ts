import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FraseParte, ParametroMensaje } from '../../../../../mensaje.model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ParametrosService } from '../../../parametros/parametros.service';
import { Loading } from '../../../../../../../../../../Gdev-Tools/loading/loading.service';
import { FrasesService } from '../../frases.service';

@Component({
  selector: 'aSmart-part-parameter',
  templateUrl: './part-parameter.component.html',
  styleUrls: ['./part-parameter.component.scss']
})
export class PartParameterComponent implements OnInit {

  @Input() parte: FraseParte

  switchEntitySelector: boolean = false
  paramName: string = ''

  @ViewChild( 'partEntityInput' ) partEntityInput: ElementRef
  
  @Output() onDelete = new EventEmitter<any>()
  @Output() paramAdded = new EventEmitter<FraseParte>()
  @Output() tipoSelected = new EventEmitter<FraseParte>();

  constructor (
    private _params: ParametrosService,
    private loading: Loading,
  ) { }

  ngOnInit(): void {
    
  }
  
  async toSelectTipo() {
    this.switchEntitySelector = true
    await this.loading.waitFor( 100 )
    // this.partEntityInput.nativeElement.focus()
  }
  
  onTipoSelected(tipoSelected: string) {
    this.parte.entityType = tipoSelected
    this.tipoSelected.emit( this.parte )
    
    if ( this.paramName ) {
      var param: ParametroMensaje = {
        displayName: this.paramName,
        entityTypeDisplayName: tipoSelected
      }

      this._params.addParam( param ).then( () => {
        this.parte.paramName = this.paramName
      } )
    }
  }

  
  addParameter( event ) {
    event.stopImmediatePropagation()
    var entity = this.parte.entityType
    this.parte.paramName = this.paramName
    this.paramAdded.emit( this.parte )
    
    if ( entity ) {
      var param: ParametroMensaje = {
        displayName: this.paramName,
        entityTypeDisplayName: entity
      }

      this._params.addParam( param ).then( () => {
        this.parte.paramName = this.paramName
      })
    }
  }





}
