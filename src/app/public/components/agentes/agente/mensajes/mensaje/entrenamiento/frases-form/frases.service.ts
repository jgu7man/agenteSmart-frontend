import { Injectable } from '@angular/core';
import { FraseEntrenamiento, FraseParte, IntentModel } from '../../../mensaje.model';
import { CurrentAgenteService } from '../../../../current-agente.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { CurrentMensajeService } from '../../current-mensaje.service';
import { CacheService } from '../../../../../../../../Gdev-Tools/cache/cache.service';
import { Loading } from '../../../../../../../../Gdev-Tools/loading/loading.service';
import { Observable, of, Subject } from 'rxjs';
import { distinctUntilKeyChanged, pluck, switchMap, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FrasesService {

  mensajesPath: string
  list$: Subject<FraseEntrenamiento[]> = new Subject()
  frasesList: FraseEntrenamiento[]
  constructor (
    private fs:  AngularFirestore,
    private _agente: CurrentAgenteService,
    private _mensaje: CurrentMensajeService,
    private _cache: CacheService,
    private loading: Loading
  ) {
    

    
    
    
    // Get subscriptions
    this._mensaje.current$.pipe(
      map<IntentModel, FraseEntrenamiento[]>( mensaje => mensaje.trainingPhrases )
    ).subscribe( this.list$ )
    this.list$.subscribe( list => {
      this.frasesList = list
    } )



   }

  
  
  
  
  async mensajesCollection() {
    this.mensajesPath = await this._agente.getPath( `mensajes` )
    const mensajesRef = this.fs.collection( this.mensajesPath ).ref
    return mensajesRef
  }
  
  
  // CREATE Frses de entrenamiento
  async addTraningPhrase( frase: FraseEntrenamiento ) {
    try {

      const mensaje = await this._cache.getDataKey( 'currentMensaje' )
      frase.name = Math.random().toString( 36 ).substring( 7 );
      var newFrase = [ frase ];
      console.log( frase );
      
      if ( this.frasesList ) {
        console.log( 'update' );
        this.frasesList.push( frase )
        mensaje[ 'trainingPhrases' ] = this.frasesList
        await ( await this.mensajesCollection() ).doc( mensaje.name )
          .update( { trainingPhrases: this.frasesList } );
      } else {
        console.log( 'create' );
        mensaje[ 'trainingPhrases' ] = [frase]
        await ( await this.mensajesCollection() ).doc( mensaje.name )
          .update( { trainingPhrases: [ frase ] } );
      }

      this._cache.updateData('currentMensaje', mensaje)

      return 

    } catch (error) {
      
    }
  }





  

  async updatePhrase( frase: FraseEntrenamiento ) {
    const mensaje = await this._cache.getDataKey( 'currentMensaje' )
    const phraseToEdit = this.frasesList.findIndex( phrase => phrase.name === frase.name )
    console.log(this.frasesList);
    this.frasesList[ phraseToEdit ] = frase;
    ( await this.mensajesCollection() ).doc( mensaje.name ).set( { trainingPhrases: this.frasesList }, {merge: true} );
    return
  }



  /**
   * Retorna la frase completa con acotaciones para definir entidades y parámetros.
   * 
   * `;text;`: [texto entre dos punto y coma] parte seleccionada
   * 
   * `~` = divide la entidad del parámetro con su valor
   * 
   * `=` = divide el parámetro de su valor
   * @example "text ;entityTypeDisplayName=paramValue; text"
   */
  stringifyFullPhrase( phrase: FraseEntrenamiento ): string {
    let partsString: string[] = []
    phrase.parts.forEach( part => {
      if ( !part.paramName ) part.paramName = '';
      partsString.push( part.entityType ?
        `;${ part.entityType }~${ part.paramName }=${ part.text };` : part.text );
      
    } )
    return partsString.join( '' )
  }


  /** Retorna la frase completa en un string sin acotaciones */
  stringCleanPhrase( phrase: FraseEntrenamiento ): string {
    let partsString: string[] = []
    phrase.parts.forEach( part => {
      partsString.push(part.text)
    } )
    return partsString.join('')
  }

  /**
   * Retornas las partes de una frase que no tienen entidad o no están seleccionadas en un string limpio
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
        if ( part ) { 

          let partSplited = part.split( '~' )
          if ( partSplited.length > 1 ) {
            let param = partSplited[ 1 ].split( '=' )
            partes.push( {
              entityType: `@${ partSplited[ 0 ] }`,
              text: param.length > 1 ? param[ 1 ] : param[ 0 ],
              selected: true,
              paramName: param.length > 1 ? param[ 0 ] : ''
            } )
          } else if ( partSplited ) {
            partes.push( {
              text: partSplited[ 0 ],
              selected: false
            } )
          }
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
  async stractSelectedPart(frase: FraseEntrenamiento, textSelected): Promise<FraseEntrenamiento> {
    var parts: FraseParte[] = []
    const cleanFrase = this.stringCleanPhrase( frase )

    // First search
    await this.loading.asyncForEach( frase.parts, async ( part, index ) => {
      if ( part.text.includes( textSelected ) ) {
        frase.parts.splice( index, 1 )
        parts = await this.getTextSelectInPart(part.text, textSelected)
      }
    } )
    console.log(parts);

    if ( parts.length < 2 ) {
      if ( cleanFrase.includes( textSelected ) ) {
        parts = []
        parts = await this.getTextSelectInPart(cleanFrase, textSelected)
        frase.parts =  parts
      }
    } else {
      parts = [ ...parts, ...frase.parts ]
      frase.parts = parts
    }

    console.log(parts);
    return frase
  }


  /**
   * Returna un nuevo arreglo de partes de frase de entrenamiento, separando un texto seleccionado
   */
  public async getTextSelectInPart( textOnSearch: string, textSelected: string ): Promise<FraseParte[]> {
    var parts: FraseParte[] = []
    var textReplaced: string, partInParts: string[] = []

    textReplaced = textOnSearch.replace( textSelected, `:${ textSelected }:` )
    partInParts = textReplaced.split( ':' )

    partInParts.forEach( ( textPart ) => {
      if ( textPart ) parts.push( {
        text: textPart,
        selected: textPart != textSelected ? false : true
      } )
    } )

    return parts
  }



  async deletePhrase( frase: FraseEntrenamiento ) {
    const mensaje = await this._cache.getDataKey( 'currentMensaje' )
    const phraseToDel = this.frasesList.findIndex( phrase => phrase.name === frase.name )
    this.frasesList.splice( phraseToDel, 1 );
    
    ( await this.mensajesCollection() ).doc( mensaje.name ).set( { trainingPhrases: this.frasesList }, { merge: true } );
    return
  }

}
