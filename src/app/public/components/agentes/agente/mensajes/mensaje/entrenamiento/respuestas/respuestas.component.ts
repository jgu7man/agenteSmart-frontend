import { Component, OnInit } from '@angular/core';
import { RespuestaModel } from './respuesta.model';
import { RespuestasService } from './respuestas.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'aSmart-respuestas',
  templateUrl: './respuestas.component.html',
  styleUrls: ['./respuestas.component.scss']
})
export class RespuestasComponent implements OnInit {

  respuestasList: RespuestaModel[] = []
  currentContext: string
  nextIntent: string
  constructor (
    private _respuestas: RespuestasService,
  ) { }

  ngOnInit(): void {
  }
  
  async getNextIntent() {
        
  }

  addRespuesta() {
    this.respuestasList.push( {
      tipo: '',
      estiloRespuesta: 'texto',
      nextContext: this._respuestas.currentContext,
      nextIntent: this._respuestas.nextMensaje
    })
  }

}
