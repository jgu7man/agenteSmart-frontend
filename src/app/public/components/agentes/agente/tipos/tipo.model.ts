export class TipoEntidadModel {
    constructor (
        public name: string,
        public displayName: string,
        public kind: 'KIND_MAP' | 'KIND_LIST' | 'KIND_REGEXP',
        public autoExpansionMode: 'AUTO_EXPANSION_MODE_UNSPECIFIED' | 'AUTO_EXPANSION_MODE_DEFAULT',
        public entities: Clase[],
        public enableFuzzyExtraction: boolean
        
    ){}
}


export interface Clase {
    value: string,
    synonyms?: string[],
}