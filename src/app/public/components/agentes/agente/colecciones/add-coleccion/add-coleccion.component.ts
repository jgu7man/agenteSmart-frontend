import { Component, OnInit } from '@angular/core';
import { ColeccionModel } from '../collection.interface';
import { MatDialogRef } from '@angular/material/dialog';
import { ColeccionesService } from '../colecciones.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  templateUrl: './add-coleccion.component.html',
  styleUrls: ['./add-coleccion.component.scss']
})
export class AddColeccionComponent implements OnInit {

  coleccion: ColeccionModel
  
  constructor (
    public dialog: MatDialogRef<AddColeccionComponent>,
    private _colecciones: ColeccionesService
  ) {
    this.coleccion = new ColeccionModel('', 'guardado')
   }

  ngOnInit(): void {
  }

  onColeccionTipoSelected( selected: MatSelectChange ) {
    this.coleccion.tipo = selected.value
  }

  addColeccionDato() {
    if ( this.coleccion.name != '' ) {
      this._colecciones.addColeccion( this.coleccion )
        .then( () => this.dialog.close())
    }
  }

}
