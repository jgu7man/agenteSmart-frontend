import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { TipoEntidadModel, Clase } from '../tipo.model';
import { Loading } from '../../../../../../global/loading/loading.service';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { TiposService } from '../tipos.service';


@Component({
  selector: 'aSmart-add-tipo',
  templateUrl: './add-tipo.component.html',
  styleUrls: ['./add-tipo.component.scss']
})
export class AddTipoComponent implements OnInit {

  switchAddInput: boolean = false
  newTipo: TipoEntidadModel
  clases: Clase[] = []
  newClaseItem: string
  switchAddClase: boolean = false
  

  @ViewChild( 'addInput' ) addInput: ElementRef
  @Output() saved = new EventEmitter<boolean>()


  constructor (
    private loading: Loading,
    public tiposService: TiposService
  ) {
    this.newTipo = new TipoEntidadModel( '', '', 'KIND_MAP', 'AUTO_EXPANSION_MODE_DEFAULT', this.clases, true )
   }

  ngOnInit(): void {
  }

  async toAddTipo() {
    this.switchAddInput = !this.switchAddInput
    await this.loading.waitFor( 200 )
    this.switchAddInput ? 
      this.addInput.nativeElement.focus() :
      null
  }

  onKindChange(event: MatCheckboxChange) {
    this.newTipo.kind = event.checked ? 'KIND_MAP' : 'KIND_LIST';
    return this.tiposService.setTipo(this.newTipo)
  }

  onExpanptionChange( event: MatCheckboxChange ) {
    this.newTipo.autoExpansionMode = event.checked ? 'AUTO_EXPANSION_MODE_DEFAULT' : 'AUTO_EXPANSION_MODE_UNSPECIFIED';
    return this.tiposService.setTipo( this.newTipo )
  }

  onFuzzyChange( event: MatCheckboxChange ) {
    this.newTipo.enableFuzzyExtraction = event.checked ? true : false
    return this.tiposService.setTipo( this.newTipo )
  }

  onClaseAdded(event) {
    this.switchAddClase = false
  }


  async onAddTipo() {
    this.switchAddInput = false
    if ( this.newTipo.displayName != '' ) {

    }
  }

  toSave() {
    this.newTipo = new TipoEntidadModel( '', '', 'KIND_MAP', 'AUTO_EXPANSION_MODE_DEFAULT', this.clases, true )
    this.switchAddInput = false
    this.saved.emit(true)
  }

  
  delSpaces( e ) {
    if ( e.which === 32 ) {
      e.stopPropagation();
      return false
    } else if (e.which === 13) {
      e.stopPropagation();
    }

  }


}
