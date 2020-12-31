import {MensajeState} from './../../../mensaje.model';
import {Injectable} from '@angular/core';
import {FraseEntrenamiento, FraseParte, IntentModel} from '../../../mensaje.model';
import {CurrentAgenteService} from '../../../../current-agente.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {CurrentMensajeService} from '../../current-mensaje.service';
import {CacheService} from '../../../../../../../../gdev-tools/cache/cache.service';
import {Loading} from '../../../../../../../../gdev-tools/loading/loading.service';
import {Subject} from 'rxjs';
import {AlertService} from '../../../../../../../../gdev-tools/alerts/alert.service';
import {Store} from '@ngrx/store';
import * as actions from '../../store/mensaje.actions'
import {map, first, debounceTime} from 'rxjs/operators';
import {TextService} from '../../../../../../../../gdev-tools/text/gdev-text.service';

@Injectable({
    providedIn: 'root'
})
export class FrasesService {

    mensajesPath: string
    list$: Subject<FraseEntrenamiento[]> = new Subject()
    frasesList: FraseEntrenamiento[]
    constructor (
        // private fs: AngularFirestore,
        private _agente: CurrentAgenteService,
        private _mensaje: CurrentMensajeService,
        private loading: Loading,
        private alert: AlertService,
        private store: Store<MensajeState>,
        private _text: TextService
    ) {

        this._mensaje.current$.pipe(
            map<IntentModel, FraseEntrenamiento[]>(mensaje => mensaje ? mensaje.trainingPhrases : []),
            debounceTime(1000), first()
        ).subscribe(frases => {
            if (!frases) frases = []
            frases.forEach(frase => {
                // this.store.dispatch(actions.addFrase({frase}))
            })
        })

    }





    // async mensajesCollection() {
    //   this.mensajesPath = await this._agente.getPath( `mensajes` )
    //   const mensajesRef = this.fs.collection( this.mensajesPath ).ref
    //   return mensajesRef
    // }


    // CREATE Frses de entrenamiento
    async addTraningPhrase(frase: FraseEntrenamiento) {
        try {

            this.frasesList = this._mensaje.current.trainingPhrases
            // frase.name = Math.random().toString( 36 ).substring( 7 );

            if (this._mensaje.current.trainingPhrases.length > 0) {
                // console.log('update');
                this._mensaje.current.trainingPhrases.push(frase)

            } else {
                // console.log('create');
                this._mensaje.current.trainingPhrases = [frase]
            }


            this.store.dispatch(actions.setUnsaved())

            return

        } catch (error) {
            console.error(error);
        }
    }






    // UPDATE 
    async updatePhrase(frase: FraseEntrenamiento, index) {
        try {
            var frasesList = this._mensaje.current.trainingPhrases
            
            frasesList[index] = frase;
            
            this._mensaje.current.trainingPhrases = frasesList
            console.log(this._mensaje.current.trainingPhrases);
            return this.store.dispatch(actions.setUnsaved())

        } catch (error) {
            console.error(error);
            this.alert.sendError('Error', error)
        }
    }

    /**
     * Retorna la frase completa con acotaciones para definir entidades y parámetros.
     * `;text;`: [texto entre dos punto y coma] parte seleccionada
     * `~` = divide la entidad del parámetro con su valor
     * `=` = divide el parámetro de su valor
     * @example "text ;entityTypeDisplayName=paramValue; text"
     */
    stringifyFullPhrase(phrase: FraseEntrenamiento): string {
        let partsString: string[] = []
        phrase.parts.forEach(part => {
            if (!part.alias) part.alias = '';
            partsString.push(part.entityType ?
                `;${part.entityType}~${part.alias}=${part.text};` : part.text);

        })
        return partsString.join('')
    }


    /** Retorna la frase completa en un string sin acotaciones */
    stringCleanPhrase(phrase: FraseEntrenamiento): string {
        let partsString: string[] = []
        phrase.parts.forEach(part => {
            partsString.push(part.text)
        })
        return partsString.join('')
    }

    /** * Retornas las partes de una frase que no tienen entidad o no están seleccionadas en un string limpio */
    stringifyUnselectParts(phrase: FraseEntrenamiento): string {
        let partialString: string[] = []
        phrase.parts.forEach(part => {
            if (!part.alias) {
                partialString.push(part.text)
            }
        })
        return partialString.join('')
    }



    /** Returns a part of a string with the manual format. */
    createParts(frase: string): FraseParte[] {
        const fraseInParts = frase.split(';')
        var partes: FraseParte[] = []

        // console.log(fraseInParts);

        if (fraseInParts.length > 1) {
            fraseInParts.forEach((part) => {
                if (part) {

                    let partSplited = part.split('~')
                    if (partSplited.length > 1) {
                        let param = partSplited[1].split('=')
                        partes.push({
                            entityType: `@${partSplited[0]}`,
                            text: param.length > 1 ? param[1] : param[0],
                            alias: param.length > 1 ? param[0] : '',
                        })
                    } else if (partSplited) {
                        partes.push({
                            text: partSplited[0],
                        })
                    }
                }

            })
        } else {
            partes.push({
                text: frase,
            })
        }

        // console.log(partes);

        return partes
    }



    /** Returns parts after find the part that includes the text selected and split it */
    async stractSelectedPart(
        frase: FraseEntrenamiento, textSelected: string
    ): Promise<FraseEntrenamiento> {

        try {

            // * Convertimos las partes en map para conservar el orden
            let initialParts: Map<number, FraseParte> = new Map()
            frase.parts.forEach((parte, i) => {initialParts.set(i, parte)})
            console.log(initialParts);

            // * Buscamos en las partes, el texto seleccionado
            let partSelected: [number, FraseParte];
            initialParts.forEach((p, i) => {
                if (p.text.includes(textSelected)) {partSelected = [i, p]}
            });
            console.log(partSelected);

            // * Dividimos la parte encontrada en nuevas partes
            let newParts: Map<number, FraseParte> = await this.getTextSelectInPart(partSelected[1].text, textSelected)
            console.log(newParts);


            // * Sustituimos la parte eliminada 
            let resultParts: Map<number, FraseParte> = new Map()
            initialParts.forEach((p, i) => {
                if (i < partSelected[0]) {
                    // console.log('before part selected ',i);
                    resultParts.set(i, p)
                } else if (i == partSelected[0]) {
                    // Define nuevos valores para las nuevas partes donde la parte seleccionada se sustituye por el nuevo mapa, basado en el index de la parte seleccionada y sumando el index de la parte nueva. Así si la parte seleccionada es 1 la primera nueva parte será 1+0=1, y sus consecuententes 1+1=2; 1+2=3...
                    newParts.forEach((nP, nI) => {
                        // console.log( 'on part selected ', partSelected[ 0 ] + nI );
                        resultParts.set(partSelected[0] + nI, nP)
                    })
                } else {
                    // Continua con la asignación de orden a partir de la longitud de la propiedad asignando uno a uno como el último
                    // console.log( 'after part selected ', resultParts.size);
                    resultParts.set(resultParts.size, p)
                }

            })

            console.log( resultParts );
            frase.parts = []
            await this.loading.asyncForEach(resultParts, parte => {
                return frase.parts.push(parte)
            })
            // console.log(frase);
            return frase


        } catch (error) {
            console.error(error);
            this.alert.sendMessageAlert('No se encontró el texto que seleccionaste. Intenta borrar la selección previa e intenta de nuevo')
        }
    }


    /** Returna un nuevo mapa de partes de frase de entrenamiento, separando un texto seleccionado */
    public async getTextSelectInPart(textOnSearch: string, textSelected: string)
        : Promise<Map<number, FraseParte>> {

        var parts: Map<number, FraseParte> = new Map()
        var textReplaced: string, partInParts: string[] = []

        textReplaced = textOnSearch.replace(textSelected, `:${textSelected}:`)
        partInParts = textReplaced.split(':')

        partInParts.forEach((textPart, i) => {
            if (textPart) {
                let newPart: FraseParte = { 
                    text: textPart,
                }

                if(textPart == textSelected ) newPart.alias = true
                parts.set(i, newPart)
            }
        })

        return parts
    }



    // DELETE
    async deletePhrase(frase: FraseEntrenamiento) {
        try {
            const mensaje = this._mensaje.current
            const frasesList = mensaje.trainingPhrases
            const phraseToDel = frasesList.findIndex(phrase => phrase.name === frase.name)
            frasesList.splice(phraseToDel, 1);

            this._mensaje.current.trainingPhrases = frasesList
            return this.store.dispatch(actions.setUnsaved())

        } catch (error) {
            console.error(error)
            this.alert.sendError('Error', error)
        }
    }

}
