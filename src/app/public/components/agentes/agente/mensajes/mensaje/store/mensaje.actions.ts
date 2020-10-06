import { createAction, props } from "@ngrx/store";
import { MensajeModel, IntentModel } from '../../mensaje.model';

export const getData = createAction(
    '[Mensaje] getData',
    props<IntentModel>()
);
export const getOutMensaje = createAction(
    '[Mensaje] resetData',
)

export const changeData = createAction(
    '[Mensaje] changeData',
    props<IntentModel>()
)