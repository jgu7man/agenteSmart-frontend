import { TipoEntidadModel } from '../tipo.model';

export class TipoState {
    saved: boolean
    selected: boolean
    body: TipoEntidadModel
    name: string
     constructor( body: TipoEntidadModel ) {
         this.saved = true
         this.body = body
         this.name = body.name
         this.selected = false
     }
 }