import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { RespuestaModel, FormPredefinida } from './respuesta.model';
import { RespuestasService } from './respuestas.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take, debounceTime, repeat, repeatWhen, expand, tap } from 'rxjs/operators';
import { RespuestaCardComponent } from './respuesta-card/respuesta-card.component';
import { Loading } from '../../../../../../../../Gdev-Tools/loading/loading.service';

@Component({
  selector: 'aSmart-respuestas',
  templateUrl: './respuestas.component.html',
  styleUrls: ['./respuestas.component.scss']
})
export class RespuestasComponent implements OnInit, OnDestroy {

  respuestasList: RespuestaModel[] = []
  currentContext: string
  nextIntent: string
  newOutputMensaje: FormPredefinida
  resAddedSub: Subscription
  @ViewChildren(RespuestaCardComponent) cards: QueryList<RespuestaCardComponent>

  constructor (
    private _respuestas: RespuestasService,
    private loading: Loading,
  ) {
    this.newOutputMensaje = new FormPredefinida('texto', '')
   }

  ngOnInit(): void {
    this.getResponses()
    this.resAddedSub = this._respuestas.respuestaAdded
    .subscribe(() =>{this.getResponses()})
  }
  
  async getNextIntent() {
  }

  async addRespuesta() {
    this.respuestasList.push(
      new RespuestaModel( '',
        '',
        this._respuestas.currentContext,
        this._respuestas.currentContext,
        this.newOutputMensaje
      ) )
    await this.loading.waitFor( 100 )
    this.cards.last.switchEditResp = true
  }

  async getResponses() {
    this.respuestasList = await this._respuestas.getMensajeResponses()
    console.log(this.respuestasList);
  }


  ngOnDestroy() {
    this.resAddedSub.unsubscribe()
  }

}
