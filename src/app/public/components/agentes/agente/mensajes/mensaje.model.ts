import { Contexto } from '../contextos/contexto.model';
import { RespuestaMensaje } from '../respuestas/respuestasIntent.model';

export interface IntentModel {
    index: number,
    name: string,
    displayName: string,
    webhookState: 'WEBHOOK_STATE_ENABLED_FOR_SLOT_FILLING',
    trainingPhrases?: FraseEntrenamiento[],
    contextos?:string[]
    inputContextNames?: string[],
    events?: string[],
    action?: string,
    outputContexts?: Contexto[],
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
