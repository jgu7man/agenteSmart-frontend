import { Component, OnInit, OnDestroy } from '@angular/core';
import { IntentModel } from '../../../mensaje.model';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { DelMensajeDialogComponent } from '../../../del-mensaje-dialog/del-mensaje-dialog.component';
import { CurrentMensajeService } from '../../current-mensaje.service';
import { Store } from '@ngrx/store';
import { MensajeState } from '../../../mensaje.model';
import { map, switchMap, pluck } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CurrentMensajeState } from '../../store/mensaje.state';

@Component({
  selector: 'aSmart-mensaje-header',
  templateUrl: './mensaje-header.component.html',
  styleUrls: ['./mensaje-header.component.scss']
})
export class MensajeHeaderComponent implements OnInit, OnDestroy {

  mensaje: IntentModel
  switchEdit: boolean = false
  nameEdited: string
  
  stateSubs: Subscription
  unsaved: boolean

  constructor (
    public _mensaje: CurrentMensajeService,
    private _dialog: MatDialog,
    public location: Location,
    public store: Store<CurrentMensajeState>
  ) { }

  ngOnInit(): void {
    this.getMensaje()
    this.stateSubs = this.store
      .subscribe( store => {
        console.log(store, store.state.unsaved);
        this.unsaved = store.state.unsaved
      } )
  }

  
  
  async getMensaje() {
    this._mensaje.current$.subscribe( current => {
      this.mensaje = current
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

  ngOnDestroy() {
    this.stateSubs.unsubscribe()
  }

}
