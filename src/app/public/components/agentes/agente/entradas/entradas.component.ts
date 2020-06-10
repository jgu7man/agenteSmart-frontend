import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AgenteService } from '../agente.service';
import { ActivatedRoute } from '@angular/router';
import { Loading } from '../../../../../global/loading/loading.service';
import { TextService } from 'src/app/services/text.service';

@Component({
  selector: 'aSmart-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.scss']
})
export class EntradasComponent implements OnInit {

  agenteID
  newContext: string = ''
  switchAddContext: boolean = false
  contextos: string[]
  @ViewChild('contextoNuevo') contextoNuevo: ElementRef
  constructor (
    private _agente: AgenteService,
    private _url: ActivatedRoute,
    private _loading: Loading,
    private _text: TextService
  ) {
    this.agenteID = this._url.parent.snapshot.paramMap.get('id')
    
   }

  async ngOnInit() {
    this.getContextos()
  }

  async onAddContext() {
    this.switchAddContext = !this.switchAddContext
    await this._loading.waitFor(100)
    this.contextoNuevo.nativeElement.focus()
  }

  async getContextos() {
    let contextos = await this._agente.getContexts( this.agenteID )
    this.contextos = contextos.length > 0 ? contextos : undefined
    console.log(this.contextos);
  }
  
  onSetContext() {
    if ( this.newContext ) {
      var newContext = this._text.normalize( this.newContext ) 
      
      this._agente.setContext( this.agenteID, newContext )
      .then( () => {
        this.newContext = ''
        this.getContextos()
      } )
    } 
    this.switchAddContext = false
  }

  delSpaces( e ) {
    if ( e.which === 32 ) {
      this.newContext.valueOf().replace(/\s/g, '')
      return false
    }
    
  }

}
