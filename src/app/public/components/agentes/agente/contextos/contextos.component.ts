import { Component, OnInit, ViewChild,  ViewEncapsulation,  QueryList, ViewChildren, OnDestroy } from '@angular/core';
import { ContextosService } from './contextos.service';
import { GdevLoading } from '../../../../../gdev-tools/src/lib/loading/loading.service';
import { AgenteModel } from '../../init-agente/agente.model';
import { ContextoModel } from './contexto.model';
import { AddContextoComponent } from './add-contexto/add-contexto.component';
import { ContextoComponent } from './contexto/contexto.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CurrentAgenteService } from '../current-agente.service';
import { flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { I } from '@angular/cdk/keycodes';

@Component({
  selector: 'aSmart-contextos',
  templateUrl: './contextos.component.html',
  styleUrls: [ './contextos.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class ContextosComponent implements OnInit, OnDestroy {

  agente: AgenteModel
  switchAddContext: boolean = false
  switchEditContext: boolean = false
  list: ContextoModel[]
  list$: Observable<ContextoModel[]>
  contextToEdit: string

  @ViewChild(AddContextoComponent) addContext: AddContextoComponent

  @ViewChildren( ContextoComponent ) contextCols: QueryList<ContextoComponent>

  constructor (
    public contextos: ContextosService,
    private _loading: GdevLoading,
    public agente_: CurrentAgenteService
  ) {

    this.list$ = this.contextos.list$
      ? this.contextos.list$
      : this.agente_.loaded$.pipe(
        flatMap(() => this.contextos.list$)
      )

      this.list$.subscribe(list => {
        this.list = list;
      })

  }

  async ngOnInit() {
    this.getContextos()
  }

  trackContextById( index: number, context: ContextoModel ) {
    return context.id
  }

  toEdit(contexto: ContextoModel) {
    var column = this.contextCols.find( contextCol => contextCol.contextId == contexto.id )
    column.toEditContext(contexto.contextName)
  }


  async toAddContext() {
    this.switchAddContext = !this.switchAddContext
    await this._loading.waitFor( 100 )
    this.addContext.contextoNuevo.nativeElement.focus()
  }



  drop( event: CdkDragDrop<any> ) {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex)
    this.list = this.list.map((i, index) => { return {...i, index } })
    this.contextos.updateIndex(this.list)
  }

  grabEffect( element ) {
    var el:HTMLElement = element.target
    el.classList.add('grabbed')
  }

  ungrab( element ) {
    var el: HTMLElement = element.target
    el.classList.remove( 'grabbed' )
  }



  async getContextos() {
    // let contextos = await this._contextos.getAllContexts( )
    // this.contextos = contextos.length > 0 ? contextos : undefined
  }



  ngOnDestroy(): void {
    this.contextos.unsubscribeAllContext()
  }





  toDeleteContext( contexto ) {
    this.contextos.delContext( contexto ).then( () => {
      this.getContextos()
    } )
  }

}
