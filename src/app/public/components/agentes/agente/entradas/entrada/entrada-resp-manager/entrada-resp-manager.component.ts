import { Component, OnInit } from '@angular/core';
import { RespuestaModel } from './respuesta.model';
import { CacheService } from '../../../../../../../global/cache/cache.service';
import { RespuestasService } from './respuestas.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'aSmart-entrada-resp-manager',
  templateUrl: './entrada-resp-manager.component.html',
  styleUrls: ['./entrada-resp-manager.component.scss']
})
export class EntradaRespManagerComponent implements OnInit {

  respuestasList: RespuestaModel[] = []
  currentContext: string
  nextIntent: string
  constructor (
    private _respuestas: RespuestasService,
    private _activatedRoute: ActivatedRoute,
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
      nextIntent: this._respuestas.nextEntrada
    })
  }

}
