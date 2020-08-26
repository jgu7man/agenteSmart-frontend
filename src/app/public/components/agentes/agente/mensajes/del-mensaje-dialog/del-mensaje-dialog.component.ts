import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrentMensajeService } from '../mensaje/current-mensaje.service';

@Component({
  templateUrl: './del-mensaje-dialog.component.html',
  styleUrls: ['./del-mensaje-dialog.component.scss']
})
export class DelMensajeDialogComponent implements OnInit {

  constructor (
    public dialog: MatDialogRef<DelMensajeDialogComponent>,
    @Inject( MAT_DIALOG_DATA ) public mensajeName: string,
    public mensaje: CurrentMensajeService
  ) { }

  ngOnInit(): void {
  }

}
