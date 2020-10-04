export class RespuestaModel {
    constructor(
        public tipo: 'predefinida' | 'condicional' | 'grupo_datos' | 'buscar' | '',
        public nextIntent: string,
        public inputContext: string,
        public outputContext: string,
        public outputMessage: FormPredefinida | FormCondicional | FormRegistroDatos | FormBuscar ,
        public index: number,
        public accion?:string,
        public id?: string,
    ) {}
}

export class FormPredefinida {
    constructor (
        public estiloRespuesta: 'texto' | 'sugerencias' | 'card' | RespuestaBinaria,
        public respuesta: string | RespuestaSugerencias | RespuestaCard 
    ){}
}
export class FormCondicional {
    constructor (
        public estiloRespuesta: 'texto' | 'sugerencias' | 'card' | RespuestaBinaria,
        public respuesta: string | RespuestaSugerencias | RespuestaCard ,
        public parametro: string,
        public condicion: string,
        public valor: string | number | any[]
    ){}
}

export class FormRegistroDatos {
    constructor (
        public estiloRespuesta: 'texto' | 'sugerencias' | 'card' | RespuestaBinaria,
        public respuesta: string | RespuestaSugerencias | RespuestaCard ,
        public parametro: string,
        public grupoDatos: string,
        public key: string
    ){}
}

export class FormBuscar {
    constructor (
        public estiloRespuesta: 'texto' | 'sugerencias' | 'card' | RespuestaBinaria,
        public respuesta: string | RespuestaSugerencias | RespuestaCard ,
        public parametro: string,
        public rutaDB: string
    ){}
}

export interface RespuestaBinaria {
    respuestaYES: string | RespuestaSugerencias | RespuestaCard 
    respuestaNO: string | RespuestaSugerencias | RespuestaCard 
}

export interface RespuestaSugerencias {
    mensaje:string
    sugerencias: string[]
}

export interface RespuestaCard {
    body: string,
    titulo: string,
    imagenURL?: string,
    botones?: RespuestaCardButton[] }
    export interface RespuestaCardButton {
        text: string,
        link: string
    }
    

