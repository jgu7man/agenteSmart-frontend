import { Component, OnInit } from '@angular/core';
import { OpcionesAgenteService } from './opciones-agente.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfigRetrocesoComponent } from './config-retroceso/config-retroceso.component';

@Component({
  selector: 'aSmart-opciones',
  templateUrl: './opciones.component.html',
  styleUrls: ['./opciones.component.scss']
})
export class OpcionesComponent implements OnInit {

  constructor (
    public opciones_: OpcionesAgenteService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openConfigFallback() {
    var dialog = this._dialog.open(ConfigRetrocesoComponent, {
      width: '33%'
    })
  }

}
