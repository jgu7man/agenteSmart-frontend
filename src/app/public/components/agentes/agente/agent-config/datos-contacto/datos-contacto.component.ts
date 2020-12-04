import { Component, OnInit } from '@angular/core';
import {AgenteConfigModel} from '../agent-config.model';

@Component({
  selector: 'aSmart-datos-contacto',
  templateUrl: './datos-contacto.component.html',
  styleUrls: ['./datos-contacto.component.scss']
})
export class DatosContactoComponent implements OnInit {

  config: AgenteConfigModel
  constructor () {
    this.config = new AgenteConfigModel('')
   }

  ngOnInit(): void {
  }

}
