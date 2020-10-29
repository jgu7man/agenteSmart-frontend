import { Component, OnInit } from '@angular/core';
import {OpcionesAgenteModel} from '../opciones.model';

@Component({
  selector: 'aSmart-datos-contacto',
  templateUrl: './datos-contacto.component.html',
  styleUrls: ['./datos-contacto.component.scss']
})
export class DatosContactoComponent implements OnInit {

  config: OpcionesAgenteModel
  constructor () {
    this.config = new OpcionesAgenteModel('')
   }

  ngOnInit(): void {
  }

}
