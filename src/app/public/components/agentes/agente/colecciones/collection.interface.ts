export class ColeccionModel {
    constructor (
        public name: string,
        public tipo: 'guardado' | 'busqueda' | '',
        public queryData?: ColeccionDato[],
        public dataGetted?: any[]
    ){}
}

export interface ColeccionDato {
    identificador: string,
    valor: string
}