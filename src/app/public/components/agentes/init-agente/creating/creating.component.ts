import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CrearAgenteService } from '../form-crear-agente/crear-agente.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  templateUrl: './creating.component.html',
  styleUrls: ['./creating.component.scss']
})
export class CreatingComponent implements OnInit {

  constructor (
    private _dialog: MatDialogRef<CreatingComponent>,
    // private _create: CrearAgenteService
  ) { }

  ngOnInit(): void {
    
  }

}
