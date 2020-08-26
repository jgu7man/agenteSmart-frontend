import { Component, OnInit } from '@angular/core';
import { IntentModel } from '../../../mensaje.model';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { DelMensajeDialogComponent } from '../../../del-mensaje-dialog/del-mensaje-dialog.component';
import { CurrentMensajeService } from '../../current-mensaje.service';

@Component({
  selector: 'aSmart-mensaje-header',
  templateUrl: './mensaje-header.component.html',
  styleUrls: ['./mensaje-header.component.scss']
})
export class MensajeHeaderComponent implements OnInit {

  mensaje: IntentModel
  switchEdit: boolean = false
  nameEdited: string

  constructor (
    private _mensaje: CurrentMensajeService,
    private _dialog: MatDialog,
    public location: Location
  ) { }

  ngOnInit(): void {
    this.getMensaje()
  }
  
  async getMensaje() {
    this._mensaje.currentMensaje$.subscribe( current => {
      this.mensaje = current.mensaje
    })
  }

  

  toEditName() {
    this.switchEdit = true
    this.nameEdited = this.mensaje.displayName
  }

  

  updateDisplayName() {
    this.switchEdit = false
    this.mensaje.displayName = this.nameEdited
    this._mensaje.updateMensajeName( this.mensaje.name, this.nameEdited )
    this.nameEdited = undefined
  }

  toDelMensaje() {
    var dialog = this._dialog.open( DelMensajeDialogComponent, {
      minWidth: '400px',
      data: this.mensaje.name
    } )

    dialog.afterClosed().subscribe( () => {
      this.location.back()
    } )
  }

}
