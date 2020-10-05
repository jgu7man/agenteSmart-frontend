import { MensajeModel } from '../../mensaje.model';


export interface MensajeState {
    mensaje: MensajeModel,
    contexto?: string
    indexContexto?: number
}