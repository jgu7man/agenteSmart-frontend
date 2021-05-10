import {
    Component,
    OnInit,
    OnDestroy,
    ViewChildren,
    QueryList,
    ViewChild,
    Output,
    EventEmitter,
} from '@angular/core';
import { RespuestaModel, SimpleModel } from './respuesta.model';
import { RespuestasService } from './respuestas.service';
import { Subscription } from 'rxjs';
import { RespuestaCardComponent } from './respuesta-card/respuesta-card.component';
import { GdevLoading } from 'src/app/gdev-tools/src/lib/loading/loading.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CurrentMensajeService } from '../../current-mensaje.service';
import { distinctUntilKeyChanged, filter, flatMap, tap } from 'rxjs/operators';

@Component({
    selector: 'aSmart-respuestas',
    templateUrl: './respuestas.component.html',
    styleUrls: ['./respuestas.component.scss'],
})
export class RespuestasComponent implements OnInit, OnDestroy {
    /** Respuestas obtenidas de la función de obtener respuestas */
    respuestasList: RespuestaModel[] = [];
    /** Modelo de inicio para crear una nueva respuesta simple */
    newOutputMensaje: SimpleModel;
    /** Suscripción a los cambios de la lista de respuestas */
    respuestasChangesSubs: Subscription;
    /** Lista de componentes de respuestas */
  @ViewChildren(RespuestaCardComponent) cards: QueryList<RespuestaCardComponent>;

  openedCard: number;

  @Output() lastPositionChange = new EventEmitter<number>();

    constructor(
        private _respuestas: RespuestasService,
        private _loading: GdevLoading,
        public mensaje_: CurrentMensajeService
    ) {
        this.newOutputMensaje = new SimpleModel('', []);
      this._respuestas.getDataForRespuestas();
      // this.mensaje_.current$.pipe(
      //   filter(mensaje => 'name' in mensaje),
      //   tap(mensaje => console.log(mensaje)),
      //   distinctUntilKeyChanged('name'),
      //   flatMap(() => this.mensaje_.respuestasList$)
      // ).subscribe(data => {
      //   console.log(data)

      //   this.respuestasList = data
      // })
    }

  ngOnInit(): void {
        this.respuestasChangesSubs = this._respuestas.onRespuestasChanged.subscribe(
            () => {
                this.newOutputMensaje = new SimpleModel('', []);
            }
        );
    }

    /**
     * Crea una nueva respuesta en el arreglo de respuestas para iniciar
     * con la creación de la misma y la abre por defecto
     */
    async addRespuesta() {
        let lastIndex = this.mensaje_.respuestasList$.getValue().length;
      this.mensaje_.respuestasList$.next([
        ...this.mensaje_.respuestasList$.getValue(),
        new RespuestaModel(undefined, this.newOutputMensaje, lastIndex, '*fin')
        ]
      );
        await this._loading.waitFor(500);
      this.cards.last.switchEditResp = true;
      let lastPosition = this.cards.last.ownElement.nativeElement.offsetTop
      this.lastPositionChange.emit(lastPosition);
      // window.scrollTo(lastPosition)
    }


    trackResponseById(index: number, respuesta: RespuestaModel) {
        return respuesta.index;
    }

    public deleteRespuesta(respuestaId, index) {
      console.log(this.mensaje_.respuestasList$);
      const respuestas = this.mensaje_.respuestasList$.getValue()
        let resToDel = respuestas.findIndex(
            (res) => res.id === respuestaId);

        if (resToDel >= 0) {
            this._respuestas.delRespuesta(respuestaId)
        }
        respuestas.splice(resToDel, 1)
      this.mensaje_.respuestasList$.next(respuestas)

    }

  onOpened(index) {
    this.openedCard = index
  }


  drop(event: CdkDragDrop<RespuestaModel[]>) {
      let respuestas = this.mensaje_.respuestasList$.getValue()
      moveItemInArray(respuestas, event.previousIndex, event.currentIndex);
      this._respuestas.updateRespuestasOrder(respuestas)

    }

    /** Se desuscribe de los cambios en la lista de respuestas */
    ngOnDestroy() {
        this.respuestasChangesSubs.unsubscribe();
    }
}
