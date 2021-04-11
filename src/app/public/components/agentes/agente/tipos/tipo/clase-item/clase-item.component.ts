import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Clase } from '../../tipo.model';
import { CurrentTipoService } from '../current-tipo.service';

@Component({
  selector: 'aSmart-clase-item',
  templateUrl: './clase-item.component.html',
  styleUrls: ['./clase-item.component.scss'],
})
export class ClaseItemComponent implements OnInit {
  /** Recibe y establece la configuración de la vista, si es edición o lectura */
  @Input() ClaseInput: boolean = false;
  /** Recibe la clase que se mostrará o editará */
  private _claseId : BehaviorSubject<string> = new BehaviorSubject('');
  @Input() set claseId(id: string) { this._claseId.next(id); }
  get claseId() { return this._claseId.getValue()}
  /** Recibe y establece el tipo de vista de lista a mapa */
  @Input() kind: 'KIND_MAP' | 'KIND_LIST';
  /** Emite evento cuando la clase fue editada */
  @Output() claseEdited = new EventEmitter<Clase>();
  /** Emite evento cuando la clase fue borrada */
  @Output() claseDeleted = new EventEmitter<boolean>();
  /** Emite evento cuando la clase se cerró */
  @Output() closeClase = new EventEmitter<boolean>();
  /** Almacena la clase filtrada por id */
  public clase: Clase;

  constructor(
    private tipo_: CurrentTipoService
  ) {
    this._claseId.subscribe(id => {
      this.clase = this.tipo_.getClase(this.claseId)
    })
  }

  ngOnInit(): void {

  }

  /** Activador que se usa desde el padre para cambiar a edición */
  @Input() switchClaseInput() {
    this.ClaseInput = !this.ClaseInput;
  }

  // # onClaseDone
  /** Cuando la clase es dejada de usar por tab, enter o desenfocar, define si será editada o sólo cerrada */
  onClaseDone(edited: boolean) {
    this.ClaseInput = false;
    if (edited) this.claseEdited.emit(this.clase);
    else this.closeClase.emit(true);
  }

  // # onDeleteClase
  /** Atiende el llamdao de borrado */
  onDelClase() {
    this.tipo_.deleteClase( this.claseId).then(() => {
      this.claseDeleted.emit(true);
    });
  }
}
