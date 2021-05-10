import { iEntity } from '../../agentes/agente/tipos/tipo.model';
export class GdevStoreProductModel {
    constructor (
        public referencia?: string,
        public precio?: number,
        public onStock?: boolean,
        public stockCant?: any,
        public descripcion?: string,
        public categorias?: string[],
        public sinonimos?: string[],
        public imagenUrl?: any,
        public galeria?: any[],
        public detalles?: ProdDetalle[],
        public id?: string,
    ) { }
}



export interface ProdDetalle {
    detailName: string,
    detailValue: any
}
