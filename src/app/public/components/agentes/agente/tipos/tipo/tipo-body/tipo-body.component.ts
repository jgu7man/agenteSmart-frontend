import { Component, OnInit, Input, OnDestroy, ViewChildren, QueryList } from '@angular/core';
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
  @ViewChildren(ClaseItemComponent) ClaseItemList: QueryList<ClaseItemComponent>

  switchAddClase: boolean
  clases: Clase[]

  constructor (
    private tiposService: TiposService,
  ) { }

  ngOnInit(): void {
    
  }

  async toEditClase(id: string) {
    const claseToEdit = this.ClaseItemList.find( claseItem => claseItem.claseId == id )
    claseToEdit.switchClaseInput()
  }

  async getTipo(tipoName) {
    this.tipo = await this.tiposService.getByName( tipoName )
  }

  onKindChange( event: MatCheckboxChange ) {
    this.tipo.kind = event.checked ? 'KIND_MAP' : 'KIND_LIST';
    return this.tiposService.setTipoOption( this.tipo.name, 'kind', this.tipo.kind )
  }

  onExpanptionChange( event: MatCheckboxChange ) {
    this.tipo.autoExpansionMode = event.checked ? 'AUTO_EXPANSION_MODE_DEFAULT' : 'AUTO_EXPANSION_MODE_UNSPECIFIED';
    return this.tiposService.setTipoOption( this.tipo.name, 'autoExpansionMode', this.tipo.autoExpansionMode  )
  }

  onFuzzyChange( event: MatCheckboxChange ) {
    this.tipo.enableFuzzyExtraction = event.checked ? true : false
    return this.tiposService.setTipoOption( this.tipo.name, 'enableFuzzyExtraction', this.tipo.enableFuzzyExtraction )
  }

  trackByName(index: number, clase: Clase): string {
    return clase.value;
  }

  onClaseAdded( event ) {
    this.switchAddClase = false
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
