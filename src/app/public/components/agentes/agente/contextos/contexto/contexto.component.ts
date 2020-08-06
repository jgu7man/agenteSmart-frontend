import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { TextService } from '../../../../../../services/text.service';
import { ContextosService } from '../contextos.service';
import { CurrentAgenteService } from '../../agente.service';
import { Contexto } from '../contexto.model';
import { Loading } from '../../../../../../global/loading/loading.service';
import { BehaviorSubject } from 'rxjs';
import { Context } from 'vm';

@Component({
  selector: 'aSmart-contexto',
  templateUrl: './contexto.component.html',
  styleUrls: ['./contexto.component.scss']
})
export class ContextoComponent implements OnInit {

  

  
  @Input() contextId: string
  @Input() contexto: Contexto
  editedContext:string = ''
  switchEditContext: boolean = false
  @ViewChild( 'contextEditing' ) contextEditing: ElementRef
  @Output() contextEdited: EventEmitter<any> = new EventEmitter()

  constructor (
    private _text: TextService,
    private _contextos: ContextosService,
    private _loading: Loading
  ) {
    
   }

  ngOnInit(): void {
    
  }
  
  @Input() async toEditContext( context: string ) {
    this.switchEditContext = !this.switchEditContext
    this.editedContext = context
    await this._loading.waitFor( 100 )
    this.contextEditing.nativeElement.focus()
  }

  onEditContext() {
    if ( this.editedContext ) {
      var editedContext = this._text.normalize( this.editedContext )

      this.contexto.contextName = editedContext
      this._contextos.setContext( this.contexto )
        .then( () => {
          this.editedContext = ''
          this.contextEdited.emit(true)
        } )
    }
    this.switchEditContext = false
  }

  delSpaces( e ) {
    if ( e.which === 32 ) {
      this.editedContext.valueOf().replace( /\s/g, '' )
      return false
    }

  }

}
