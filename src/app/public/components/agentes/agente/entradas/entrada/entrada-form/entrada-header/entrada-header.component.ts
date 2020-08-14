import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { EntradaModel } from '../../../entrada.model';
import { EntradasService } from '../../../entradas.service';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { DelEntradaDialogComponent } from '../../../del-entrada-dialog/del-entrada-dialog.component';
import { CurrentEntradaService } from '../../current-entrada.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'aSmart-entrada-header',
  templateUrl: './entrada-header.component.html',
  styleUrls: ['./entrada-header.component.scss']
})
export class EntradaHeaderComponent implements OnInit {

  entrada: EntradaModel
  switchEdit: boolean = false
  nameEdited: string

  constructor (
    private _entrada: CurrentEntradaService,
    private _dialog: MatDialog,
    public location: Location
  ) { }

  ngOnInit(): void {
    this.getEntrada()
  }
  
  async getEntrada() {
    this._entrada.currentEntrada$.subscribe( current => {
      this.entrada = current.entrada
    })
  }

  

  toEditName() {
    this.switchEdit = true
    this.nameEdited = this.entrada.displayName
  }

  

  updateDisplayName() {
    this.switchEdit = false
    this.entrada.displayName = this.nameEdited
    this._entrada.updateEntradaName( this.entrada.name, this.nameEdited )
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
