import { Component, OnInit, Inject } from '@angular/core';
import { ColeccionesService } from '../colecciones.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './del-coleccion.component.html',
  styleUrls: ['./del-coleccion.component.scss']
})
export class DelColeccionComponent implements OnInit {

  constructor (
    public dialog: MatDialogRef<DelColeccionComponent>,
    @Inject(MAT_DIALOG_DATA) public colName: string,
    public colecciones: ColeccionesService,
  ) { }

  ngOnInit(): void {
  }

}
