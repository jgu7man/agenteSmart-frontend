import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { AgentesService } from '../../agentes.service';
import { ContextosService } from './contextos.service';
import { ActivatedRoute } from '@angular/router';
import { Loading } from '../../../../../global/loading/loading.service';
import { TextService } from '../../../../../services/text.service';
import { AgenteModel } from '../../init-agente/agente.model';
import { Contexto } from './contexto.model';
import { AddContextoComponent } from './add-contexto/add-contexto.component';
import { ContextoComponent } from './contexto/contexto.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'aSmart-contextos',
  templateUrl: './contextos.component.html',
  styleUrls: [ './contextos.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class ContextosComponent implements OnInit {

  agente: AgenteModel
  switchAddContext: boolean = false
  switchEditContext: boolean = false
  contextos: Contexto[]

  @ViewChild(AddContextoComponent) addContext: AddContextoComponent

  @ViewChild( ContextoComponent ) editContext: ContextoComponent

  constructor (
    public _contextos: ContextosService,
    private _loading: Loading,
  ) {
  }

  async ngOnInit() {
    this.getContextos()
  }


  async toAddContext() {
    this.switchAddContext = !this.switchAddContext
    await this._loading.waitFor( 100 )
    this.addContext.contextoNuevo.nativeElement.focus()
  }
  

  
  drop( event: CdkDragDrop<any> ) {
    moveItemInArray( this.contextos, event.previousIndex, event.currentIndex )
    console.log( this.contextos, event.previousIndex, event.currentIndex);
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
    let contextos = await this._contextos.getAllContexts( )
    this.contextos = contextos.length > 0 ? contextos : undefined
    console.log( this.contextos );
  }

  

  

  

  

  toDeleteContext( contexto ) {
    this._contextos.delContext( contexto ).then( () => {
      this.getContextos()
    } )
  }

}
