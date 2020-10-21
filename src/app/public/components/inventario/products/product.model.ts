import { Clase } from '../../agentes/agente/tipos/tipo.model';
export class GdevStoreProductModel {
    constructor (
        public referencia?: string,
        public precio?: number,
        public onStock?: boolean,
        public stockCant?: any,
        public imagenUrl?: any,
        public descripcion?: string,
        public categorias?: string[],
        public galeria?: any[],
        public detalles?: ProdDetalle[],
        public sinonimos?: string[],
        public id?: string,
    ) { }
}



export interface ProdDetalle {
    detailName: string,
    detailValue: any
}