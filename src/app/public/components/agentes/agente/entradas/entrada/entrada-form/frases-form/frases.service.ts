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
  
  
  async addTraningPhrase( phrase: FraseEntrenamiento ) {

    const entrada = await this._cache.getDataKey( 'currentEntrada' )
    phrase.name = Math.random().toString( 36 ).substring( 7 );
    var newFrase = [ phrase ];
    const phrasesList = await this.get()
    console.log( { entrada, newFrase } );
    
    if ( phrasesList.length > 0 ) {
      phrasesList.push( phrase )
      await ( await this.entradasCollection() ).doc( entrada.name )
        .update( { trainingPhrases: phrasesList } );
    } else {
      await ( await this.entradasCollection() ).doc( entrada.name )
        .update( { trainingPhrases: [phrase]} );
    }

    
    return 
  }



  async get() {
    const entrada = await this._entrada.getCurrentEntrada()
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



  stringifyPhrase( phrase: FraseEntrenamiento ): string {
    let partsString: string[] = []
    phrase.parts.forEach( part => {
      if ( part.entityType ) {
        partsString.push( `;${ part.entityType }=${ part.text };` )
      } else {
        partsString.push( part.text )
      }
    } )
    return partsString.join( '' )
  }

  stringifyParts( phrase: FraseEntrenamiento ): string {
    let partialString: string[] = []
    phrase.parts.forEach( part => {
      if ( !part.selected ) {
        partialString.push( part.text )
      } 
    } )
    return partialString.join('')
  }


  createPart( frase: string ): FraseParte[] {
    const fraseInParts = frase.split( '@' )
    var partes: FraseParte[] = []

    console.log( fraseInParts );

    if ( fraseInParts.length > 1 ) {
      fraseInParts.forEach( part => {
        let entity = part.split( ':' )
        partes.push( {
          entityType: `@${ entity[ 0 ] }`,
          text: entity[ 1 ]
        } )
      } )



    } else {
      partes.push( { text: frase } )
    }

    console.log( partes );

    return partes
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
