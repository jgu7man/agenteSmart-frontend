import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionListChange, MatSelectionList } from '@angular/material/list';
import { ColeccionesService } from './colecciones.service';
import { ColeccionModel } from './collection.interface';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { AddColeccionComponent } from './add-coleccion/add-coleccion.component';

@Component({
  selector: 'aSmart-colecciones',
  templateUrl: './colecciones.component.html',
  styleUrls: ['./colecciones.component.scss']
})
export class ColeccionesComponent implements OnInit {


  coleccionSelected: ColeccionModel
  @ViewChild( 'currentCol' ) colPanel: MatDrawer
  @ViewChild('listPanel') listPanel: MatSelectionList
  constructor (
    public colService: ColeccionesService,
    private _dialog: MatDialog
  ) {
    this.coleccionSelected = new ColeccionModel( '', '' )
   }

  ngOnInit(): void {
  }

  onCollectionSelected( selected: MatSelectionListChange ) {
    this.coleccionSelected = selected.option.value
    this.colPanel.open()
  }

  onCloseColeccion() {
    this.colPanel.close()
    this.listPanel.deselectAll()
    this.coleccionSelected = new ColeccionModel( '', '' )
  }

  openAddDialog() {
    this._dialog.open( AddColeccionComponent, {
      minWidth: 450,
    })
  }

}
