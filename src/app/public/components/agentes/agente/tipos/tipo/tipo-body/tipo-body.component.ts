import {
  Component,
  OnInit,
  Input,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TipoEntidadModel } from '../../tipo.model';
import { ClaseItemComponent } from '../clase-item/clase-item.component';
import { CurrentTipoService } from '../current-tipo.service';

@Component({
  selector: 'aSmart-tipo-body',
  templateUrl: './tipo-body.component.html',
  styleUrls: ['./tipo-body.component.scss'],
})
export class TipoBodyComponent implements OnInit {

  /** Recibe y almacena un tipo */
  @Input() tipo: TipoEntidadModel;


  constructor(
    public tipo_: CurrentTipoService
  ) {
  }

  ngOnInit(): void {}



  onAddClase() {
    this.tipo_.switchAddClase = true
  }


  // # SWITCHES OF CURRENT TIPO
  /** Define si el tipo será lista o mapa de sinónimos.
   * @note Se usa en este punto también para controlar los demás componentes hijos
   */
  onKindChange(event: MatCheckboxChange) {
    let tipoState = this.tipo_.current$.getValue()
    this.tipo.value = {
        ...this.tipo.value,
        kind: event.checked ? 'KIND_MAP' : 'KIND_LIST',
      }
    this.tipo_.current$.next({...tipoState, body:this.tipo, saved: false})
  }

  /** Define el tipo de expansión */
  onExpantionChange(event: MatCheckboxChange) {
    let tipoState = this.tipo_.current$.getValue()
    this.tipo.value = {
        ...this.tipo.value,
        autoExpansionMode: event.checked
          ? 'AUTO_EXPANSION_MODE_DEFAULT'
          : 'AUTO_EXPANSION_MODE_UNSPECIFIED',
      }
    this.tipo_.current$.next({...tipoState, body:this.tipo, saved: false})
  }

  /** Cambia la flexibilidad de palabra */
  onFuzzyChange(event: MatCheckboxChange) {
    let tipoState = this.tipo_.current$.getValue()
    this.tipo.value = {
        ...this.tipo.value,
        enableFuzzyExtraction: event.checked ? true : false,
      }
      this.tipo_.current$.next({...tipoState, body:this.tipo, saved: false})
  }


}
