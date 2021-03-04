import { AlertService } from 'src/app/gdev-tools/alerts/alert.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import {
    RespuestaModel,
    SimpleModel,
    ResultResponse,
} from '../respuesta.model';
import { RespuestasService } from '../respuestas.service';
import { Loading } from 'src/app/gdev-tools/loading/loading.service';
import { CacheService } from '../../../../../../../../../gdev-tools/cache/cache.service';
import { ContextosService } from '../../../../../contextos/contextos.service';
import { ContextoModel } from '../../../../../contextos/contexto.model';
import { MensajeModel } from '../../../../mensaje.model';
import { MatDialog } from '@angular/material/dialog';
import { AddContextoDialogComponent } from '../../../../../contextos/add-contexto-dialog/add-contexto-dialog.component';
import { CurrentMensajeService } from '../../../current-mensaje.service';
import { ContextSelected } from '../../../../../contextos/contexto-selector/contexto-selector.component';

@Component({
    selector: 'aSmart-respuesta-card',
    templateUrl: './respuesta-card.component.html',
    styleUrls: ['./respuesta-card.component.scss'],
})
export class RespuestaCardComponent implements OnInit {
    /** Resive la data de la respuesta desde el arreglo padre */
    @Input() respuesta: RespuestaModel;
    /** Activa la visa para elegir acciones */
    activateAccion: boolean;
    /** Activa la opción de editar la respuesta */
    switchEditResp: boolean;
    /** Obtiene el tipo de respuesta seleccionado y da estilo a la vista */
    selectedRes: TipoRespuesta;
    /** El mensaje de salida */
    public result: ResultResponse;
    /** Almacena el contexto y permite que se muestre la lista de contextos */
    public currentContext: string;
    /** Almacena la lista de contextos del cache */
    public contextLists: any;
    public contextNameList: string[];
    public nuevoContexto: ContextoModel;
    public nextMensajesList: MensajeModel[];
    public sugerenciasActivated: boolean = false
    /** Notifica al componente padre que se ha borrado una respuesta */
    @Output() onDelete: EventEmitter<string> = new EventEmitter();

    constructor(
        public respuestas_: RespuestasService,
        private _alerts: AlertService,
        private loading: Loading,
        private _cache: CacheService,
        public contextos_: ContextosService,
        private _dialog: MatDialog,
        private _mensaje: CurrentMensajeService
    ) {
        this.result = new SimpleModel('');

        this.currentContext = this._cache.getDataKey<string>('currentContexto');
        this.respuesta = new RespuestaModel('simple', this.result, 0, '*fin');
    }

    async ngOnInit() {
        this.nextMensajesList = await this._cache.getAsyncKey<MensajeModel[]>(
            'nextMensajes'
        );
        this.contextLists = await this._cache.getDataKey<any>('contextosLists')
        this.respuestas_.getDataForRespuestas();
        if (this.respuesta.result['suggestions']) {
            if (this.respuesta.result['suggestions'].length)
                this.sugerenciasActivated = true
        }
        this.selectedRes = this.tiposRes.find(
            (tipo) => tipo.name == this.respuesta.tipo
        );
    }



    get activeContextSelector() {
        if ( this.respuesta.tipo == 'simple' ) {
            return true;
        } else if (!this.currentContext) {
            return false;
        }
    }

    get activeIntentSelector() {
        if (this.respuesta.tipo == 'simple') {
            return false;
        } else if (this.respuesta.tipo == 'sugerencias') {
            return false;
        } else if (!this.currentContext) {
            return false
        } else {
            return true;
        }
    }

    async catchContextSelected(selected: ContextSelected) {
        this.setContextSelected(selected.context);
        // console.log(continueIntents);
        // if (continueIntents.length > 0) {
        //     this.nextMensajesList = continueIntents
        // } else {
        //     this.nextMensajesList
        //         = await this._cache.getAsyncKey<MensajeModel[]>('nextMensajes');
        // }
    }

    setContextSelected(contextName?: string) {
        if (contextName) {
            this.respuesta.outputContext = contextName;
            // if (this.nextMensajesList && this.nextMensajesList.length > 0)
            //     this.respuesta.nextIntent = this.nextMensajesList[0].displayName;
        } else {
            // this.respuesta.nextIntent = '*fin';
            this.respuesta.outputContext = '';
        }
        return this.respuesta;
    }

    disableEScondition() {

        if (
            this.respuesta.result[ 'condicion' ] == 'no existe'
            || this.respuesta.result[ 'condicion' ] == 'existe'
        ) {
            return true
        }
    }

    async setNextContext(nextIntent: string) {
        var nextMensaje: MensajeModel
        var lists = Object.keys(this.contextLists)
        console.log(nextIntent);
        await this.loading.asyncForEach(lists, async (contextName) => {
            console.log(this.contextLists[contextName]);
            let mensajeFinded = this.contextLists[contextName].find(
                intent => intent.displayName == nextIntent
            )
            if(mensajeFinded) nextMensaje = mensajeFinded
            console.log(nextMensaje);
        })
        return nextMensaje.contexto
    }

    /**
     * Obtiene el tipo de respuesta seleccionado del select
     * @param {MatSelectChange} tipoSelected - Contiene la propidad valor que es de tipo `TipoEntityType.name`
     */
    onTipoSelected(tipoSelected: MatSelectChange) {
        let simpleStored = this._mensaje.respuestasList.map(
            (r) => r.tipo == 'simple'
        );
        if (tipoSelected.value == 'simple' && simpleStored.length > 1) {
            console.log(this._mensaje.respuestasList, tipoSelected.value);
            this._alerts.sendMessageAlert(
                'No puedes agregar más de una respuesta simple'
            );
        } else {
            this.selectedRes = this.tiposRes.find( t => t.name == tipoSelected.value)
            this.respuesta.tipo = this.selectedRes.name;
        }
    }

    /** Recibe los cambios en los formularios hijos como simple, CODICIONAL, BUSCAR Y GRUPO DE DATOS */
    catchResult(msg: any) {
        console.log(this.result, msg);
        this.result = msg;
    }

    /**
     * Valida la respuesta que se ha de guardar en FIRESTORE
     *
     * @param {RespuestaModel} respuestaObj Objeto de respuesta modelado como RespuestaModel
     * @returns {RespuestaModel} Respuesta como objeto sin tipo declarado
     */
    async validateRespuesta(respuestaObj: RespuestaModel) {
        if (!this.currentContext) {
            // respuestaObj = this.setContextSelected(respuestaObj.outputContext);
            respuestaObj.outputContext
                = await this.setNextContext(respuestaObj.nextIntent)
        } else { }

        let respuestaClean,
            output = {};
        output = { ...respuestaObj.result, ...this.result };
        let respuesta = output['text'];


        if (!respuesta) {
            if (respuestaObj.tipo != 'buscar') {
                this._alerts.sendMessageAlert(
                    'Agrega al menos un mensaje de texto'
                );
            }
        } else if (output['suggestions'].length == 1) {
            this._alerts.sendMessageAlert(
                'Agrega 2 o más sugerencias o desactiva las sugerencias'
            );
        } else {
            var respuestaKeys = Object.keys(respuestaObj);
            await this.loading.asyncForEach(respuestaKeys, (key) => {
                if (respuestaObj[key] === undefined) delete respuestaObj[key];
                return;
            });

            respuestaClean = { ...respuestaObj };
            respuestaClean['result'] = output;

            return respuestaClean;
        }
    }

    /**
     * Valida y envía la respuesta a guardarse en el servicio de respuestas y prepara nuevamente las variables para una respuesta nueva
     *
     */
    async onSave() {
        console.log(this.respuesta.nextIntent);
        this.respuesta.outputContext
        let cleanRespuesta = await this.validateRespuesta(this.respuesta);
        if (!cleanRespuesta['nextIntent']) {
            cleanRespuesta['nextIntent'] = '*sug'
        }
        console.log(cleanRespuesta['nextIntent']);
        this.switchEditResp = false;

        if (cleanRespuesta) this.respuestas_.setRespuesta(cleanRespuesta);
        this.respuesta.tipo = undefined;
        this.respuesta.result = new SimpleModel('');
    }

    /** Lista de tipo de respuestas con sus respectivos estilos */
    tiposRes: TipoRespuesta[] = [
        { display: '', name: undefined, color: 'grey', icono: 'fa-plus' },
        {
            display: 'Simple',
            name: 'simple',
            color: '#935cff',
            icono: 'fa-comment-alt',
        },
        {
            display: 'Condicional',
            name: 'condicional',
            color: '#42cbff',
            icono: 'fa-code-branch',
        },
        {
            display: 'Grupo de datos',
            name: 'grupo_datos',
            color: '#26a69a',
            icono: 'fa-clipboard-list',
        },
        {
            display: 'Buscar',
            name: 'buscar',
            color: '#eadb51',
            icono: 'fa-search',
        },
        // {
        //     display: 'Sugerencias',
        //     name: 'sugerencias',
        //     color: '#f44336',
        //     icono: 'fa-list-ul',
        // },
    ];
}

export interface TipoRespuesta {
    display: string;
    name: 'simple' | 'condicional' | 'grupo_datos' | 'buscar'  | 'sugerencias' ;
    color: string;
    icono: string;
}
