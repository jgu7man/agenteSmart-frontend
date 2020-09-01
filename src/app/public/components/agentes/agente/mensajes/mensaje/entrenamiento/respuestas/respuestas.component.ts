import { Component, OnInit, OnDestroy } from '@angular/core';
import { RespuestaModel, FormPredefinida } from './respuesta.model';
import { RespuestasService } from './respuestas.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take, debounceTime, repeat, repeatWhen, expand, tap } from 'rxjs/operators';

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
  constructor (
    private _respuestas: RespuestasService,
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

  addRespuesta() {
    this.respuestasList.push(
      new RespuestaModel( '',
        this._respuestas.nextMensaje,
        this._respuestas.currentContext,
        this._respuestas.currentContext,
        this.newOutputMensaje
        ) )
  }

  async getResponses() {
    this.respuestasList = await this._respuestas.getMensajeResponses()
    console.log(this.respuestasList);
  }


  ngOnDestroy() {
    this.resAddedSub.unsubscribe()
  }

}
