import { MensajeModel, IntentModel } from '../../mensaje.model';


export interface MensajeState {
    mensaje: IntentModel,
    contexto?: string
    indexContexto?: number
}