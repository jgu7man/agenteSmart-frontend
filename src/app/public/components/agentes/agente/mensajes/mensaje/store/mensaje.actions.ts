import { createAction, props } from "@ngrx/store";
import { IntentModel } from '../../mensaje.model';

export const getOutMensaje = createAction( '[mensaje] getOut' )
export const setUnsaved = createAction( '[mensaje] unsaved' )
export const setSaved = createAction( '[mensaje] saved' )