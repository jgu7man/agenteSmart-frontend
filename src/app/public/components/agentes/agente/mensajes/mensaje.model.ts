import { ContextoModel } from '../contextos/contexto.model';
import { RespuestaMensaje } from './mensaje/entrenamiento/respuestas/respuestasIntent.model';

export class MensajeModel {
    
    constructor (
        public intent?: IntentModel,
        public contexto?: string,
        public indexContexto?: number,
        public name?: string
    ) {
        this.contexto = ''
        this.indexContexto = 0
        this.name = intent ? intent.name : ''
    }
}

export interface IntentModel {
    index?: number,
    name?: string,
    displayName?: string,
    webhookState?: 'WEBHOOK_STATE_ENABLED_FOR_SLOT_FILLING',
    trainingPhrases?: FraseEntrenamiento[],
    contextos?:string[]
    inputContextNames?: string[],
    events?: string[],
    action?: string,
    outputContexts?: ContextoModel[],
    resetContexts?: boolean,
    parameters?: ParametroMensaje[],
    messages?: RespuestaMensaje[],
    defaultResponsePlatforms?: string[],
    rootFollowupIntentName?: string,
    parentFollowupIntentName?: string,
    followupIntentInfo?: IntentSeguimientoInfo[]

}


export interface FraseEntrenamiento {
    type: 'EXAMPLE',
    parts: FraseParte[],
    name?: string,}
    export interface FraseParte {
        text: string,
        entityType?: string,
        alias?: string,
        userDefined?: boolean,
        selected?: boolean,
        paramName?: string
    }

export interface ParametroMensaje {
    name?: string,
    displayName: string,
    mandatory?: boolean,
    value?: string,
    defaultValue?: string,
    isList?: boolean
    entityTypeDisplayName?: string,
    prompts?: string[],
}

export interface IntentSeguimientoInfo {
    followupIntentName: string,
    parentFollowupIntentName: string
}
