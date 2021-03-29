import { AlertService } from 'src/app/gdev-tools/alerts/alert.service';
import { Injectable } from '@angular/core';
import { IntentModel, ParametroMensaje } from '../../../mensaje.model';
import { AccionModel } from '../../../../acciones/accion.model';
import { CurrentMensajeService } from '../../current-mensaje.service';
import { CacheService } from 'src/app/gdev-tools/cache/cache.service';
import { Loading } from 'src/app/gdev-tools/loading/loading.service';
import { CurrentAgenteService } from '../../../../current-agente.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { RespuestaModel } from './respuesta.model';
import { Subject } from 'rxjs';
import { TiposService } from '../../../../tipos/tipos.service';
import { SystemEntitieModel, TipoEntidadModel } from '../../../../tipos/tipo.model';
import { TarjetaModel } from '../../../../../../tarjetas/tarjeta.model';
import { pluck, map } from 'rxjs/operators';



@Injectable({
    providedIn: 'root',
})
export class RespuestasService {
    /** @module Respuestas */


    tarjetasList: TarjetaModel[];
    /** El mensae en curso de edición */
    currentMensaje: IntentModel;
    /** El id de mensaje en curso para consultas */
    currentMensajeName: string;
    /** El siguiente mensaje en el contexto actual
     * @name nextMensaje
     */
    nextMensaje: string;
    /** El contexto actual */
    currentContext: string;
    /** Contiene la lista de parámetros */
    paramList: ParametroMensaje[];
    /** La ruta a la base de datos de los mensajes */
    mensajesPath: string;
    /** Observable de la lista de respuestas */
    respuestasList: RespuestaModel[];
    /** Observable de las respuestas cuando se agregó, editó o eliminó alguna respuesta */
    onRespuestasChanged: Subject<any> = new Subject();
    /** Contiene la lista de tipos de datos */
    mensajeTypeEntities: (TipoEntidadModel | SystemEntitieModel)[];
    /** Contiene el tipo de acciones */
    acciones: AccionModel[] = [
        { accion: 'guardar', ruta: '' },
        { accion: 'editar', ruta: '' },
        { accion: 'buscar', ruta: '' },
        { accion: 'borrar', ruta: '' },
    ];
    /** Lista de tipos de respuesta
     * @variation `texto` para respuestas de sólo texto.
     * @variation `sugerencias` para crear un arreglo de sugerencias
     * @variation `card` para usar una tarjeta de imagen, texto, título y botones
     * @type {EstiloResp[]}
     * @memberof RespuestasService
     */
    estiloResps: EstiloResp[] = [
        { name: 'texto', display: 'Texto' },
        { name: 'sugerencias', display: 'Sugerencias' },
        // { name: 'card', display: 'Tarjeta' },
    ];

    constructor(
        private fs: AngularFirestore,
        private _agente: CurrentAgenteService,
        private _mensaje: CurrentMensajeService,
        private _cache: CacheService,
        private loading: Loading,
        private _alerts: AlertService,
        private _tipos: TiposService,
    ) {
        this.getDataForRespuestas();
    }

    /** Obtiene constante actualizado la ruta del mensaje en curso para los métodos del CRUD
     * @returns {string} Referencia de la colección de mensajes en firestore
     */
    async responsesPath() {
        this.loading.waitFor(100);
        let mensajeName = this._mensaje.current.name;
        let mensajeRef = (await this._mensaje.mensajesCollection()).doc(
            mensajeName
        );
        const respuestasRef = await mensajeRef.collection('respuestas');
        return respuestasRef;
    }

    /** Obtiene la data del mensaje en curso */
    async getDataForRespuestas() {

        this.currentContext = await this._cache
            .getAsyncKey<string>('currentContexto', 1);
        // console.log(this.currentContext);
        this.currentMensaje = await this._cache
            .getAsyncKey < IntentModel >('currentIntent', 2)
        // console.log(this.currentMensaje);
        this._cache.listenForChanges<IntentModel>('currentIntent')
            .subscribe((mensaje) => {
                if (mensaje) {
                    // console.log(mensaje);
                    this.currentMensaje = mensaje;
                    this._cache.listenForChanges<IntentModel>('currentIntent')
                        .pipe(
                            map<IntentModel, ParametroMensaje[]>
                                ( ( intent: IntentModel ) => intent
                                    ? intent.parameters : []
                            )
                        ).subscribe(list => this.paramList = list )
                    if ( this.currentMensaje )
                        this.getMensajeTipos( this.currentMensaje.parameters );
                }
            });

        return;
    }

    /** Obtiene los tipos de datos del mensaje actual
     * @return {array} Arreglo de los tipos de datos del mensaje actual
     */
    async getMensajeTipos(paramList: ParametroMensaje[]) {
        // console.log( paramList )
        this.mensajeTypeEntities  = [];

        await this.loading.asyncForEach(paramList,
        async (param: ParametroMensaje) => {

            if (this.mensajeTypeEntities.length > 0) {
                let tipoStored:TipoEntidadModel | SystemEntitieModel = this.mensajeTypeEntities.find(
                    (t) => t && t.displayName == param.displayName
                );

                if (!tipoStored) {
                    tipoStored = await this._tipos.getByDisplayName( param.entityTypeDisplayName )
                    await this.loading.waitFor(1200);
                    return this.mensajeTypeEntities.push(tipoStored);
                }
            }
            else {
                var tipoStored = await this._tipos.getByDisplayName( param.entityTypeDisplayName )
                await this.loading.waitFor(1200);
                return this.mensajeTypeEntities.push(tipoStored);
            }

            }
        );
        // console.log(this.mensajeTypeEntities);
        return this.mensajeTypeEntities;
    }

    /**
     * Agrega o actualiza respuestas al mensaje en curso en FIRESTORE
     *
     * @param {RespuestaModel} respuesta - El objeto de respuesta
     * @return {Subject} Aviso al observable de cambios en la lista de respuestas
     */
    async setRespuesta(respuesta: RespuestaModel) {


        if (respuesta.id) {
            console.log('update');

            for (let [key, value] of Object.entries(respuesta)) {
                if(key === undefined) delete respuesta[key];
            }

            (await this.responsesPath())
                .doc(respuesta.id)
                .set(respuesta, { merge: true });
            this._alerts.sendFloatNotification('Respuesta actualizada');
        }


        else {
            console.log('create');



            if (    respuesta.tipo != 'condicional'
                &&  await this.checkKindResponses(respuesta.tipo) > 1) {

                this._alerts.sendMessageAlert('No puedes agregar más de una respuesta de tipo '+respuesta.tipo);

            }

            else {

                console.log( respuesta )
                // Object.keys(respuesta).forEach(key => { if (respuesta[key] == undefined) delete respuesta[key]})
                // Object.keys(respuesta.result).forEach(key => { if (respuesta.result[key] == undefined) delete respuesta.result[key]})
                for (let [key, value] of Object.entries(respuesta)) {
                    console.log( respuesta[key] );
                    if(respuesta[key] === undefined) delete respuesta[key];
                }
                let result = respuesta.result
                for (let [key, value] of Object.entries(result)) {
                    console.log( result[key] );
                    if(result[key] === undefined) delete result[key];
                }
                respuesta.result = result;

                let res = await (await this.responsesPath()).add(respuesta);
                await (await this.responsesPath())
                    .doc(res.id)
                    .update({ id: res.id });
            }
        }

        return this.onRespuestasChanged.next(true);
    }



    /**
     * Revisa si existe alguna respuesta del tipo seleccionado
     *
     * @param {('simple' | 'grupo_datos' | 'buscar')} kind Tipo de respuesta. Puede ser 'simple' | 'grupo_datos' | 'buscar'
     * @return {number} Cantidad de veces que existe el tipo de respuesta
     */
    async checkKindResponses(
        kind: 'simple' | 'grupo_datos' | 'buscar' | 'sugerencias'
    ) {

        var resCant: boolean[] = []
        await this.loading.asyncForEach(this._mensaje.respuestasList,
            (res: RespuestaModel) => {
                if (res.tipo == kind) resCant.push(true)
            });
        return resCant.length
    }

    /**
     * Elimina la respuesta seleccionada
     *
     * @param {string} respuestaId - El id de la respuesta a borrar
     * @return {Subject} Aviso al observable de cambios en la lista de respuestas
     */
    async delRespuesta(respuestaId: string) {
        try {

            await (await this.responsesPath()).doc(respuestaId).delete();

            return this.onRespuestasChanged.next(true);

        } catch (error) {
            console.error(error)
            this._alerts.sendMessageAlert('No se pudo eliminar')
        }
    }
}



/**
 * Interface para el arreglo de los estilos de respuestas
 *
 * @export
 * @interface EstiloResp
 */
export interface EstiloResp {
   name: string,
   display: string
}




