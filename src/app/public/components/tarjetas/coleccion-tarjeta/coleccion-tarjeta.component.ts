import { Component, Input, OnInit } from '@angular/core';
import { RespuestaCard } from '../../agentes/agente/mensajes/mensaje/entrenamiento/respuestas/respuesta.model';

@Component({
  selector: 'aSmart-coleccion-tarjeta',
  templateUrl: './coleccion-tarjeta.component.html',
  styleUrls: ['./coleccion-tarjeta.component.scss']
})
export class ColeccionTarjetaComponent implements OnInit {

  @Input() contenido: RespuestaCard = {
    titulo: '', body: '', imagenURL: ''
  }

  constructor() { }

  ngOnInit(): void {
    console.log(this.contenido);
  }

}
