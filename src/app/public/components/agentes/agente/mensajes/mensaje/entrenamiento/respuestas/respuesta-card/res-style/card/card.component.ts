import { Component, OnInit } from '@angular/core';
import { RespuestaCard, RespuestaCardButton } from '../../../respuesta.model';

@Component({
  selector: 'aSmart-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  botones: RespuestaCardButton[] = []
  card: RespuestaCard = {
    titulo:'', body: '', imagenURL: '', botones:this.botones
  }
  
  constructor() { }

  ngOnInit(): void {
  }

}
