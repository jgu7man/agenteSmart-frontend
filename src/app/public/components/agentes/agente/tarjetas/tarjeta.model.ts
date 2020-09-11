import { RespuestaCard, RespuestaCardButton } from './../mensajes/mensaje/entrenamiento/respuestas/respuesta.model';
export class TarjetaModel {
    constructor (
        public tipoContenido: 'estatico' | 'coleccion' | 'producto' | 'servicio',
        public contenido?: RespuestaCard | string,
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
