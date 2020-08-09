import { Component, OnInit, Input } from '@angular/core';
import { EntradaModel } from '../../../entrada.model';
import { EntradasService } from '../../../entradas.service';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { DelEntradaDialogComponent } from '../../../del-entrada-dialog/del-entrada-dialog.component';

@Component({
  selector: 'aSmart-entrada-header',
  templateUrl: './entrada-header.component.html',
  styleUrls: ['./entrada-header.component.scss']
})
export class EntradaHeaderComponent implements OnInit {

  @Input() entrada: EntradaModel
  switchEdit: boolean = false
  nameEdited: string

  constructor (
    private _entradas: EntradasService,
    private _dialog: MatDialog,
    public location: Location
  ) { }

  ngOnInit(): void {
  }

  toEditName() {
    this.switchEdit = true
    this.nameEdited = this.entrada.displayName
  }

  

  updateDisplayName() {
    this.switchEdit = false
    this.entrada.displayName = this.nameEdited
    this._entradas.updateEntradaName( this.entrada.name, this.nameEdited )
    this.nameEdited = undefined
  }

  toDelEntrada() {
    var dialog = this._dialog.open( DelEntradaDialogComponent, {
      minWidth: '400px',
      data: this.entrada.name
    } )

    dialog.afterClosed().subscribe( () => {
      this.location.back()
    } )
  }

}
