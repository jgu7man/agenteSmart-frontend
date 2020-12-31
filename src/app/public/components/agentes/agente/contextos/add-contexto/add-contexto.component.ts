import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { TextService } from '../../../../../../services/text.service';
import { ContextosService } from '../contextos.service';
import { Loading } from '../../../../../../gdev-tools/loading/loading.service';
import { ContextoModel } from '../contexto.model';

@Component({
  selector: 'aSmart-add-contexto',
  templateUrl: './add-contexto.component.html',
  styleUrls: ['./add-contexto.component.scss']
})
export class AddContextoComponent implements OnInit {

  newContext: string = ''
  switchAddContext: boolean = false
  @Output() contextAdded: EventEmitter<any> = new EventEmitter()
  @Output() unfocus: EventEmitter<any> = new EventEmitter()
  @ViewChild( 'contextoNuevo' ) contextoNuevo: ElementRef
  @Input() lastIndex: number

  constructor (
    private _text: TextService,
    private _contextos: ContextosService,
    private _loading: Loading
  ) {
    
   }

  ngOnInit(): void {
  }

  

  onSetContext() {
    if ( this.newContext ) {
      var newContextName = this._text.normalize( this.newContext )
      var newContext: ContextoModel = {contextName: newContextName,lifespanCount:3, index: this.lastIndex}
      this._contextos.setContext( newContext )
        .then( () => {
          this.newContext = ''
          this.contextAdded.emit(true)
        } )
    }
    this.switchAddContext = false
  }

  delSpaces( e ) {
    if ( e.which === 32 ) {
      this.newContext.valueOf().replace( /\s/g, '' )
      return false
    }

  }

}
