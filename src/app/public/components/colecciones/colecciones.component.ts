import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSelectionListChange, MatSelectionList } from '@angular/material/list';
import { ColeccionesService } from './colecciones.service';
import { ColeccionModel } from './collection.interface';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { AddColeccionComponent } from './add-coleccion/add-coleccion.component';
import { CurrentAgenteService } from '../agentes/agente/current-agente.service';
import { Subscription, Observable } from 'rxjs';
import { CacheService } from '../../../Gdev-Tools/cache/cache.service';

@Component({
  selector: 'aSmart-colecciones',
  templateUrl: './colecciones.component.html',
  styleUrls: ['./colecciones.component.scss']
})
export class ColeccionesComponent implements OnInit, OnDestroy {

  coleccionSelected: ColeccionModel
  @ViewChild( 'currentCol' ) colPanel: MatDrawer
  @ViewChild('listPanel') listPanel: MatSelectionList
  constructor (
    public colecciones_: ColeccionesService,
    private _dialog: MatDialog,
    public agente: CurrentAgenteService,
    private _cache: CacheService
  ) {
    this.coleccionSelected = new ColeccionModel( ''  )
   }

  async ngOnInit() {
  }

  onCollectionSelected( selected: MatSelectionListChange ) {
    if ( this.colPanel.opened ) { this.colPanel.close() }
    this.coleccionSelected = selected.option.value
    this.colPanel.open()
  }

  onCloseColeccion() {
    this.colPanel.close()
    this.listPanel.deselectAll()
    this.coleccionSelected = new ColeccionModel( '',  )
  }

  openAddDialog() {
    this._dialog.open( AddColeccionComponent, {
      minWidth: 450,
    })
  }

  ngOnDestroy() {
  }

}
