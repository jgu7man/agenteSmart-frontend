import { GdevAlert } from 'src/app/gdev-tools/src/lib/alert/alert.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import {
    RespuestaModel,
    SimpleModel,
    ResultResponse,
} from '../respuesta.model';
import { RespuestasService } from '../respuestas.service';
import { GdevLoading } from 'src/app/gdev-tools/src/lib/loading/loading.service';
import { GdevCache } from '../../../../../../../../../gdev-tools/src/lib/cache/gdev-cache.service';
import { ContextosService } from '../../../../../contextos/contextos.service';
import { ContextoModel } from '../../../../../contextos/contexto.model';
import { IntentModel, MensajeModel } from '../../../../mensaje.model';
import { MatDialog } from '@angular/material/dialog';
import { AddContextoDialogComponent } from '../../../../../contextos/add-contexto-dialog/add-contexto-dialog.component';
import { CurrentMensajeService } from '../../../current-mensaje.service';
import { ContextSelected } from '../../../../../contextos/contexto-selector/contexto-selector.component';
import { AngularFireDatabase } from '@angular/fire/database';
import { AddMensajeComponent } from '../../../../add-mensaje/add-mensaje.component';

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

    switchAddIntent: boolean = false

    constructor(
        public respuestas_: RespuestasService,
        private _alerts: GdevAlert,
        private _loading: GdevLoading,
        private _cache: GdevCache,
        public contextos_: ContextosService,
        private _dialog: MatDialog,
        private _mensaje: CurrentMensajeService,
    ) {
        this.result = new SimpleModel('');

        this.currentContext = this._cache.getDataKey<string>('currentContexto');
        this.respuesta = new RespuestaModel('simple', this.result, 0, '*fin', []);

    }

    async ngOnInit() {
        this.contextLists = await this._cache.getDataKey<any>('contextosLists')

        await this.setNextIntents(this.currentContext)
        this.respuestas_.getDataForRespuestas();
        if (this.respuesta.result['suggestions']) {
            if (this.respuesta.result['suggestions'].length)
                this.sugerenciasActivated = true
        }
        this.selectedRes = this.tiposRes.find(
            (tipo) => tipo.name == this.respuesta.tipo
        );
    }

    async setNextIntents(currentContext?: string) {
        // console.log( this.contextLists )
        if (this.contextLists) {

            // Set first intent of every context
            this.nextMensajesList = []
            var lists = Object.keys(this.contextLists)
            await this._loading.asyncForEach(lists, async (contextName) => {
                var contextList: any[] = this.contextLists[contextName]
                if (contextList[0]) {
                    this.nextMensajesList.push(contextList[0])
                }
            })

            // Set intents related to current context
            if (currentContext) {
                var currentList: any[] = this.contextLists[currentContext]
                // console.log( currentList )
                var currentIntentIndex = currentList.findIndex(
                    i => i.displayName === this._mensaje.current.displayName
                )
                // console.log(currentIntentIndex)
                // Set next intent in the context
                if (currentList[currentIntentIndex + 1])
                    this.nextMensajesList.push(currentList[currentIntentIndex + 1])
                // Set previus intent in the context
                if (currentList[currentIntentIndex - 1])
                    this.nextMensajesList.push(currentList[currentIntentIndex + 1])
                // Set current intent
                this.nextMensajesList.push(currentList[currentIntentIndex])
            }

            //  Set uncontext intents
            var allIntents = this._cache.getDataKey<IntentModel[]>('intents')
            if (allIntents && allIntents.length > 0) {
                await this._loading.asyncForEach(allIntents,
                    (intent: IntentModel) => {
                        let intentStored = this.nextMensajesList.find(
                            i => i.displayName === intent.displayName
                        )
                        if (intent.displayName != 'Default Context Intent'
                        && intent.displayName != 'Default Fallback Intent'
                        && !intentStored) this.nextMensajesList.push(intent)
                    }
                )
            }
        } else {
            this.nextMensajesList = []
        }
        // console.log( this.nextMensajesList )
    }



    get activeContextSelector() {
        if ( this.respuesta.tipo == 'simple' ) {
            return true;
        } else if (this.currentContext) {
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
        const contextName = selected.context
        if (contextName) {
            if (!this.respuesta.outputContexts) {
                this.respuesta.outputContexts = []
            }
            this.respuesta.outputContexts.push(contextName)

            // Search for nextIntentList
            if (!this.nextMensajesList && this.nextMensajesList.length < 1) {
                this.respuesta.nextIntent = '*fin';
            }
        } else {
            this.respuesta.nextIntent = '*fin';
        }
        return this.respuesta;
    }

    setContextSelected(contexts?: string[]) {
        var context: string = ''
        if (contexts && contexts.length > 0) {
            if (this.contextLists ) {
                contexts.forEach(c => {
                    if (c in this.contextLists) context = c
                })
            }
        }
        return context;
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
        await this._loading.asyncForEach(lists, async (contextName) => {
            console.log(this.contextLists[contextName]);
            let mensajeFinded = this.contextLists[contextName].find(
                intent => intent.displayName == nextIntent
            )
            if(mensajeFinded) nextMensaje = mensajeFinded
            console.log(nextMensaje);
        })
        return nextMensaje && nextMensaje.contexto ? nextMensaje.contexto : ''
    }


    async setNextIntentContext(change: MatSelectChange) {
        var allIntents = this._cache.getDataKey<IntentModel[]>('intents')
        var intentSelected = allIntents.find(i => i.displayName === change.value)
        if (intentSelected) {
            var contextStored: string[]
            if (this.respuesta.outputContexts && this.respuesta.outputContexts.length > 0) {
                contextStored = this.respuesta.outputContexts
            }
            this.respuesta.outputContexts = [];


            // Validate context of grand-context
            contextStored.forEach(c => {
                if (c in this.contextLists)
                    this.respuesta.outputContexts.push(c)
            })

            this.respuesta.outputContexts = [
                ...intentSelected.inputContextNames.map(c =>
                    c.slice(c.lastIndexOf('/') + 1) ),
                ...this.respuesta.outputContexts
            ]
            console.log( this.respuesta.outputContexts )
        }
    }


    openAddIntent() {
        const dialog = this._dialog
            .open(AddMensajeComponent, {
            width: "450px",
            })

        dialog.afterClosed().subscribe(newIntent => {
            this.nextMensajesList.push(newIntent)
        })
    }


    /**
     * Obtiene el tipo de respuesta seleccionado del select
     * @param {MatSelectChange} tipoSelected - Contiene la propidad valor que es de tipo `TipoEntityType.name`
     */
    onTipoSelected(tipoSelected: MatSelectChange) {
        let simpleStored = this._mensaje.respuestasList.filter(
            (r) => r.tipo == 'simple'
        );
        // if (tipoSelected.value == 'simple' && simpleStored.length > 1) {
        //     console.log(this._mensaje.respuestasList, tipoSelected.value);
        //     this._alerts.sendMessageAlert(
        //         'No puedes agregar más de una respuesta simple'
        //     );
        // } else {
            this.selectedRes = this.tiposRes.find( t => t.name == tipoSelected.value)
            this.respuesta.tipo = this.selectedRes.name;
        // }
    }

    /** Recibe los cambios en los formularios hijos como simple, CODICIONAL, BUSCAR Y GRUPO DE DATOS */
    catchResult(msg: any) {
        this.result = msg;
    }

    /**
     * Valida la respuesta que se ha de guardar en FIRESTORE
     *
     * @param {RespuestaModel} respuestaObj Objeto de respuesta modelado como RespuestaModel
     * @returns {RespuestaModel} Respuesta como objeto sin tipo declarado
     */
    async validateRespuesta(respuestaObj: RespuestaModel) {


        let nextIntentContext =
            await this.setNextContext(respuestaObj.nextIntent)
        if (respuestaObj.outputContexts && respuestaObj.outputContexts.length <= 0  ) {
            respuestaObj.outputContexts =[nextIntentContext]
        } else {
            // respuestaObj.outputContext.push(nextIntentContext)
         }

        if (respuestaObj.result.asDefault) {
            var defaultStored = this._mensaje.respuestasList.filter(
                (r) => r.result.asDefault
            )
            if (defaultStored.length > 1) {
                this._alerts.sendMessageAlert('No puedes asignar dos respuestas como "Default"')
            }
        }

        respuestaObj.outputContexts
        let respuestaClean, output = {};
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
            await this._loading.asyncForEach(respuestaKeys, (key) => {
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
        this.respuesta.outputContexts
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
