import { createAction, props } from '@ngrx/store';
import { TipoState } from './tipo.state';
import { TipoEntidadModel } from '../tipo.model';


export const addTipo = createAction( '[ENTITY] add', props<{ tipo: TipoEntidadModel }>() )
export const editTipo = createAction( '[ENTITY] edit', props<{ tipo: TipoEntidadModel }>() )
export const delTipo = createAction( '[ENTITY] del', props<{ tipo: TipoEntidadModel }>() )
export const toggleSaved = createAction( '[ENTITY] toggle saved', props<{ tipo: TipoEntidadModel }>() )
export const getOut = createAction( '[ENTITY] get out' )
export const selectTipo = createAction( '[ENTITY] select tipo', props<{ tipo: TipoEntidadModel }>() )
export const unselect = createAction('[ENTITY] unselect')