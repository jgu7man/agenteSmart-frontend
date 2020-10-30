import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TarjetaEditComponent } from './tarjeta-edit/tarjeta-edit.component';
import { TarjetaModel } from './tarjeta.model';
import { AddTarjetaComponent } from './add-tarjeta/add-tarjeta.component';
import { TarjetasService } from './tarjetas.service';
import { CurrentAgenteService } from '../agentes/agente/current-agente.service';

@Component({
  selector: 'aSmart-tarjetas',
  templateUrl: './tarjetas.component.html',
  styleUrls: ['./tarjetas.component.scss']
})
export class TarjetasComponent implements OnInit {

  constructor (
    private _dialog: MatDialog,
    public agente: CurrentAgenteService,
    public tarjetas: TarjetasService
  ) { }

  ngOnInit(): void {
  }

  addCard() {
    var editBox = this._dialog
      .open( AddTarjetaComponent, {
        minWidth: 350,
      } )
  }

  seeTarjeta( tarjeta?: TarjetaModel ) {
    var editBox = this._dialog
      .open( TarjetaEditComponent, {
        minWidth: 350,
        data: tarjeta
      } )
  }

}
