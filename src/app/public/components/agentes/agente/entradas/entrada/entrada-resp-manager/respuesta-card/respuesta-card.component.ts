import { Component, OnInit, Input } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { RespuestaModel } from '../respuesta.model';

@Component({
  selector: 'aSmart-respuesta-card',
  templateUrl: './respuesta-card.component.html',
  styleUrls: [ './respuesta-card.component.scss' ],
})
export class RespuestaCardComponent implements OnInit {

  @Input() respuesta: RespuestaModel

  selectedRes: TipoRespuesta
  tiposRes: TipoRespuesta[] = [
    { name: '', color: 'grey', icono:'fa-plus'},
    { name: 'fija', color:'#935cff', icono: 'fa-comment-alt'},
    { name: 'condicional', color: '#42cbff', icono:'fa-code-branch' }
  ]

  constructor () {
    this.selectedRes = this.tiposRes[0]
   }

  ngOnInit(): void {
    if ( this.respuesta.tipo != '' ) {
      this.setSelectedRes()
    }
  }

  setSelectedRes() {
    this.selectedRes = this.tiposRes.find( tipo => tipo.name == this.respuesta.tipo )
    console.log(this.selectedRes);
  }

  onTipoSelected( tipoSelected: MatSelectChange ) {
    this.selectedRes = tipoSelected.value
  }

}


export interface TipoRespuesta {
  name: string,
  color: string,
  icono: string
}



