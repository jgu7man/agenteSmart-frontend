import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntradasService } from '../entradas.service';

@Component({
  templateUrl: './del-entrada-dialog.component.html',
  styleUrls: ['./del-entrada-dialog.component.scss']
})
export class DelEntradaDialogComponent implements OnInit {

  constructor (
    public dialog: MatDialogRef<DelEntradaDialogComponent>,
    @Inject( MAT_DIALOG_DATA ) public entradaName: string,
    public entradas: EntradasService
  ) { }

  ngOnInit(): void {
  }

}
