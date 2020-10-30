
export class ColeccionModel {
    constructor (
        public name: string,
        public tipo: 'guardado' | 'busqueda' | '',
        public queryData?: ColeccionDato[],
        public saveKeys?: ParamExpected[],
        public dataGetted?: any[]
    ){}
}

export interface ColeccionDato {
    identificador: string,
    body: string,
    titulo?: string,
    imagenURL?: string,
    enlace?: string
}

export interface ParamExpected {
    param: string
}