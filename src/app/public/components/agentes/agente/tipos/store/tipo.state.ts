import { iEntityType, TipoEntidadModel } from '../tipo.model';

export class TipoState {
    saved: boolean
    selected: boolean
    body: iEntityType
    name: string
     constructor( body: iEntityType ) {
         this.saved = true
         this.body = body
         this.name = body.name
         this.selected = false
     }
 }
