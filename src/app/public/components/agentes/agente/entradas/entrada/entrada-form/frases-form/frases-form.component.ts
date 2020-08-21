import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FraseEntrenamiento, FraseParte } from '../../../entrada.model';
import { Loading } from '../../../../../../../../global/loading/loading.service';
import { FrasesService } from './frases.service';
import { ActivatedRoute } from '@angular/router';
import { CurrentEntradaService } from '../../current-entrada.service';
import { FraseItemComponent } from './frase-item/frase-item.component';
import { FraseParametersComponent } from './frase-parameters/frase-parameters.component';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'aSmart-frases-form',
  templateUrl: './frases-form.component.html',
  styleUrls: [ './frases-form.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class FrasesFormComponent implements OnInit, AfterViewInit {

  
  addPhraseInput: boolean = false
  frases: FraseEntrenamiento[]
  newPhrase: string
  phraseParts: FraseParte[] = []
  fraseExpanded: string
  
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

  ngAfterViewInit() {
  }

  
  // CREATE frase
  async toAddPhrase() {
    this.addPhraseInput = true
    await this.loading.waitFor( 100 )
    this.newPhraseInput.nativeElement.focus()
  }


  onSetPhrase() {
    this.addPhraseInput = false
    if ( this.newPhrase ) {

      const NEWPHRASE: FraseEntrenamiento = {
        type: 'EXAMPLE',
        parts: this._frases.createParts( this.newPhrase )
      }
      console.log( NEWPHRASE );
      this.loading.waitFor( 200 )
      this._frases.addTraningPhrase( NEWPHRASE ).then( () => {
        this.getFrasesEntrenamiento()
      } )
    }
  }
  

  // READ Frase
  async getFrasesEntrenamiento() {
    this.frases = await this._frases.get()
    console.log( this.frases );
  }

  

  // UPDATE FRASE
  async toEditPhrase( phrase: FraseEntrenamiento ) {
    const phraseEdit = this.prhaseList.find(frase => frase.phraseName == phrase.name)
    phraseEdit.toEditPhrase(phrase)
  }


  onSelect( frase: FraseEntrenamiento ) {
    const text = window.getSelection().toString()

    if ( text ) {
      // Select the frase that whas select on
      const fraseOnEdit = this.frases.find( Frase => Frase.name == frase.name )
      const fraseOnEditIndex = this.frases.findIndex( Frase => Frase.name == frase.name )

      // Define variables
      var parts: FraseParte[] = [], textReplaced: string, partInParts: string[] = []
      
      
      // Find the part that includes text selected and split it
      fraseOnEdit.parts.forEach( ( part, index ) => {
        if ( part.text.includes( text ) ) {
          
          fraseOnEdit.parts.splice(index, 1)
          textReplaced = part.text.replace( text, `:${ text }:` )
          partInParts = textReplaced.split( ':' )
          
          partInParts.forEach( ( textPart ) => {
            if(textPart) parts.push( {
                text: textPart,
                selected: textPart != text ? false : true
              } )
          } )
        } 
      })


      // Merge the parts
      parts = [ ...parts, ...this.frases[ fraseOnEditIndex ].parts ]
      this.frases[ fraseOnEditIndex ].parts
      
      console.log(parts);
      this.fraseExpanded = frase.name
      const phraseItemEdited = this.prhaseList.find( Frase => Frase.phraseName == frase.name )
      phraseItemEdited.frase.parts = parts
    }
  }


  



  



  


  trackByFraseName( index, frase: FraseEntrenamiento ) {
    return frase.name
  }


  

  

}
