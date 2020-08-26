import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { TipoEntidadModel, Clase } from '../tipo.model';
import { Loading } from '../../../../../../Gdev-Tools/loading/loading.service';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { TiposService } from '../tipos.service';
import { MatExpansionPanel } from '@angular/material/expansion';


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
  @ViewChild( 'addPanel' ) addPanel: MatExpansionPanel
  @Output() saved = new EventEmitter<boolean>()


  constructor (
    private loading: Loading,
    public tiposService: TiposService
  ) {
    this.newTipo = new TipoEntidadModel( '', '', 'KIND_LIST', 'AUTO_EXPANSION_MODE_UNSPECIFIED', this.clases, false )
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

  


  async onAddTipo() {
    this.switchAddInput = false
    if ( this.newTipo.displayName != '' ) {
      this.tiposService.setTipo( this.newTipo ).then( name => {
        this.newTipo.name = name
      })
    }
  }

  toSave() {
    this.switchAddInput = false
    this.addPanel.close()
    this.newTipo = new TipoEntidadModel( '', '', 'KIND_MAP', 'AUTO_EXPANSION_MODE_DEFAULT', this.clases, true )
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
