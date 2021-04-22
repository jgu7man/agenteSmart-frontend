import { AddTipoComponent } from './add-tipo/add-tipo.component';
import { Component, OnInit, ViewChild, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { GdevLoading } from '../../../../../gdev-tools/src/lib/loading/loading.service';
import { TiposService } from './tipos.service';
import { CurrentAgenteService } from '../current-agente.service';
import { MatDialog } from '@angular/material/dialog';
import { TipoComponent } from './tipo/tipo.component';
import { TipoState } from './store/tipo.state';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { SystemEntitiesService } from '../../../../../admin/system/system-entities.service';
import { CurrentTipoService } from './tipo/current-tipo.service';

@Component({
  selector: 'aSmart-tipos',
  templateUrl: './tipos.component.html',
  styleUrls: ['./tipos.component.scss']
})
export class TiposComponent implements OnInit,  OnDestroy {

  /** Lista de los componentes generados por el ngFor */
  @ViewChildren(TipoComponent) public tiposList: QueryList<TipoComponent>
  /** Panel deslizble que muestra el tipo seleccionado */
  @ViewChild('currentTipo') public tipoDrawer: MatDrawer
  /** List selector que organiza los tipos */
  @ViewChild( 'listPanel' ) public listPanel: MatSelectionList
  /** Tipo selected by the list panel */
  public tipoSelected: TipoState


  constructor (
    public tipos_: TiposService,
    public agente_: CurrentAgenteService,
    public systemEntities_: SystemEntitiesService,
    private _tipo: CurrentTipoService,
    private _dialog: MatDialog,
    private _loading: GdevLoading,
  ) {

   }

  ngOnInit(): void {
  }

  onSelected( selected: MatSelectionListChange ) {
    if (this.tipoDrawer.opened) { this.tipoDrawer.close() }
    this.tipoSelected = new TipoState(selected.option.value)
    this.tipoDrawer.open()
  }


  openAdd() {
    var dialog = this._dialog.open( AddTipoComponent, {
      minWidth: 300
    } )

    dialog.beforeClosed()
      .subscribe((newTipo) => {
      if (newTipo) {
        this._tipo.resetCurrent()
        this.tipoSelected = newTipo
        this.tipoDrawer.open()
      }
    })
  }

  onClose(): void {
    this.tipoDrawer.close()
    this.listPanel.deselectAll()
    delete this.tipoSelected
  }

  ngOnDestroy() {
    this.tipos_.unsubscribe()
    delete this.tipoSelected
  }

}
