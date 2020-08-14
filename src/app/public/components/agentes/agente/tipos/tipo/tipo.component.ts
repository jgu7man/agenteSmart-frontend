import { Component, OnInit, Input } from '@angular/core';
import { TipoEntidadModel } from '../tipo.model';
import { TiposService } from '../tipos.service';

@Component({
  selector: 'aSmart-tipo',
  templateUrl: './tipo.component.html',
  styleUrls: ['./tipo.component.scss']
})
export class TipoComponent implements OnInit {


  @Input() tipo: TipoEntidadModel
  constructor (
    private _tipos: TiposService
  ) { }

  ngOnInit(): void {
  }

  

}
