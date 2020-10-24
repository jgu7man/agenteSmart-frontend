import { createReducer, on } from '@ngrx/store';
import * as actions from './tipo.actions';
import { TipoState } from './tipo.state';



const tiposInitState: TipoState[] = []

const _tiposCRUD = createReducer( tiposInitState,
    on( actions.addTipo, ( state, { tipo } ) => [ ...state, new TipoState(tipo) ] ),
    on( actions.delTipo, ( state, { tipo } ) => state.filter( t => t.name === tipo.name ) ),
    
    on( actions.toggleSaved, ( state, { tipo } ) =>
        state.map( t => 
            t.name === tipo.name
                ? { ...t, saved: true }
                : t
        ) ),
    
    on( actions.editTipo, ( state, { tipo } ) =>
        state.map( t => 
            t.name === tipo.name
                ? { ...t, body: tipo, saved: false }
                : t
        ) ),
    on( actions.selectTipo, ( state, { tipo } ) => state.map( t => 
        t.name === tipo.name ? { ...t, selected: true} : t
    ) ),
    on( actions.unselect, state => state.map(t => {return {...t,  selected: false} } ) ),
    on( actions.getOut, () => [] ),
    
)

export function tiposReducer( state, action ) {
    return _tiposCRUD(state, action)
}