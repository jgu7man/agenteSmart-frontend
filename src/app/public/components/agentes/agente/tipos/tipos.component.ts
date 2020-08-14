import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TipoEntidadModel } from '../tipos/tipo.model';
import { Loading } from '../../../../../global/loading/loading.service';
import { TiposService } from './tipos.service';

@Component({
  selector: 'aSmart-tipos',
  templateUrl: './tipos.component.html',
  styleUrls: ['./tipos.component.scss']
})
export class TiposComponent implements OnInit {

  tiposList: TipoEntidadModel[]
  constructor (
    private _tipos: TiposService
  ) { }

  ngOnInit(): void {
    this.getTipos()
  }

  async getTipos() {
    this.tiposList = await this._tipos.get()
  }

  onNewTipo() {
    this.getTipos()
  }
  

}
