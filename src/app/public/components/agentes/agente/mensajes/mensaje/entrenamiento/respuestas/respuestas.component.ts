import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { RespuestaModel, FormPredefinida } from './respuesta.model';
import { RespuestasService } from './respuestas.service';
import { Subscription } from 'rxjs';
import { RespuestaCardComponent } from './respuesta-card/respuesta-card.component';
import { Loading } from 'src/app/Gdev-Tools/loading/loading.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'aSmart-respuestas',
  templateUrl: './respuestas.component.html',
  styleUrls: ['./respuestas.component.scss']
})
export class RespuestasComponent implements OnInit, OnDestroy {


  /** Respuestas obtenidas de la función de obtener respuestas */
  respuestasList: RespuestaModel[] = []
  /** Modelo de inicio para crear una nueva respuesta predefinida */
  newOutputMensaje: FormPredefinida
  /** Suscripción a los cambios de la lista de respuestas */
  respuestasChangesSubs: Subscription
  /** Lista de componentes de respuestas */
  @ViewChildren(RespuestaCardComponent) cards: QueryList<RespuestaCardComponent>


  
  constructor (
    private _respuestas: RespuestasService,
    private loading: Loading,
  ) {
    this.newOutputMensaje = new FormPredefinida('texto', '')
   }

  ngOnInit(): void {
    this.getResponses()
    this.respuestasChangesSubs = this._respuestas.onRespuestasChanged
      .subscribe( () => {
        this.getResponses()
        this.newOutputMensaje = new FormPredefinida( 'texto', '' )
      } )
  }
  
  /**
   * Crea una nueva respuesta en el arreglo de respuestas para iniciar 
   * con la creación de la misma y la abre por defecto
   */
  async addRespuesta() {
    let lastIndex = this.respuestasList.length
    this.respuestasList.push(
      new RespuestaModel( '',
        this._respuestas.nextMensaje,
        this._respuestas.currentContext,
        this._respuestas.currentContext,
        this.newOutputMensaje,
        lastIndex
      ) )
    await this.loading.waitFor( 100 )
    this.cards.last.switchEditResp = true
  }

  /** Obtiene las respuestas y crea la lista */
  async getResponses() {
    this.respuestasList = await this._respuestas.getMensajeResponses()
  }

  

  trackResponseById( index: number, respuesta: RespuestaModel ) {
    return respuesta.index
  }



  /** Se desuscribe de los cambios en la lista de respuestas */
  ngOnDestroy() {
    this.respuestasChangesSubs.unsubscribe()
  }

}
