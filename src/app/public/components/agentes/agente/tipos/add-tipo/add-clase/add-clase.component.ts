import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Clase, TipoEntidadModel } from '../../tipo.model';
import { TiposService } from '../../tipos.service';
import { Loading } from '../../../../../../../Gdev-Tools/loading/loading.service';

@Component({
  selector: 'aSmart-add-clase',
  templateUrl: './add-clase.component.html',
  styleUrls: ['./add-clase.component.scss']
})
export class AddClaseComponent implements OnInit {

  switchSinonimosInput: boolean
  newClaseItem: string
  newClaseSinonimos: string[] = []
  readonly separatorKeysCodes: number[] = [ COMMA ];

  @Input() clase: Clase
  @Input() tipo: TipoEntidadModel
  @ViewChild('sinonimosInput') sinonimosInput: ElementRef
  @Output() public claseDone = new EventEmitter<boolean>()
  

  constructor (
    private _tipos: TiposService,
    private loading: Loading
  ) {
    if(this.clase) this.clase.synonyms = []
   }

  ngOnInit(): void {
    if ( this.clase ) {
      this.newClaseItem = this.clase.value
      this.newClaseSinonimos = this.clase.synonyms ? this.clase.synonyms : []
      this.tipo.kind
      if (this.clase.value) {this.switchSinonimosInput = true}
    }
  }


  onAddClase(event) {
    event.stopPropagation();
    if ( this.newClaseItem ) {
      this.clase = { value: this.newClaseItem }
      this.newClaseItem = ''
    }
    this._tipos.setClase( this.tipo.name, this.clase ).then( () => {
      if ( this.tipo.kind == 'KIND_MAP' ) {
        this.newClaseSinonimos.push( this.clase.value )
        this.switchSinonimosInput = true
        this.loading.waitFor( 100 )
        this.sinonimosInput.nativeElement.focus()
        console.log(this.clase.value);
        this._tipos.setSinonimo( this.tipo.name, this.clase.value, this.clase.value, 'add' )
      }
    })
  }

  
  addSinonimo( event: MatChipInputEvent ) {
    
    if ( event.value ) {
      this.newClaseSinonimos.push( event.value.trim() )
      this._tipos.setSinonimo(this.tipo.name,  this.clase.value, event.value, 'add')
    }
    event.input.value = ''
  }

  delSinonimo( sinonimo: string ) {
    const index = this.newClaseSinonimos.findIndex( sin => sin === sinonimo )
    this.newClaseSinonimos.splice( index, 1 )
    this._tipos.setSinonimo( this.tipo.name, this.clase.value, sinonimo, 'del' )
  }

  

  

  

}
