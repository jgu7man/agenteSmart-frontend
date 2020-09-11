import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { RespuestaCard, RespuestaCardButton } from '../../mensajes/mensaje/entrenamiento/respuestas/respuesta.model';
import { fromEvent, Observable, zip } from 'rxjs';
import { pluck, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'aSmart-estatica-tarjeta',
  templateUrl: './estatica-tarjeta.component.html',
  styleUrls: ['./estatica-tarjeta.component.scss']
})
export class EstaticaTarjetaComponent implements OnInit {

  @ViewChild( 'titulo' ) tituloInput: ElementRef
  private listenTitulo: Observable<string>
  @ViewChild('body') bodyInput: ElementRef
  

  @Output() edited: EventEmitter<RespuestaCard> = new EventEmitter()
  @Input() contenido: RespuestaCard = {
    titulo: '', body: '', imagenURL: ''
  }
  
  constructor () { }
  
  
  ngOnInit(): void {
  }
  
  


}
