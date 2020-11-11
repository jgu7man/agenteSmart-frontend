import { AlertService } from 'src/app/Gdev-Tools/alerts/alert.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import {
    RespuestaModel,
    PredefinidaModel,
    OutputMessage,
} from '../respuesta.model';
import { RespuestasService } from '../respuestas.service';
import { Loading } from 'src/app/Gdev-Tools/loading/loading.service';

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
    public outputMessage: OutputMessage;

    @Output() onDelete: EventEmitter<string> = new EventEmitter();

    constructor(
        public respuestas_: RespuestasService,
        private _alerts: AlertService,
        private loading: Loading
    ) {
        this.outputMessage = new PredefinidaModel('texto', '');

        this.respuesta = new RespuestaModel(
            'predefinida',
            this.outputMessage,
            0,
            '*fin'
        );
    }

    ngOnInit(): void {
        this.respuestas_.getDataForRespuestas();
        this.selectedRes = this.tiposRes.find(
            (tipo) => tipo.name == this.respuesta.tipo
        );
    }

    /**
     * Obtiene el tipo de respuesta seleccionado del select
     * @param {MatSelectChange} tipoSelected - Contiene la propidad valor que es de tipo `TipoEntityType.name`
     */
    onTipoSelected(tipoSelected: MatSelectChange) {
        this.selectedRes = this.tiposRes.find(
            (tipo) => tipo.name == tipoSelected.value
        );
        this.respuesta.tipo = tipoSelected.value;
    }

    /** Recibe los cambios en los formularios hijos como PREDEFINIDA, CODICIONAL, BUSCAR Y GRUPO DE DATOS */
    catchOutputMessage(msg: any) {
        // console.log(this.outputMessage, msg);
        this.outputMessage = msg;
    }

    /**
     * Valida la respuesta que se ha de guardar en FIRESTORE
     *
     * @param {RespuestaModel} respuestaObj Objeto de respuesta modelado como RespuestaModel
     * @returns {RespuestaModel} Respuesta como objeto sin tipo declarado
     */
    async validateRespuesta(respuestaObj: RespuestaModel) {
        let respuestaClean,
            output = {};
        output = { ...respuestaObj.outputMessage, ...this.outputMessage };
        let respuesta = output['respuesta'];
        let respEstilo = respuestaObj.outputMessage.estiloRespuesta;

        if (!respuesta) {
            this._alerts.sendMessageAlert(
                'Agrega al menos un mensaje de texto'
            );
        } else if (
            respEstilo == 'sugerencias' &&
            output['respuesta']['sugerencias'].length < 1
        ) {
            this._alerts.sendMessageAlert(
                'Al menos agrega un par de sugerencias o tal vez mejor quieras utilizar el estilo de respuesta TEXTO'
            );
        } else {
            var respuestaKeys = Object.keys(respuestaObj);
            await this.loading.asyncForEach(respuestaKeys, (key) => {
                if (respuestaObj[key] === undefined) delete respuestaObj[key];
                return;
            });

            respuestaClean = { ...respuestaObj };
            respuestaClean['outputMessage'] = output;

            return respuestaClean;
        }
    }

    /**
     * Valida y envía la respuesta a guardarse en el servicio de respuestas y prepara nuevamente las variables para una respuesta nueva
     *
     */
    async onSave() {
        let cleanRespuesta = await this.validateRespuesta(this.respuesta);
        this.switchEditResp = false;
        this.respuestas_.setRespuesta(cleanRespuesta);
        this.respuesta.tipo = undefined;
        this.respuesta.outputMessage = new PredefinidaModel('texto', '');
    }

    /** Lista de tipo de respuestas con sus respectivos estilos */
    tiposRes: TipoRespuesta[] = [
        { display: '', name: undefined, color: 'grey', icono: 'fa-plus' },
        {
            display: 'Predefinida',
            name: 'predefinida',
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
    ];
}

export interface TipoRespuesta {
    display: string;
    name: 'predefinida' | 'condicional' | 'grupo_datos' | 'buscar' | '';
    color: string;
    icono: string;
}
