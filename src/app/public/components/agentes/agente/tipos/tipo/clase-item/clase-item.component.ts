import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Clase, TipoEntidadModel } from '../../tipo.model';
import { TiposService } from '../../tipos.service';

@Component({
  selector: 'aSmart-clase-item',
  templateUrl: './clase-item.component.html',
  styleUrls: ['./clase-item.component.scss']
})
export class ClaseItemComponent implements OnInit {

  ClaseInput: boolean = false
  @Input() claseId: string
  @Input() clase: Clase
  @Input() tipo: TipoEntidadModel
  @Output() claseEdited = new EventEmitter<Clase>()
  @Output() claseDeleted = new EventEmitter<boolean>()

  constructor (
    private _tipos: TiposService
  ) { }

  ngOnInit(): void {
  }

  @Input() switchClaseInput() {
    this.ClaseInput = !this.ClaseInput
  }


  onClaseDone() {
    this.ClaseInput = false
    this.claseEdited.emit(this.clase)
  }

  onDelClase() {
    this._tipos.deleteClase( this.tipo.name, this.claseId )
      .then( ()=>{this.claseDeleted.emit(true)} )
  }

}
