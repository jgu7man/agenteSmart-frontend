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
import { AppState } from '../../../../../../../../app.state';

@Component({
  selector: 'aSmart-mensaje-header',
  templateUrl: './mensaje-header.component.html',
  styleUrls: ['./mensaje-header.component.scss']
})
export class MensajeHeaderComponent implements OnInit, OnDestroy {

  // mensaje: IntentModel
  switchEdit: boolean = false
  nameEdited: string
  
  stateSubs: Subscription
  unsaved: boolean

  constructor (
    public mensaje_: CurrentMensajeService,
    private _dialog: MatDialog,
    public location: Location,
    public store: Store<AppState>
  ) { 
    this.getMensaje()
  }

  ngOnInit(): void {
    this.stateSubs = this.store
      .subscribe( store => {
        // console.log(store);
        this.unsaved = store.editIntent.unsaved
      } )
  }

  
  
  async getMensaje() {
    console.log('get');
    // this.mensaje = await this.mensaje_.getAsync()
    // console.log(this.mensaje);
  }

  

  toEditName() {
    this.switchEdit = true
    this.nameEdited = this.mensaje_.current.displayName
  }

  

  updateDisplayName() {
    this.switchEdit = false
    this.mensaje_.current.displayName = this.nameEdited
    this.mensaje_.updateMensajeName( this.mensaje_.current.name, this.nameEdited )
    this.nameEdited = undefined
  }

  toDelMensaje() {
    var dialog = this._dialog.open( DelMensajeDialogComponent, {
      minWidth: '400px',
      data: this.mensaje_.current.name
    } )

    dialog.afterClosed().subscribe( () => {
      this.location.back()
    } )
  }

  ngOnDestroy() {
    this.stateSubs.unsubscribe()
  }

}
