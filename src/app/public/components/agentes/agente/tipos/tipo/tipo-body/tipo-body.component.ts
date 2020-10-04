import { Component, OnInit, Input, OnDestroy, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TiposService } from '../../tipos.service';
import { Clase, TipoEntidadModel } from '../../tipo.model';
import { BehaviorSubject } from 'rxjs';
import { ClaseItemComponent } from '../clase-item/clase-item.component';

@Component({
  selector: 'aSmart-tipo-body',
  templateUrl: './tipo-body.component.html',
  styleUrls: ['./tipo-body.component.scss']
})
export class TipoBodyComponent implements OnInit, OnDestroy {

  @Input() tipo: TipoEntidadModel
  @ViewChildren( ClaseItemComponent ) ClaseItemList: QueryList<ClaseItemComponent>
  @Output() edited = new EventEmitter<TipoEntidadModel>();

  switchAddClase: boolean
  clases: Clase[]

  constructor (
    private tiposService: TiposService,
  ) { }

  ngOnInit(): void {
    
  }

  async toEditClase( id: string ) {
    this.edited.emit(this.tipo)
    const claseToEdit = this.ClaseItemList.find( claseItem => claseItem.claseId == id )
    claseToEdit.switchClaseInput()
  }

  async getTipo(tipoName) {
    // this.tipo = await this.tiposService.getByName( tipoName )
  }

  onKindChange( event: MatCheckboxChange ) {
    this.tiposService.currentTipo(this.tipo.name).kind
     = event.checked ? 'KIND_MAP' : 'KIND_LIST';
    // this.edited.emit(this.tipo)
    return
  }

  onExpanptionChange( event: MatCheckboxChange ) {
    this.tiposService.currentTipo( this.tipo.name ).autoExpansionMode
      = event.checked ? 'AUTO_EXPANSION_MODE_DEFAULT' : 'AUTO_EXPANSION_MODE_UNSPECIFIED';
    // this.edited.emit(this.tipo)
  }

  onFuzzyChange( event: MatCheckboxChange ) {
    this.tiposService.currentTipo( this.tipo.name ).enableFuzzyExtraction
      = event.checked ? true : false
    this.edited.emit(this.tipo)
  }

  trackByName(index: number, clase: Clase): string {
    return clase.value;
  }

  onClaseAdded( event ) {
    this.switchAddClase = false
    this.edited.emit(this.tipo)
    this.refresh()
  }

  async refresh() {
    this.tipo.entities = []
    await this.getTipo( this.tipo.name )
  }


  ngOnDestroy() {
    // this._tipoName.unsubscribe()
  }

}
