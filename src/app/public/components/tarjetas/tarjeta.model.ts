import { RespuestaCard, CardButton } from './../agentes/agente/mensajes/mensaje/entrenamiento/respuestas/respuestasIntent.model';
import { ColeccionModel } from '../colecciones/collection.interface';
// import { RespuestaCard, RespuestaCardButton } from '../agentes/agente/mensajes/mensaje/entrenamiento/respuestas/respuesta.model';

export class TarjetaModel {
    constructor (
        public name: string,
        public contenido?: RespuestaCard | string | ColeccionModel,
        public botones?: CardButton[],
        public id?: string
    ) {
        
    }
}

export interface tipoContenido {
    value: string;
    viewValue: string;
}

export interface tipoElemento {
    value: string;
    viewValue: string;
}
