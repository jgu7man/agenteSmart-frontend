import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FraseEntrenamiento, FraseParte } from '../../../../mensaje.model';
import { Loading } from '../../../../../../../../../gdev-tools/loading/loading.service';
import { FrasesService } from '../frases.service';
import { ParametrosService } from '../../parametros/parametros.service';

@Component({
  selector: 'aSmart-frase-item',
  templateUrl: './frase-item.component.html',
  styleUrls: ['./frase-item.component.scss']
})
export class FraseItemComponent implements OnInit {


  @Input() switchPhraseInput: boolean = false
  @Input() frase: FraseEntrenamiento
  @Input() index: number
  @ViewChild( 'inputPhrase' ) inputPhrase: ElementRef
  phraseToEdit: string

  @Output() onDeleted = new EventEmitter<boolean>()

  constructor (
    private loading: Loading,
    private _frases: FrasesService,
    public params_: ParametrosService
  ) { }

  ngOnInit(): void {
  }

  preventOnClick(event) {
      event.preventDefault()
      event.stopImmediatePropagation()
  }

  @Input() async toEditPhrase( phrase: FraseEntrenamiento ) {
    this.switchPhraseInput = true
    console.log( phrase );
    this.phraseToEdit = await this._frases.stringifyFullPhrase( phrase )
    await this.loading.waitFor( 100 )
    this.inputPhrase.nativeElement.focus()
  }



  onSetPhrase( PHRASE?: FraseEntrenamiento ) {

    this.switchPhraseInput = false
    console.log( this._frases.stringifyFullPhrase( PHRASE ), '|', this.phraseToEdit );

    if ( this._frases.stringifyFullPhrase( PHRASE ) === this.phraseToEdit ) {
      console.log( 'no edicion' );
    } else {
      console.log( 'editada' );
      console.log( PHRASE );

      PHRASE.parts = this._frases.createParts( this.phraseToEdit )

      console.log( PHRASE );
      this._frases.updatePhrase( PHRASE, this.index )

    }

  }





  onSelectPart( textSelected: string ) {
    try {

    } catch (error) {

    }
  }

  delItem() {
    this._frases.deletePhrase( this.frase ).then( () => {
      this.onDeleted.emit(true)
    })
  }

}

