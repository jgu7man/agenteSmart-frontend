import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, ViewEncapsulation } from '@angular/core';
import { FraseEntrenamiento, FraseParte } from '../../../entrada.model';
import { Loading } from '../../../../../../../../global/loading/loading.service';
import { FrasesService } from './frases.service';
import { ActivatedRoute } from '@angular/router';
import { CurrentEntradaService } from '../../current-entrada.service';
import { FraseItemComponent } from './frase-item/frase-item.component';
import { FraseParametersComponent } from './frase-parameters/frase-parameters.component';

@Component({
  selector: 'aSmart-frases-form',
  templateUrl: './frases-form.component.html',
  styleUrls: [ './frases-form.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class FrasesFormComponent implements OnInit {

  
  addPhraseInput: boolean = false
  frases: FraseEntrenamiento[]
  newPhrase: string
  phraseParts: FraseParte[] = []
  
  @ViewChild( 'newPhraseInput' ) newPhraseInput: ElementRef
  @ViewChildren( FraseItemComponent ) prhaseList: QueryList<FraseItemComponent>
  @ViewChildren( FraseParametersComponent ) parametersList: QueryList<FraseParametersComponent>


  constructor (
    private loading: Loading,
    private _frases: FrasesService,
    private _route: ActivatedRoute,
    private _entradas: CurrentEntradaService,
  ) { }

  ngOnInit(): void {
    this.getFrasesEntrenamiento()
  }

  

  async toAddPhrase() {
    this.addPhraseInput = true
    await this.loading.waitFor( 100 )
    this.newPhraseInput.nativeElement.focus()
  }
  
  

  
  
  async onAddPhrase() {
    let fraseInParts = this.newPhrase.split( '@' )
    if ( fraseInParts.length > 1 ) {

      await this.loading.asyncForEach( fraseInParts, part => {
        let entity = part.split( ':' )
        return this.phraseParts.push( {
          entityType: `@${ entity[ 0 ] }`,
          text: entity[ 1 ]
        })
      } )
      
    } else {
      this.phraseParts.push({text: this.newPhrase})
    }

    let PRHASE: FraseEntrenamiento = {
      type: 'EXAMPLE',
      parts: this.phraseParts
    }

    console.log(PRHASE);

    this._frases.addTraningPhrase( PRHASE ).then( () => {
      this.getFrasesEntrenamiento()
    })

  }



  async toEditPhrase( phrase: FraseEntrenamiento ) {
    const phraseEdit = this.prhaseList.find(frase => frase.phraseName == phrase.name)
    phraseEdit.toEditPhrase(phrase)
  }

  onSelect( frase: FraseEntrenamiento ) {
    const text = window.getSelection().toString()

    if ( text ) {
      const fraseOnEditIndex = this.frases.findIndex(Frase => Frase.name == frase.name)
      const cleanPart = this._frases.stringifyPhrase( frase )
      console.log(cleanPart);
      var textReplaced = cleanPart.replace( text, `:${ text }:` )
      console.log(textReplaced);
      var textSplited = textReplaced.split( ':' )
      console.log(textSplited);
      var parts: FraseParte[] = []
      
      
      textSplited.forEach( ( textPart ) => {
        if(textPart) 
        if ( textPart != text ) { parts.push( { text: textPart, selected: false } ) }
        else { parts.push( { text: textPart, selected: true } ) }
      } )

      console.log( parts );

      this.frases[ fraseOnEditIndex ].parts = { ...parts, ...this.frases[ fraseOnEditIndex ].parts}

      console.log(this.frases[fraseOnEditIndex]);

      // parts.push( { text: text, selected: true } )
      // frase.parts = parts
      
      const phraseItemEdited = this.prhaseList.find( Frase => Frase.phraseName == frase.name )
      phraseItemEdited.frase.parts = parts
    }
  }


  



  onSetPhrase( ) {
    this.addPhraseInput = false
    if (this.newPhrase) {
      
      const NEWPHRASE: FraseEntrenamiento = {
        type: 'EXAMPLE',
        parts: this._frases.createPart( this.newPhrase ) 
      } 
      console.log( NEWPHRASE );
      
      this._frases.addTraningPhrase( NEWPHRASE ).then( () => {
        this.getFrasesEntrenamiento()
      } )
    }
  }



  async getFrasesEntrenamiento() {
    this.frases = await this._frases.get()
    console.log(this.frases);
  }


  trackByFraseName( index, frase: FraseEntrenamiento ) {
    return frase.name
  }


  

  

}
