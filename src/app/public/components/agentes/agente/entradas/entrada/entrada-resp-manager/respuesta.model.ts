export interface RespuestaModel {
    tipo: 'fija' | 'condicional' | 'grupo_datos' | 'buscar' | 'binaria' | ''
    nextIntent: string,
    nextContext: string,
    estiloRespuesta: 'texto' | RespuestaSugerencias | RespuestaCard | RespuestaBinaria
    form?: FormFija | FormCondicional | FormRegistroDatos | FormBuscar 
    id?: string
}

export interface FormFija {
    mensaje: string,
}
export interface FormCondicional {
    mensaje: string,
    paramaetro: string,
    condicion: string,
    valor: string | number | any[]
}

export interface FormRegistroDatos {
    mensaje: string,
    parametro: string,
    grupoDatos: string
}

export interface FormBuscar {
    mensaje: string,
    parametro: string,
    rutaDB: string
}

export interface RespuestaBinaria {
    mensajeYES: string,
    mensajeNO: string
}

export interface RespuestaSugerencias {
    mensaje: string,
    sugerencias: string[]
}

export interface RespuestaCard {
    mensaje: string,
    titulo: string,
    imagenURL: string,
    botones: RespuestaCardButton[] }
    export interface RespuestaCardButton {
        text: string,
        link: string
    }
    

