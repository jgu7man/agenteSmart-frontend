import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChildren,
  QueryList,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Clase, TipoEntidadModel } from '../../tipo.model';
import { ClaseItemComponent } from '../clase-item/clase-item.component';
import * as actions from '../../store/tipo.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../../../app.state';
import { TipoState } from '../../store/tipo.state';
import { CurrentTipoService } from '../current-tipo.service';

@Component({
  selector: 'aSmart-tipo-body',
  templateUrl: './tipo-body.component.html',
  styleUrls: ['./tipo-body.component.scss'],
})
export class TipoBodyComponent implements OnInit {

  /** Recibe y almacena un tipo */
  @Input() tipo: TipoEntidadModel;
  /** Lista de clases del tipo */
  @ViewChildren(ClaseItemComponent)
  private ClaseItemList: QueryList<ClaseItemComponent>;
  /** Define si la vista debe ser de edición o lectura */
  public switchAddClase: boolean;

  constructor(
    private tipo_: CurrentTipoService
  ) {
  }

  ngOnInit(): void {}

  /** Toma de la lista de componentes el que se ha de editar y lo activa para edición */
  async toEditClase(id: string) {
    const claseToEdit = this.ClaseItemList.find(
      (claseItem) => claseItem.claseId == id
    );
    claseToEdit.switchClaseInput();
  }


  // # SWITCHES OF CURRENT TIPO
  /** Define si el tipo será lista o mapa de sinónimos.
   * @note Se usa en este punto también para controlar los demás componentes hijos
   */
  onKindChange(event: MatCheckboxChange) {
    let tipoState = this.tipo_.current$.getValue()
    this.tipo = {
        ...this.tipo,
        kind: event.checked ? 'KIND_MAP' : 'KIND_LIST',
      }
    this.tipo_.current$.next({...tipoState, body:this.tipo})
  }

  /** Define el tipo de expansión */
  onExpantionChange(event: MatCheckboxChange) {
    let tipoState = this.tipo_.current$.getValue()
    this.tipo = {
        ...this.tipo,
        autoExpansionMode: event.checked
          ? 'AUTO_EXPANSION_MODE_DEFAULT'
          : 'AUTO_EXPANSION_MODE_UNSPECIFIED',
      }
    this.tipo_.current$.next({...tipoState, body:this.tipo})
  }

  /** Cambia la flexibilidad de palabra */
  onFuzzyChange(event: MatCheckboxChange) {
    let tipoState = this.tipo_.current$.getValue()
    this.tipo = {
        ...this.tipo,
        enableFuzzyExtraction: event.checked ? true : false,
      }
      this.tipo_.current$.next({...tipoState, body:this.tipo})
  }


}
