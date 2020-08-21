import { Injectable } from '@angular/core';
import { FraseEntrenamiento, FraseParte } from '../../../entrada.model';
import { CurrentAgenteService } from '../../../../current-agente.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { CurrentEntradaService } from '../../current-entrada.service';
import { CacheService } from '../../../../../../../../global/cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class FrasesService {

  entradasPath: string
  constructor (
    private fs:  AngularFirestore,
    private _agente: CurrentAgenteService,
    private _entrada: CurrentEntradaService,
    private _cache: CacheService
  ) { }

  async entradasCollection() {
    this.entradasPath = await this._agente.getPath( `entradas` )
    const entradasRef = this.fs.collection( this.entradasPath ).ref
    return entradasRef
  }
  
  
  // CREATE Frses de entrenamiento
  async addTraningPhrase( frase: FraseEntrenamiento ) {
    try {

      const frasesList = await this.get()
      const entrada = await this._cache.getDataKey( 'currentEntrada' )
      frase.name = Math.random().toString( 36 ).substring( 7 );
      var newFrase = [ frase ];
      console.log( frase );
      console.log( { entrada, newFrase } );

      if ( frasesList.length > 0 ) {
        frasesList.push( frase )
        await ( await this.entradasCollection() ).doc( entrada.name )
          .update( { trainingPhrases: frasesList } );
      } else {
        await ( await this.entradasCollection() ).doc( entrada.name )
          .update( { trainingPhrases: [ frase ] } );
      }


      return 

    } catch (error) {
      
    }
  }


// READ Frases de entrenamietos
  async get() {
    const entrada = await (await this._entrada.getCurrentEntrada())
    const frasesList: FraseEntrenamiento[] = await ( await ( await this.entradasCollection() )
      .doc( entrada.name ).get() )
        .get( 'trainingPhrases' );
    
    return frasesList
  }


  

  async updatePhrase( frase: FraseEntrenamiento ) {
    const entrada = await this._cache.getDataKey( 'currentEntrada' )
    const phrasesList = await this.get()
    const phraseToEdit = phrasesList.findIndex( phrase => phrase.name === frase.name )
    phrasesList[ phraseToEdit ] = frase;
    ( await this.entradasCollection() ).doc( entrada.name ).set( { trainingPhrases: phrasesList }, {merge: true} );
    return
  }



  /**
   * Returns the full frase in a string that represents entity parts with (;) and (=) as value
   * @example "text ;entityTypeDisplayName=paramValue; text"
   */
  stringifyFullPhrase( phrase: FraseEntrenamiento ): string {
    let partsString: string[] = []
    phrase.parts.forEach( part => {
      if (!part.paramName) part.paramName = ''
      partsString.push( part.entityType ?
        `;${ part.entityType }:${part.paramName}=${ part.text };` : part.text )
    } )
    return partsString.join( '' )
  }

  /**
   * Return the parts of a frase that no has entity or not are selected
   */
  stringifyUnselectParts( phrase: FraseEntrenamiento ): string {
    let partialString: string[] = []
    phrase.parts.forEach( part => {
      if ( !part.selected ) {
        partialString.push( part.text )
      } 
    } )
    return partialString.join('')
  }



  /**
   * Returns a part of a string with the manual format.
   */
  createParts( frase: string ): FraseParte[] {
    const fraseInParts = frase.split( ';' )
    var partes: FraseParte[] = []

    console.log( fraseInParts );

    if ( fraseInParts.length > 1 ) {
      fraseInParts.forEach( ( part ) => {
        let entity = part.split( ':' )
        if ( entity.length > 1 ) {
          let param = entity[ 1 ].split('=')
          partes.push( {
            entityType: `@${ entity[ 0 ] }`,
            text: param.length > 1 ? param[1] : param[0],
            selected: true,
            paramName: param.length > 1 ? param[0] : ''
          } )
        } else if (entity) {
          partes.push( {
            text: entity[ 0 ],
            selected: false
          } )
        }
      } )
    } else {
      partes.push( {
        text: frase,
        selected: false
      } )
    }

    console.log( partes );

    return partes
  }



  /**
   * Returns parts after find the part that includes the text selected and split it
   */
  async stractEntityPart(frase: FraseEntrenamiento, text): Promise<FraseParte[]> {
    var parts: FraseParte[] = [], textReplaced: string, partInParts: string[] = []
    
    frase.parts.forEach( ( part, index ) => {
      if ( part.text.includes( text ) ) {

        frase.parts.splice( index, 1 )
        textReplaced = part.text.replace( text, `:${ text }:` )
        partInParts = textReplaced.split( ':' )

        partInParts.forEach( ( textPart ) => {
          if ( textPart ) parts.push( {
            text: textPart,
            selected: textPart != text ? false : true
          } )
        } )
      }
    } )
    return parts
  }


  /**
   * name
   */
  public name() {
    
  }



  async deletePhrase( frase: FraseEntrenamiento ) {
    const entrada = await this._cache.getDataKey( 'currentEntrada' )
    const phrasesList = await this.get()
    const phraseToDel = phrasesList.findIndex( phrase => phrase.name === frase.name )
    phrasesList.splice( phraseToDel, 1 );
    
    ( await this.entradasCollection() ).doc( entrada.name ).set( { trainingPhrases: phrasesList }, { merge: true } );
    return
  }

}
