import { AddTipoComponent } from './add-tipo/add-tipo.component';
import { Component, OnInit, ViewChild, ViewChildren, QueryList, AfterViewInit, OnDestroy } from '@angular/core';
import { Loading } from '../../../../../Gdev-Tools/loading/loading.service';
import { TiposService } from './tipos.service';
import { Observable, Subscription } from 'rxjs';
import { CurrentAgenteService } from '../current-agente.service';
import { MatDialog } from '@angular/material/dialog';
import { TipoComponent } from './tipo/tipo.component';
import { Store } from '@ngrx/store';
import { TipoState } from './store/tipo.state';
import * as actions from './store/tipo.actions'
import { TipoEntidadModel, SystemEntitieModel } from './tipo.model';
import { AppState } from '../../../../../app.state';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { SystemEntitiesService } from '../../../../../admin/system/system-entities.service';

@Component({
  selector: 'aSmart-tipos',
  templateUrl: './tipos.component.html',
  styleUrls: ['./tipos.component.scss']
})
export class TiposComponent implements OnInit, AfterViewInit, OnDestroy {

  tiposList$: Observable<TipoState[]>
  tipos: TipoEntidadModel[]
  tipoSelected: TipoState
  @ViewChildren( TipoComponent ) public tiposList: QueryList<TipoComponent>
  @ViewChild( 'currentTipo' ) public currentTipo: MatDrawer
  @ViewChild( 'listPanel' ) public listPanel: MatSelectionList 
  backendSubs: Subscription

  

  constructor (
    public tipos_: TiposService,
    public agente_: CurrentAgenteService,
    private _dialog: MatDialog,
    private loading: Loading,
    private store: Store<AppState>,
    public systemEntities_: SystemEntitiesService
  ) {
    this.tipoSelected = new TipoState(new TipoEntidadModel('', 'KIND_LIST', 'AUTO_EXPANSION_MODE_DEFAULT', [], false))
   }

  ngOnInit(): void {
    this.loading.toggleWaitingSpinner( true )
    this.backendSubs = this.tipos_.getAllEntities().subscribe( data => {
      let tipos: TipoEntidadModel[] = data.result
      tipos.forEach(tipo => this.store.dispatch(actions.addTipo({tipo})))
      this.tiposList$ = this.store.select('tipos')
      this.loading.toggleWaitingSpinner( false )
    })
  }

  ngAfterViewInit() {
  }

  onSelected( selected: MatSelectionListChange ) {
    if ( this.currentTipo.opened ) { this.currentTipo.close() }
    this.tipoSelected = selected.option.value
    this.store.dispatch(actions.selectTipo({tipo: this.tipoSelected.body}))
    console.log(this.tipoSelected);
    this.currentTipo.open()
  }


  openAdd() {
    var dialog = this._dialog.open( AddTipoComponent, {
      minWidth: 300
    } )
    
    dialog.beforeClosed().subscribe( ( newTipo ) => {
      if ( newTipo ) {
        this.store.dispatch( actions.selectTipo( { tipo: newTipo } ) )
        this.currentTipo.open()
      }
    }).unsubscribe()
  }
  
  ngOnDestroy() {
    this.store.dispatch( actions.getOut() )
    this.tipos_.unsubscribe()
    this.backendSubs.unsubscribe()
  }

}
