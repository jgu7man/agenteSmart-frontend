import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { COMMA, TAB } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { iEntity } from '../../tipo.model';
import { GdevText } from 'src/app/services/text.service';
import { CurrentTipoService } from '../current-tipo.service';
import { GdevLoading} from 'src/app/gdev-tools/src/lib/loading/loading.service';

@Component({
  selector: 'aSmart-edit-clase',
  templateUrl: './edit-clase.component.html',
  styleUrls: ['./edit-clase.component.scss'],
})
export class EditClaseComponent implements OnInit, OnDestroy{
  /** Activa la vista de sinónimos */
  switchSinonimosInput: boolean;
  /** Controlador del campo de valor de la clase */
  newClaseItem: string = '';
  /** Controlador del campo de sinónimos de la clase */
  newClaseSinonimos: string[] = [];
  /** Define el tipo de activadores de separación en el "Chips Field" */
  readonly separatorKeysCodes: number[] = [COMMA, TAB];
  /** Recibe la clase en cuestión */
  @Input() clase: iEntity;
  /** Recibe el la configuración del tipo */
  @Input() kind: 'KIND_MAP' | 'KIND_LIST';
  /** Controlador del "Chips Filed" */
  @ViewChild('sinonimosInput') sinonimosInput: ElementRef;
  /** Emite cuando la clase se editó, agregó o borró */
  @Output() public claseDone = new EventEmitter<boolean>();

  constructor(
    public tipo_: CurrentTipoService,
    private _loading: GdevLoading,
    private _text: GdevText
  ) {

  }

  ngOnInit(): void {
    this.setInitValues()
  }

  /** Establece los valores de entrada */
  setInitValues() {
    if (this.clase) {
      this.newClaseItem = this.clase.value;
      this.newClaseSinonimos = this.clase.synonyms ? this.clase.synonyms : [];
      if (this.clase.synonyms.length > 0) {
        this.switchSinonimosInput = true;
      }
    }
  }

  /** Evita espacios en blanco en el valor de la clase */
  delSpaces(e) {
    this._text.normalize(this.newClaseItem);
    if (e.which === 32) {
      this.newClaseItem.valueOf().replace(/\s/g, '');
      return false;
    }
  }

  // # ADD CLASE (Component)
  /** Resetea los campos para uno nuevo y envía la clase creada a la creación de un item de lista o un mapa de sinónimos */
  onAddClase(event) {
    event.stopPropagation();

    // Define la clase y prepara la siguiente
    if (this.newClaseItem) {
      this.clase = { value: this.newClaseItem };
      this.newClaseItem = '';
    }

    // Si es lista o si es mapa
    if (this.kind == 'KIND_MAP') {
      // Desactiva el agregado de clase
      this.tipo_.switchAddClase = false
      // Define la clase nueva para continuar con la edición
      this.tipo_.activatedToEdit = this.clase.value
      // Agrega la clase nueva como sinónimo también
      this.tipo_.setSinonimo(
        this.clase,
        this.clase.value,
        'add'
      );
    } else {
      this.tipo_.setClase(this.clase);
    }
  }

  /** Cierra la edición de la clase y resetea los campos */
  async setClase() {
    this.claseDone.emit(true);
    this.newClaseItem = '';
    this.newClaseSinonimos = [];
  }

  /** Agrega sinónimo del "chips field" */
  addSinonimo(event: MatChipInputEvent) {
    if (event.value) {
      this.tipo_.setSinonimo( this.clase, event.value.trim(), 'add');
    }
    event.input.value = '';
  }

  /** Elimina sinónimo del "chips field" */
  delSinonimo(sinonimo: string) {
    const index = this.newClaseSinonimos.findIndex((sin) => sin === sinonimo);
    this.newClaseSinonimos.splice(index, 1);
    this.tipo_.setSinonimo(this.clase, sinonimo, 'del');
  }

  /** Deja los campos en blanco de nuevo */
  ngOnDestroy() {
    this.newClaseItem = ''
    this.newClaseSinonimos = []
    delete this.clase
  }
}
