import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { TipoEntidadModel } from '../tipo.model';
import { TiposService } from '../tipos.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'aSmart-add-tipo',
  templateUrl: './add-tipo.component.html',
  styleUrls: ['./add-tipo.component.scss'],
})
export class AddTipoComponent implements OnInit, OnDestroy {
  /** Almacena el nuevo tipo en blanco */
  public newTipo: TipoEntidadModel;
  private dialgoSubs: Subscription;

  constructor(
    private dialog: MatDialogRef<AddTipoComponent>,
    private _tipos: TiposService
  ) {
    this.resetNewTipo()
  }

  ngOnInit(): void {
    // Se suscribe al llamado de ser cerrado este Dialog cuando existe un error
    this.dialgoSubs = this._tipos.closeCreateDialog
      .subscribe(() => this.dialog.close() );
  }

  /** Deja todo en blanco y cierra el `MatDialog` */
  cancel() {
    this.resetNewTipo()
    this.dialog.close();
  }

  /** Hace el llamado a la API para crear el tipo */
  async onAddTipo() {
    console.log('creando: ', this.newTipo);
    if (this.newTipo.displayName != '') {
      this._tipos.createTipo(this.newTipo)
        .then((newTipo) => {
          this.dialog.close(newTipo);
        })
        .catch((error) => {
          console.error(error);
          this.dialog.close()
        })
    }
  }

  delSpaces(e) {
    if (e.which === 32) {
      e.stopPropagation();
      return false;
    } else if (e.which === 13) {
      e.stopPropagation();
    }
  }

  /** Establece el tipo en blanco */
  resetNewTipo() {
    this.newTipo = new TipoEntidadModel(
      '',
      'KIND_LIST',
      'AUTO_EXPANSION_MODE_UNSPECIFIED',
      [],
      false
    );
  }

  ngOnDestroy() {
    this.dialgoSubs.unsubscribe();
  }
}
