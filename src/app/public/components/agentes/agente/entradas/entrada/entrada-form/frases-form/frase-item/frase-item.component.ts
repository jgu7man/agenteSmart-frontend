import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FraseEntrenamiento, FraseParte } from '../../../../entrada.model';
import { Loading } from '../../../../../../../../../global/loading/loading.service';
import { FrasesService } from '../frases.service';

@Component({
  selector: 'aSmart-frase-item',
  templateUrl: './frase-item.component.html',
  styleUrls: ['./frase-item.component.scss']
})
export class FraseItemComponent implements OnInit {


  @Input() switchPhraseInput: boolean = false
  @Input() frase: FraseEntrenamiento
  @Input() phraseName: string
  @ViewChild( 'inputPhrase' ) inputPhrase: ElementRef
  phraseToEdit: string

  @Output() onDeleted = new EventEmitter<boolean>()

  constructor (
    private loading: Loading,
    private _frases: FrasesService
  ) { }

  ngOnInit(): void {
  }

  @Input() async toEditPhrase( phrase: FraseEntrenamiento ) {
    this.switchPhraseInput = true
    console.log( phrase );
    this.phraseToEdit = await this._frases.stringifyPhrase( phrase )
    await this.loading.waitFor( 100 )
    this.inputPhrase.nativeElement.focus()
  }



  onSetPhrase( PHRASE?: FraseEntrenamiento ) {

    this.switchPhraseInput = false
    console.log( this._frases.stringifyPhrase( PHRASE ), '|', this.phraseToEdit );

    if ( this._frases.stringifyPhrase( PHRASE ) === this.phraseToEdit ) {
      console.log( 'no edicion' );
    } else {
      console.log( 'editada' );
      console.log( PHRASE );

      PHRASE.parts = this._frases.createPart( this.phraseToEdit )

      console.log( PHRASE );
      this._frases.updatePhrase( PHRASE )

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

