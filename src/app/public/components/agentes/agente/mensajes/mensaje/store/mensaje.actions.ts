import { createAction, props } from "@ngrx/store";
import { MensajeModel, IntentModel } from '../../mensaje.model';

export const getData = createAction(
    '[Mensaje] getData',
    props<IntentModel>()
);
export const resetData = createAction(
    '[Mensaje] resetData',
)

export const saveData = createAction(
    '[Mensaje] saveData',
    props<IntentModel>()
)