import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TipoEntidadModel, Clase } from '../tipo.model';
import { Loading } from '../../../../../../gdev-tools/loading/loading.service';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { TiposService } from '../tipos.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';


@Component({
  selector: 'aSmart-add-tipo',
  templateUrl: './add-tipo.component.html',
  styleUrls: ['./add-tipo.component.scss']
})
export class AddTipoComponent implements OnInit, OnDestroy {

  newTipo: TipoEntidadModel
  dialgoSubs: Subscription
  
  
  constructor (
    private dialog: MatDialogRef<AddTipoComponent>,
    public tiposService: TiposService,
  ) {
    this.newTipo = new TipoEntidadModel( '', 'KIND_LIST', 'AUTO_EXPANSION_MODE_UNSPECIFIED', [], false )
   }

  ngOnInit(): void {
    this.dialgoSubs = this.tiposService.closeCreateDialog
      .subscribe( () => { this.dialog.close() })
  }


  cancel() {
    this.newTipo = new TipoEntidadModel(  '', 'KIND_LIST', 'AUTO_EXPANSION_MODE_UNSPECIFIED', [], false )
    this.dialog.close()
  }


  async onAddTipo() {
    console.log('creando: ', this.newTipo);
    if ( this.newTipo.displayName != '' ) {
      this.tiposService.createTipo( this.newTipo )
        .then( newTipo => { this.dialog.close( newTipo ) } )
    }
  }

  
  delSpaces( e ) {
    if ( e.which === 32 ) {
      e.stopPropagation();
      return false
    } else if (e.which === 13) {
      e.stopPropagation();
    }

  }

  ngOnDestroy() {
    this.dialgoSubs.unsubscribe()
  }

}
