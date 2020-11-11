import {
    Component,
    OnInit,
    OnDestroy,
    ViewChildren,
    QueryList,
} from '@angular/core';
import { RespuestaModel, PredefinidaModel } from './respuesta.model';
import { RespuestasService } from './respuestas.service';
import { Subscription } from 'rxjs';
import { RespuestaCardComponent } from './respuesta-card/respuesta-card.component';
import { Loading } from 'src/app/Gdev-Tools/loading/loading.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CurrentMensajeService } from '../../current-mensaje.service';

@Component({
    selector: 'aSmart-respuestas',
    templateUrl: './respuestas.component.html',
    styleUrls: ['./respuestas.component.scss'],
})
export class RespuestasComponent implements OnInit, OnDestroy {
    /** Respuestas obtenidas de la función de obtener respuestas */
    respuestasList: RespuestaModel[] = [];
    /** Modelo de inicio para crear una nueva respuesta predefinida */
    newOutputMensaje: PredefinidaModel;
    /** Suscripción a los cambios de la lista de respuestas */
    respuestasChangesSubs: Subscription;
    /** Lista de componentes de respuestas */
    @ViewChildren(RespuestaCardComponent) cards: QueryList<RespuestaCardComponent>;

    constructor(
        private _respuestas: RespuestasService,
        private loading: Loading,
        public mensaje_: CurrentMensajeService
    ) {
        this.newOutputMensaje = new PredefinidaModel('texto', '');
        this._respuestas.getDataForRespuestas();
    }

    ngOnInit(): void {
        this.respuestasChangesSubs = this._respuestas.onRespuestasChanged.subscribe(
            () => {
                this.newOutputMensaje = new PredefinidaModel('texto', '');
            }
        );
    }

    /**
     * Crea una nueva respuesta en el arreglo de respuestas para iniciar
     * con la creación de la misma y la abre por defecto
     */
    async addRespuesta() {
        let lastIndex = this.mensaje_.respuestasList.length;
        this.mensaje_.respuestasList.push(
            new RespuestaModel(undefined, this.newOutputMensaje, lastIndex, '*fin')
        );
        await this.loading.waitFor(100);
        this.cards.last.switchEditResp = true;
    }

    
    trackResponseById(index: number, respuesta: RespuestaModel) {
        return respuesta.index;
    }

    public deleteRespuesta(respuestaId) {
        let resToDel = this.mensaje_.respuestasList.findIndex((res) => {
            res.id === respuestaId;
        });
        if (resToDel >= 0) {
            this._respuestas.delRespuesta(respuestaId)
        } else {
            this.mensaje_.respuestasList.splice(resToDel,1)
        }
        
    }

    /** Se desuscribe de los cambios en la lista de respuestas */
    ngOnDestroy() {
        this.respuestasChangesSubs.unsubscribe();
    }
}
