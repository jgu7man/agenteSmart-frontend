import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TarjetaEditComponent } from './tarjeta-edit/tarjeta-edit.component';

@Component({
  selector: 'aSmart-tarjetas',
  templateUrl: './tarjetas.component.html',
  styleUrls: ['./tarjetas.component.scss']
})
export class TarjetasComponent implements OnInit {

  constructor (
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  addCard() {
    var editBox = this._dialog
      .open( TarjetaEditComponent, {
        minWidth: 350,
    })
  }

}
