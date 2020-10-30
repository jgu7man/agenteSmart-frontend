import { ColeccionModel } from '../colecciones/collection.interface';
import { RespuestaCard, RespuestaCardButton } from '../agentes/agente/mensajes/mensaje/entrenamiento/respuestas/respuesta.model';
export class TarjetaModel {
    constructor (
        public name: string,
        public tipoContenido?: 'estatico' | 'coleccion' | 'producto' | 'servicio',
        public contenido?: RespuestaCard | string | ColeccionModel,
        public botones?: RespuestaCardButton[]
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
