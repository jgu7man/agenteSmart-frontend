export interface RespuestaModel {
    tipo: 'directa' | 'condicional' | 'grupo_datos' | 'buscar' | ''
    nextIntent: string,
    nextContext: string,
    estiloRespuesta: 'texto' | 'sugerencia' | 'card' | RespuestaBinaria
    form?: FormDirecta | FormCondicional | FormRegistroDatos | FormBuscar 
    accion?:string
    id?: string
}

export interface FormDirecta {
    respuesta: string | RespuestaSugerencias | RespuestaCard 
}
export interface FormCondicional {
    respuesta: string | RespuestaSugerencias | RespuestaCard 
    paramaetro: string,
    condicion: string,
    valor: string | number | any[]
}

export interface FormRegistroDatos {
    respuesta: string | RespuestaSugerencias | RespuestaCard 
    parametro: string,
    grupoDatos: string
}

export interface FormBuscar {
    respuesta: string | RespuestaSugerencias | RespuestaCard 
    parametro: string,
    rutaDB: string
}

export interface RespuestaBinaria {
    respuestaYES: string | RespuestaSugerencias | RespuestaCard 
    respuestaNO: string | RespuestaSugerencias | RespuestaCard 
}

export interface RespuestaSugerencias {
    respuesta: string,
    sugerencias: string[]
}

export interface RespuestaCard {
    body: string,
    titulo: string,
    imagenURL: string,
    botones: RespuestaCardButton[] }
    export interface RespuestaCardButton {
        text: string,
        link: string
    }
    

